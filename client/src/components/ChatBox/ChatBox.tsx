import Message from "./Message";
import { MessageType } from "../../types";
import React from "react";

type ChatBoxProps = {
  chat: MessageType[];
};

export default function ChatBox({ chat }: ChatBoxProps) {
  function is_last_message(i: number) {
    const current_msg = chat[i];
    if (i + 1 < chat.length) {
      const next_msg = chat[i + 1];
      if (current_msg?.client === next_msg?.client) {
        return false;
      }
    }
    return true;
  }

  return (
    <div className="relative mx-auto mb-[50px] flex h-3/4 w-full flex-auto drop-shadow-lg">
      <div className="absolute left-14 top-0 z-30 -translate-y-1/2 bg-transparent p-1 text-xl font-light text-gray-400">
        Sales Chat
      </div>
      <div className="absolute left-12 top-0 z-20 h-[6px] w-[120px] -translate-y-1/2 bg-white"></div>
      <div className="z-10 h-full w-full overflow-hidden rounded-[20px] border-[2px] border-prm-green bg-prm-white">
        <div className="h-full w-full flex-col-reverse overflow-y-auto px-10 py-4">
          {chat.map((msg, i) => (
            <Message message={msg} key={i} isLastMessage={is_last_message(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
