"use client";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import MessagesNavbar from "@/components/MobileMessageNavbar";
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
  {
    id: 53,
    title: "456 Oak Ave",
    subtitle: "Lorem ipsum dolor sit amet …",
    time: "5 min ago",
    read: true,
  },
  {
    id: 6432,
    title: "456 Oak Ave",
    subtitle: "Lorem ipsum dolor sit amet …",
    time: "5 min ago",
    read: false,
  },
  {
    id: 76523,
    title: "456 Oak Ave",
    subtitle: "Lorem ipsum dolor sit amet …",
    time: "5 min ago",
    read: true,
  },
  {
    id: 764523,
    title: "45",
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
    id: 323432423,
    text: "Sure, please ask your question.",
    sender: "other",
    time: "10:02 AM",
  },
  {
    id: 343245,
    text: "Sure, please ask your question.",
    sender: "other",
    time: "10:02 AM",
  },
  {
    id: 398765,
    text: "Sure, please ask your question.",
    sender: "other",
    time: "10:02 AM",
  },
  {
    id: 368,
    text: "Sure, please ask your question.",
    sender: "other",
    time: "10:02 AM",
  },
  {
    id: 3808,
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
            <MessagesNavbar />
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
                <Image src={"/icons/plusiconsend.svg"} alt="add" height={120} width={120} className="w-3 h-3" />
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
      <div className="hidden md:flex flex-col h-screen bg-[#1c1c1c]">
        <div className="h-full">
          <MessagesNavbar />
        </div>


        {/* Desktop View - Replace the empty div in your existing code */}
        <div className="hidden md:flex h-full bg-white rounded-t-3xl">
          {/* Left sidebar - Message list */}
          {/* Left sidebar - Message list */}
          <div className="w-full h-full border-r rounded-tl-3xl overflow-y-auto bg-white flex justify-end">
            <div className="w-96 h-full">
              {dummyChats.map((chat) => (
                <div key={chat.id}>
                  <div
                    className={`${selectedChat?.id === chat.id ? '' : ''
                      } flex justify-between items-start h-20 p-5 cursor-pointer`}
                    onClick={() => handleChatClick(chat)}
                  >
                    <div className="flex items-start">
                      <Image
                        src="/icons/similarlisting.png"
                        alt="Thumbnail"
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10 mr-3"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="text-[#2C3C4E] font-inter text-[14px] font-semibold leading-[124%]">
                            {chat.title}
                          </span>
                          <span className="text-[#2C3C4E] text-[10px] font-normal ml-2">
                            Just now
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-[#2C3C4E] font-inter text-[14px] font-medium leading-[120%]">
                            This is the count of total char . .
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <Image
                        src="/icons/staricon.svg"
                        height={48}
                        width={48}
                        className="h-6 w-6 text-yellow-400"
                        alt="Star"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle section - Chat/Message view */}
          <div className="w-full flex flex-col border-r">
            {selectedChat ? (
              <>
                {/* Chat messages */}
                <div className="flex-grow overflow-y-auto p-6">
                  {dummyMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 max-w-52 ${message.sender === "user" ? "ml-auto" : "mr-auto"
                        }`}
                    >
                      <div
                        className={`p-4 ${message.sender === "user"
                          ? "rounded-tl-xl rounded-bl-xl rounded-tr-xl bg-[#F4F4F4] text-[#2C3C4E]"
                          : "rounded-tr-xl rounded-br-xl rounded-tl-xl bg-[#353537] text-white"
                          } `}
                      >
                        <p className="font-inter text-[15px] font-normal leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                      {message.time && (
                        <span
                          className={`text-xs text-[rgba(44,60,78,0.8)] mt-1 ${message.sender === "user" ? "text-right" : "text-left"
                            }`}
                        >
                          {message.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat input */}
                <div className="p-4 border-t flex items-center">
                  <button className="w-10 h-10 rounded-full bg-[#F4F4F4] flex items-center justify-center mr-3">
                    <Image
                      src="/icons/plusiconsend.svg"
                      alt="add"
                      height={120}
                      width={120}
                      className="w-3 h-3"
                    />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message"
                    className="flex-grow rounded-md px-4 py-3 bg-[#F4F4F4] text-[#7D7D7D] text-sm placeholder-[#7D7D7D] outline-none"
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 400,
                    }}
                  />
                  <button className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center ml-3">
                    <Image
                      src="/icons/sendicon.svg"
                      alt="Send"
                      width={120}
                      height={120}
                      className="h-4 w-4"
                    />
                  </button>
                </div>
              </>
            ) : (
              /* Empty state when no chat selected */
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500">Select a conversation to start chatting</p>
              </div>
            )}
          </div>

          {/* Right section - Profile completion */}
          <div className="w-full rounded-tr-3xl bg-white">
            <div className="flex flex-col items-center p-6 h-full">
              <h2 className="text-xl font-semibold mb-4">Complete your profile!</h2>
              <p className="text-base mb-6">Stand out and Shine ✨</p>

              <div className="w-20 h-20 rounded-full bg-[#FFF0F0] flex items-center justify-center mb-6 relative">
                <span className="text-2xl">😊</span>
                <div className="absolute bottom-0 right-0 bg-[#007AFF] text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <span>+</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">Add your profile picture</p>

              <div className="w-full space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select the languages that apply</label>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-full bg-[#007AFF] text-white px-3 py-1 text-xs">English</button>
                    <button className="rounded-full border px-3 py-1 text-xs">French</button>
                    <button className="rounded-full border px-3 py-1 text-xs">Hindi</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button className="rounded-full border px-3 py-1 text-xs">Gujarati</button>
                    <button className="rounded-full border px-3 py-1 text-xs">Punjabi</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button className="rounded-full border px-3 py-1 text-xs">Mandarin</button>
                    <button className="rounded-full border px-3 py-1 text-xs">Telugu</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button className="rounded-full border px-3 py-1 text-xs">Urdu</button>
                    <button className="rounded-full border px-3 py-1 text-xs">Spanish</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">About you?</label>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    rows={4}
                    placeholder="Eg: work, hobby, lifestyle, anything"
                  ></textarea>
                </div>

                <button className="w-full bg-black text-white rounded-full py-2 font-medium mt-6">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
