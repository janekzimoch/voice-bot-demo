import React, { useState, useEffect, useRef } from "react";
import sendButton from "../../../public/send-button.png";
import Image from "next/image";

type MessageBoxProps = {
  handleSend: (message: string) => void;
};

export default function MessageBox({ handleSend }: MessageBoxProps) {
  const [message, setMessage] = useState("");
  const sendButtonRef = useRef<any>(null);
  const textareaRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Enter" && event.target === textareaRef.current) {
        if (!event.shiftKey) {
          event.preventDefault(); // Prevent line break in textarea
          sendButtonRef.current.click();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative h-1/4 w-full drop-shadow-lg ">
      <div className="absolute left-14 top-0 z-30 -translate-y-1/2 bg-transparent p-1 text-xl font-light text-gray-400">
        Input
      </div>
      <div className="absolute left-12 top-0 z-20 h-[6px] w-[70px] -translate-y-1/2 bg-white"></div>
      <div
        onClick={() => {
          if (message.length > 0) {
            setMessage("");
            handleSend(message);
          }
        }}
        className="absolute bottom-2 right-2 z-30 cursor-pointer p-3"
      >
        <Image
          src={sendButton}
          ref={sendButtonRef}
          alt=""
          width={32}
          height={32}
          className="transition-all duration-300 ease-in-out hover:translate-x-1"
        />
      </div>
      <div className="z-10 h-full w-full overflow-hidden rounded-[20px] border-[2px] border-prm-green bg-prm-white">
        <div className="text-md flex h-full w-full flex-row break-words p-4 pr-8 pt-6 font-light text-gray-400">
          <textarea
            name="prompt"
            placeholder="Type your message here... "
            value={message}
            ref={textareaRef}
            onChange={(e) => setMessage(e.target.value)}
            className="no-scrollbar scrollbar h-full w-full resize-none overflow-auto bg-transparent focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
