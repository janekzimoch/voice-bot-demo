// components/message.js
import Image from "next/image";
import botIcon from "../../../public/11x-logo.png";
import userIcon from "../../../public/user-icon.png";

import { Client, MessageType } from "../../types";

type MessageProps = {
  message: MessageType;
  isLastMessage: boolean;
};

export default function Message({ message, isLastMessage }: MessageProps) {
  const isChat = message.client === Client.bot;
  const justify_style = isChat ? "justify-start" : "justify-end";
  const rounded_none = isChat ? "bl" : "br";
  const order_msg = isChat ? "order-2" : "order-1";
  const order_icon = isChat ? "order-1" : "order-2";

  return (
    <>
      <div className={`chat-message ${isLastMessage ? "pb-3" : "pb-1"}`}>
        <div className={`flex items-end ${justify_style}`}>
          <div
            className={`${order_msg} mx-2 flex max-w-xs flex-col space-y-2 text-sm`}
          >
            {isChat ? (
              <div>
                <span
                  className={`inline-block rounded-lg ${
                    isLastMessage ? `rounded-${rounded_none}-none` : ""
                  } bg-prm-green/20 px-6 py-3 text-gray-600`}
                >
                  <p className="break-words">{message.message}</p>
                </span>
              </div>
            ) : (
              <div>
                <span
                  className={`inline-block rounded-lg ${
                    isLastMessage ? `rounded-${rounded_none}-none` : ""
                  } bg-prm-steel/50 px-6 py-3 text-gray-600`}
                >
                  <p className="break-all">{message.message}</p>
                </span>
              </div>
            )}
          </div>
          {isLastMessage ? (
            <Image
              alt={""}
              src={isChat ? botIcon : userIcon}
              className={`${order_icon}  h-6 w-6`}
            />
          ) : (
            <Image
              alt={""}
              src={botIcon}
              className={`${order_icon}  h-6 w-6 opacity-0`}
            />
          )}
        </div>
      </div>
    </>
  );
}
