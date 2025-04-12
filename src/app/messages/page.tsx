"use client";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import MobileMessagesNavbar from "@/components/MobileMessageNavbar";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

// Define the Chat type
interface Chat {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
}

// Define a Message type for the conversation view
interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  time?: string;
}

// Dummy data for chats
const dummyChats: Chat[] = [
  {
    id: 1,
    title: "265 Mainstreet, To...",
    subtitle: "This is the total number …",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    title: "123 Elm St",
    subtitle: "Another chat preview message …",
    time: "2 min ago",
    read: false,
  },
  {
    id: 4,
    title: "456 Oak Ave",
    subtitle: "Lorem ipsum dolor sit amet …",
    time: "5 min ago",
    read: true,
  },
  {
    id: 5,
    title: "456 Oak Ave",
    subtitle: "Lorem ipsum dolor sit amet …",
    time: "5 min ago",
    read: true,
  },
  {
    id: 6,
    title: "456 Oak Ave",
    subtitle: "Lorem ipsum dolor sit amet …",
    time: "5 min ago",
    read: false,
  },
  {
    id: 7,
    title: "456 Oak Ave",
    subtitle: "Lorem ipsum dolor sit amet …",
    time: "5 min ago",
    read: true,
  },
];

// Dummy data for conversation messages
const dummyMessages: Message[] = [
  {
    id: 1,
    text: "Hello, how can I help you?",
    sender: "other",
    time: "10:00 AM",
  },
  {
    id: 2,
    text: "I have a question regarding my rental.",
    sender: "user",
    time: "10:01 AM",
  },
  {
    id: 3,
    text: "Sure, please ask your question.",
    sender: "other",
    time: "10:02 AM",
  },
];

export default function ChatList() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* =======================
          MOBILE VIEW
          - Uses "md:hidden" to hide on larger screens
         ======================= */}
      <div className="md:hidden flex flex-col bg-[#1c1c1c] h-full">
        {/* Header (Mobile) */}
        {selectedChat ? (
          <header
            className={`sticky ${inter.className} top-0 z-10 bg-[#1F1F21] p-5 flex items-center justify-between`}
          >
            <div className="flex items-center">
              {/* Back Button */}
              <button onClick={handleBackClick} className="mr-4">
                <Image
                  src="/icons/backbuttonn.svg"
                  alt="Back"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </button>

              {/* Main Image */}
              <Image
                src="/icons/placeholderimageformessage.svg"
                alt="Main"
                width={30}
                height={30}
                className="w-[30px] h-[30px] mr-2 ml-3"
              />

              {/* Chat Title */}
              <span className="text-white font-inter text-[14px] font-medium leading-[194%]">
                {selectedChat.title}
              </span>
            </div>

            {/* View Button */}
            <button className="rounded-[57px] bg-[#353537] px-6 py-1.5">
              <span className="text-white text-center text-[12px] font-medium leading-[194%]">
                View
              </span>
            </button>
          </header>
        ) : (
          // If no chat selected: show the Mobile Messages Navbar
          <header className="flex-none sticky top-0 z-10">
            <MobileMessagesNavbar />
          </header>
        )}

        {/* MAIN CONTENT (Mobile) */}
        {selectedChat ? (
          // Conversation view
          <main className="flex-grow rounded-t-3xl flex flex-col overflow-y-auto bg-white p-5">
            {dummyMessages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 max-w-64 ${message.sender === "user" ? "self-end" : "self-start"
                  }`}
              >
                <div
                  className={`max-w-64 p-3 ${message.sender === "user" ? "rounded-tl-xl rounded-bl-xl rounded-tr-xl self-end bg-[#0A84FF] " : "self-start rounded-tr-xl rounded-br-xl rounded-tl-xl bg-[#F4F4F4]"
                    }`}
                  style={{


                  }}
                >
                  <p
                    className={`${message.sender === "user" ? 'text-white' : ' text-[#2C3C4E]'}  font-inter text-sm font-normal leading-relaxed`}
                  >
                    {message.text}
                  </p>
                </div>
                {message.time && (
                  <span className={`${message.sender === "user" ? 'text-right' : 'text-left'}`}
                    style={{
                      fontSize: "12px",
                      color: "rgba(44, 60, 78, 0.80)",
                      fontFamily: "Inter",
                      fontWeight: 400,
                      lineHeight: "194%",
                      display: "block",
                    }}
                  >
                    {message.time}
                  </span>
                )}
              </div>
            ))}
          </main>
        ) : (
          // Chat list (Mobile)
          <main className="flex-grow overflow-y-auto bg-white mt-5 rounded-t-3xl">
            {dummyChats.map((chat) => (
              <div key={chat.id}>
                <div
                  className={`${chat.read ? 'bg-white' : 'bg-[#F9F9F9]'} flex justify-between items-start p-5 cursor-pointer`}
                  onClick={() => handleChatClick(chat)}
                >
                  <div className="flex items-center">
                    <Image
                      src="/icons/similarlisting.png"
                      alt="Thumbnail"
                      width={40}
                      height={40}
                      className="rounded-full w-9 h-9 mr-3"
                    />
                    <div className="flex space-y-2 flex-col">
                      <div className="flex items-center">
                        <span
                          style={{
                            color: "#2C3C4E",
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontWeight: 600,
                            lineHeight: "124%",
                          }}
                        >
                          {chat.title}
                        </span>
                        <span
                          style={{
                            color: "#2C3C4E",
                            fontFamily: "Inter",
                            fontSize: "10px",
                            fontWeight: 400,
                            lineHeight: "120%",
                          }}
                          className="ml-4"
                        >
                          {chat.time}
                        </span>
                      </div>
                      <span
                        style={{
                          color: "#2C3C4E",
                          fontFamily: "Inter",
                          fontSize: "14px",
                          fontWeight: 500,
                          lineHeight: "120%",
                        }}
                      >
                        {chat.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="mt-1">
                      <Image
                        src="/icons/staricon.svg"
                        height={48}
                        width={48}
                        className="h-6 w-6"
                        alt="Star"
                      />
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </main>
        )}

        {/* FOOTER (Mobile) */}
        {selectedChat ? (
          // Conversation view: sticky input
          <footer className="flex-none sticky bottom-0 bg-[#1C1C1C] py-6 px-4">
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Image src={"/icons/plusiconsend.svg"} alt="add" height={120} width={120} className="w-3 h-3"/>
              </button>
              <input
                type="text"
                placeholder="Type your message"
                className="flex-grow rounded-md px-3 py-4 bg-white text-[#7D7D7D] text-sm placeholder-[#7D7D7D] outline-none"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                }}
              />
              <button className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center">
                <Image
                  src="/icons/sendicon.svg"
                  alt="Send"
                  width={120}
                  height={120}
                  className="h-4 w-4"
                />
              </button>
            </div>
          </footer>
        ) : (
          // Chat list footer on Mobile
          <footer className="flex-none bottom-0 sticky">
            <MobileBottomTabs />
          </footer>
        )}
      </div>

      {/* =======================
          DESKTOP VIEW
          - Uses "hidden md:flex" to appear only on md+ screens
         ======================= */}
      <div className="hidden md:flex flex-row h-full bg-[#1c1c1c]">
        {/* Left Column: Chat List */}
        <div className="min-w-[320px] max-w-[360px] h-full bg-white flex flex-col">
          {/* Optional top bar in the chat list (e.g. "Unread" or filters) */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <span
              style={{
                fontSize: "16px",
                color: "#2C3C4E",
                fontFamily: "Inter",
                fontWeight: 600,
              }}
            >
              Chats
            </span>
            {/* Example dropdown or button */}
            <button className="px-3 py-1 bg-gray-100 text-black rounded hover:opacity-80">
              Unread
            </button>
          </div>

          {/* Scrollable list */}
          <div className="flex-grow overflow-y-auto">
            {dummyChats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-start justify-between cursor-pointer px-4 py-3 hover:bg-gray-100"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center">
                  <Image
                    src="/icons/similarlisting.png"
                    alt="Thumb"
                    width={40}
                    height={40}
                    className="rounded-full w-9 h-9 mr-3"
                  />
                  <div>
                    <div className="flex items-center">
                      <span className="text-[#2C3C4E] font-semibold text-sm">
                        {chat.title}
                      </span>
                      <span className="ml-2 text-[10px] text-gray-500">
                        {chat.time}
                      </span>
                    </div>
                    <span className="text-[#2C3C4E] text-sm font-medium">
                      {chat.subtitle}
                    </span>
                  </div>
                </div>
                <div>
                  <Image
                    src="/icons/staricon.svg"
                    alt="Star"
                    width={20}
                    height={20}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Conversation */}
        <div className="flex flex-col flex-grow bg-white">
          {/* Header for the conversation */}
          {selectedChat ? (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Image
                  src="/icons/placeholderimageformessage.svg"
                  alt="Main"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <h2 className="text-[#2C3C4E] text-sm font-semibold">
                    {selectedChat.title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedChat.subtitle}
                  </p>
                </div>
              </div>
              <button className="rounded-full bg-[#353537] px-5 py-1 text-white text-sm font-medium hover:opacity-80">
                View
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center px-6 py-4 border-b border-gray-200">
              <span className="text-gray-500 text-sm font-medium">
                Select a chat to start messaging
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-grow overflow-y-auto px-6 py-4">
            {selectedChat ? (
              dummyMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 max-w-[70%] ${msg.sender === "user" ? "ml-auto" : ""
                    }`}
                >
                  <div
                    className={`p-3 rounded-tr-lg rounded-tl-lg rounded-bl-lg ${msg.sender === "user" ? "bg-blue-100" : "bg-gray-100"
                      }`}
                  >
                    <p className="text-sm text-[#2C3C4E] leading-snug">
                      {msg.text}
                    </p>
                  </div>
                  {msg.time && (
                    <div
                      className={`text-[12px] mt-1 ${msg.sender === "user" ? "text-right" : "text-left"
                        } text-gray-400`}
                    >
                      {msg.time}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No chat selected
              </div>
            )}
          </div>

          {/* Footer - message input */}
          {selectedChat && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Image
                    src="/icons/plusiconsend.svg"
                    alt="Add"
                    height={12}
                    width={12}
                  />
                </button>
                <input
                  type="text"
                  placeholder="Type your message"
                  className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center hover:opacity-80">
                  <Image
                    src="/icons/sendicon.svg"
                    alt="Send"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: "Complete your profile" example */}
        <div className="hidden lg:flex flex-col w-[320px] bg-white border-l border-gray-200 p-5 overflow-y-auto">
          <h3 className="text-lg font-semibold text-[#2C3C4E] mb-3">
            Complete your profile!
          </h3>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-pink-200 overflow-hidden mb-2">
              {/* Replace with actual user avatar if available */}
              <Image
                src="/icons/userIcon.png"
                alt="User Icon"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <button className="text-sm text-blue-600 hover:underline">
              Add your profile picture
            </button>
          </div>

          {/* Gender */}
          <label className="text-sm text-gray-600 mb-1" htmlFor="gender">
            Gender
          </label>
          <select
            id="gender"
            className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full text-sm focus:outline-none"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            {/* etc... */}
          </select>

          {/* Languages */}
          <label className="text-sm text-gray-600 mb-1" htmlFor="languages">
            Select the languages you speak
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Example language chips / checkboxes */}
            <button className="border border-gray-300 rounded-full px-2 py-1 text-xs hover:bg-gray-200">
              English
            </button>
            <button className="border border-gray-300 rounded-full px-2 py-1 text-xs hover:bg-gray-200">
              Spanish
            </button>
            <button className="border border-gray-300 rounded-full px-2 py-1 text-xs hover:bg-gray-200">
              German
            </button>
            {/* Extend or make them checkboxes, etc. */}
          </div>

          {/* Bio / Hobby / About */}
          <label className="text-sm text-gray-600 mb-1" htmlFor="bio">
            About you
          </label>
          <textarea
            id="bio"
            rows={3}
            className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full text-sm focus:outline-none"
            placeholder="e.g. work, hobby, lifestyle, anything"
          ></textarea>

          {/* Save button */}
          <button className="rounded-md bg-[#007AFF] text-white text-sm font-semibold py-2 px-4 hover:opacity-80">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
