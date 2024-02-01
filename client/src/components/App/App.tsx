import Head from "next/head";
import { useEffect, useState } from "react";
import * as dotenv from "dotenv";
import { useSession } from "@supabase/auth-helpers-react";

import ChatBox from "~/components/ChatBox/ChatBox";
import MessageBox from "~/components/MessageBox/MessageBox";
import SettingsBox from "~/components/SettingsBox/SettingsBox";

import { Client, MessageType } from "~/types";
import { Settings } from "~/types/index";
import { useRouter } from "next/router";
dotenv.config();

const codec = "audio/mpeg";
const maxBufferDuration = 60; // Maximum buffer duration in seconds
const maxConcurrentRequests = 3; // Maximum concurrent requests allowed
const request = {
  text: "",
  voice_settings: {
    similarity_boost: 0.5,
    stability: 0.35,
  },
};

export default function App({
  initialSettings,
  id,
}: {
  initialSettings: Settings | null;
  id: number;
}) {
  const session = useSession();
  const [chat, setChat] = useState<MessageType[]>([
    {
      client: Client.bot,
      message: `Hey there! This is ${
        initialSettings?.salesperson_name ?? "___"
      } calling from ${
        initialSettings?.company_name ?? "___"
      }. How are you doing today?`,
    },
  ]);

  // Queue for managing concurrent requests
  const requestQueue: Function[] = [];

  async function stream(text: string) {
    const audioElement = new Audio();
    const mediaSource = new MediaSource();
    request.text = text;
    audioElement.src = URL.createObjectURL(mediaSource); // Set up the MediaSource as the audio element's source
    audioElement.play(); // Start playing the audio element immediately

    mediaSource.addEventListener("sourceopen", () => {
      const sourceBuffer = mediaSource.addSourceBuffer(codec); // Adjust the MIME type accordingly
      let isAppending = false;
      let appendQueue: ArrayBuffer[] = [];
      function processAppendQueue() {
        if (!isAppending && appendQueue.length > 0) {
          isAppending = true;
          const chunk = appendQueue.shift();
          chunk && sourceBuffer.appendBuffer(chunk);
        }
      }
      sourceBuffer.addEventListener("updateend", () => {
        isAppending = false;
        processAppendQueue();
      });
      function appendChunk(chunk: ArrayBuffer) {
        appendQueue.push(chunk);
        processAppendQueue();
        // while (
        //   mediaSource.duration - mediaSource.currentTime >
        //   maxBufferDuration
        // ) {
        //   const removeEnd = mediaSource.currentTime - maxBufferDuration;
        //   sourceBuffer.remove(0, removeEnd);
        // }
      }

      async function fetchAndAppendChunks() {
        try {
          // Check if the maximum concurrent requests limit is reached
          if (requestQueue.length >= maxConcurrentRequests) {
            // Queue the request for later execution
            return new Promise((resolve) => {
              requestQueue.push(resolve);
            });
          }

          // Fetch chunk of data from proxy API
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BE_URL}/voice`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            },
          );
          if (!response.body) {
            console.error("Streaming not supported by the server");
            return;
          }

          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break; // No more data to read
            }
            appendChunk(value.buffer); // Append the received chunk to the buffer
          }
        } catch (error) {
          console.error("Error fetching and appending chunks:", error);
        } finally {
          const nextRequest = requestQueue.shift(); // Remove the request from the queue
          if (nextRequest) {
            nextRequest();
          }
        }
      }
      fetchAndAppendChunks(); // Call the function to start fetching and appending audio chunks
    });
  }

  async function onMessageSent(text: string) {
    const usrMsg: MessageType = {
      client: Client.user,
      message: text,
    };
    const body = {
      human_say: text,
      conversation_history: chat.map(
        (msg) =>
          `${
            msg.client === Client.user
              ? "User"
              : initialSettings?.salesperson_name ?? "User"
          }: ${msg.message} <END_OF_TURN>`,
      ),
    };
    console.log("body: ", body);
    console.log("session: ", session?.access_token);
    setChat([...chat, usrMsg]); // for some rason this does not persist beyond this function
    const botResponse = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
    const botMessage = botResponse.say.replace(/<END_OF_TURN>/g, "");
    const botMsg: MessageType = {
      client: Client.bot,
      message: botMessage,
    };
    setChat([...chat, usrMsg, botMsg]);
    stream(botMessage);
  }

  return (
    <>
      <Head>
        <title>Sales Bot App</title>
        <meta name="description" content="Sales Bot App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto mt-8 items-center justify-start bg-white py-12">
        <div className="grid grid-cols-3 gap-12">
          <div className="col-span-2 flex h-[calc(100vh-112px)] flex-col">
            <ChatBox chat={chat} />
            <MessageBox handleSend={(message) => onMessageSent(message)} />
          </div>
          <div className="flex h-[calc(100vh-112px)] w-full flex-col">
            <SettingsBox initialSettings={initialSettings} id={id} />
          </div>
        </div>
      </div>
    </>
  );
}
