"use client";
import LoginModal from "@/components/LoginPopup";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import MessagesNavbar from "@/components/MobileMessageNavbar";
import OnBoardingPopup from "@/components/OnboardingPopup";
import SignUpModal from "@/components/RegisterPopup";
import api from "@/lib/axios";
import { setResultsCount } from "@/redux/slices/messageSlice";
import { openPopup } from "@/redux/slices/showPopups";
import { RootState } from "@/redux/store/store";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProfileCreationModal from "@/components/ProfileCreationPopup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

// Define interfaces based on your backend API response
interface User {
  _id: string;
  fullName: string;
  email?: string;
  profilePicture?: string;
}

interface RentalProperty {
  _id: string;
  listedBy: User;
  propertyType: string;
  location: string;
  images: string[];
  monthlyPrice: number;
}

interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  image?: string;
  time: Date;
}

interface Chat {
  _id: string;
  users: User[];
  otherUsers: User[];
  messages: Message[];
  lastMessage: {
    content: string;
    sender: string | User;
    time: Date;
  };
  rentalProperty?: RentalProperty;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  starred?: boolean; // UI state property
  isStarred?: boolean; // Backend property
}

export default function ChatList() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageInput, setMessageInput] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [networkError, setNetworkError] = useState<boolean>(false);
  const router = useRouter();

  //Image uploading addition 
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasShownProfilePopup, setHasShownProfilePopup] = useState<boolean>(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if token exists in localStorage
        const token = localStorage.getItem('token'); // or whatever key you use

        if (!token) {
          setIsAuthenticated(false);
          setCheckingAuth(false);
          return;
        }

        // Validate token with a lightweight API call
        const response = await api.get('/api/auth/get-details');

        if (response.data.success) {
          setIsAuthenticated(true);
          setCurrentUserId(response.data.user?._id || '');


          const user = response.data.user;
          // If aboutYou or phoneNumber is missing, profile is incomplete
          if (!user.aboutYou || !user.phoneNumber) {
            setIsProfileComplete(false);
          } else {
            setIsProfileComplete(true);
          }

        } else {
          // Invalid token
          localStorage.removeItem('auth_token'); // Clear invalid token
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);


  const dispatch = useDispatch();
  const { gender, languages, sortBy, isFilterApplied } = useSelector(
    (state: RootState) => state.candidateFilter
  );


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file size and type
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Network status monitoring
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleOnline = () => {
      console.log("Browser is online. Fetching latest data...");
      setNetworkError(false);
      fetchChats();
    };

    const handleOffline = () => {
      console.log("Browser is offline.");
      setNetworkError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get current user ID (stored during login)
  useEffect(() => {
    const checkAuthAndGetUser = async () => {
      try {
        setCheckingAuth(true);

        // Check if token exists in localStorage
        const token = localStorage.getItem('token'); // use your actual token key here

        if (!token) {
          console.log('No token found in localStorage');
          setIsAuthenticated(false);
          setCheckingAuth(false);
          return;
        }

        // If token exists, try to get user details
        const response = await api.get('/api/auth/get-details');

        if (response.data.success) {
          setIsAuthenticated(true);
          setCurrentUserId(response.data.user._id);
          console.log(`User authenticated with ID: ${response.data.user._id}`);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('auth_token'); // Clear invalid token
          console.log('Invalid token - removed from localStorage');
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        localStorage.removeItem('token'); // Clear invalid token
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthAndGetUser();
  }, []);
  // Fetch chats function
  // Fetch chats function
  const fetchChats = async (retryCount = 0) => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      console.log(`[${new Date().toISOString()}] Fetching chats for user: ${currentUserId}`);

      // Only include filter params if filters have been applied
      let url = '/api/chats';
      const params = new URLSearchParams();

      if (isFilterApplied) {
        if (gender !== 'any') {
          params.append('gender', gender);
        }

        if (languages.length > 0) {
          params.append('languages', languages.join(','));
        }

        if (sortBy) {
          params.append('sortBy', sortBy);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await api.get(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log(`[${new Date().toISOString()}] Chats received: ${response.data.data.length}`);

      if (response.data.success) {
        // Update the chats state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedChats = response.data.data.map((chat: any) => {
          return {
            ...chat,
            starred: chat.isStarred || false
          };
        });
        setChats(updatedChats);

        // Update the result count in Redux
        dispatch(setResultsCount(response.data.data.length));
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching chats:`, error);

      // Retry logic
      if (retryCount < 3) {
        console.log(`Retrying fetchChats (${retryCount + 1}/3)...`);
        setTimeout(() => fetchChats(retryCount + 1), 2000);
      }
    } finally {
      setLoading(false);
    }
  };



  const handleProfileComplete = () => {
    setIsProfileComplete(true);
    setHasShownProfilePopup(true); // Consider the popup shown once profile is completed
  };




  // Polling mechanism for chats
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!currentUserId) return;

    // Initial fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchChats();

    // Set up polling every 15 seconds
    const interval = setInterval(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fetchChats();
    }, 15000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, isFilterApplied, gender, languages, sortBy]);

  // Fetch messages when selecting a chat
  const handleChatClick = async (chat: Chat) => {
    try {
      setLoading(true);
      console.log(`[${new Date().toISOString()}] Fetching chat details for: ${chat._id}`);

      const response = await api.get(`/api/chats/${chat._id}`);

      if (response.data.success) {
        setSelectedChat(response.data.data);
        setMessages(response.data.data.messages || []);
        console.log(`Messages fetched: ${response.data.data.messages?.length || 0}`);

        // Mark chat as read
        await api.put(`/api/chats/${chat._id}/read`);

        // Update unread count in chat list
        setChats(prevChats =>
          prevChats.map(c =>
            c._id === chat._id ? { ...c, unreadCount: 0 } : c
          )
        );

        // Scroll to the bottom after messages load
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Error fetching chat details:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const popupShownBefore = localStorage.getItem('profilePopupShown');
    if (popupShownBefore === 'true') {
      setHasShownProfilePopup(true);
    }
  }, []);

  // Update local storage when popup is shown
  useEffect(() => {
    if (hasShownProfilePopup) {
      localStorage.setItem('profilePopupShown', 'true');
    }
  }, [hasShownProfilePopup]);


  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBackClick = () => {
    // Check if profile popup should appear
    if (!isProfileComplete && hasSentFirstMessage && !hasShownProfilePopup) {
      dispatch(openPopup('ProfileCreation'));
      setHasShownProfilePopup(true); // Mark that we've shown the popup
    }

    setSelectedChat(null);
    // Refresh chat list
    fetchChats();
  };

  //TODO : Add logic for starred messages
  const handleStarToggle = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat from opening when clicking the star

    try {
      const response = await api.post(`/api/chats/${chatId}/star`);

      if (response.data.success) {
        // Update the local state to reflect the star status change
        setChats(prevChats =>
          prevChats.map(chat =>
            chat._id === chatId ? { ...chat, starred: !chat.starred } : chat
          )
        );
      }
    } catch (error) {
      console.error('Error toggling star status:', error);
    }
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !imageFile) || !selectedChat) return;

    try {
      setIsUploading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('content', messageInput.trim() || 'Image');

      if (imageFile) {
        formData.append('messageImage', imageFile);
      }

      console.log(`[${new Date().toISOString()}] Sending message to chat: ${selectedChat._id}`);

      const response = await api.post(
        `/api/chats/${selectedChat._id}/messages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        console.log(`[${new Date().toISOString()}] Message sent successfully`);

        // Set flag that user has sent a message
        setHasSentFirstMessage(true);

        setMessages(response.data.data.messages);
        setMessageInput("");
        setImageFile(null);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }

        // Immediately fetch updated chat list
        fetchChats();

        // Scroll to the bottom
        scrollToBottom();
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error sending message:`, error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  // Format relative time (e.g., "Just now", "2 min ago")
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return date.toLocaleDateString();
  };

  // Format chat title with truncation for long titles
  const formatChatTitle = (chat: Chat): string => {
    let title = "";

    if (chat.rentalProperty && chat.rentalProperty.location) {
      // Use street from location object
      title = chat.rentalProperty.location;
    } else {
      // Use other user's name
      const otherUser = chat.otherUsers?.[0];
      title = otherUser ? otherUser.fullName : "Chat";
    }

    // Truncate title if longer than 40 characters
    if (title.length > 40) {
      return title.substring(0, 20) + "...";
    }

    return title;
  };

  return (
    <div className="h-screen flex flex-col">
      {checkingAuth ? (
        // Show loading spinner while checking authentication
        <div className="h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        // Locked inbox screen similar to the image
        <div className={`flex min-h-screen flex-col bg-black ${inter.className}`}>
          {/* Header */}
          <div className="bg-black text-white p-4 text-center">
            <h1 className={`text-sm font-medium ${inter.className}`}>Messages</h1>
            {/* Inbox heading */}
            <div className="flex mt-4">
              <h2 className="text-2xl font-bold">Inbox</h2>
            </div>
          </div>

          {/* Locked messages content */}
          <div className="flex-grow rounded-t-3xl flex bg-white flex-col items-center p-6">
            <div className="">
              <Image alt="keylock" src={"/icons/keylock.svg"} height={300} width={300} className="" />
            </div>
            <h3 className="text-xl font-semibold text-[#2C3C4E] mb-2">Log in to see messages</h3>
            <p className="text-[#2C3C4E] text-center font-light mb-8">
              Once you login, you will find the messages here.
            </p>
            <button
              onClick={() => dispatch(openPopup("onboarding"))}
              className="bg-black text-white py-3 px-6 rounded-full w-full text-center font-medium"
            >
              Login
            </button>
          </div>

          {/* Bottom navigation bar */}
          <OnBoardingPopup />
          <SignUpModal />
          <LoginModal />

          <div className="sticky bottom-0 bg-[#1C1C1C] z-10">
            <MobileBottomTabs />
          </div>
        </div>
      ) : (
        // Original component content when authenticated
        <>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* Network Error Banner */}
          {networkError && (
            <div className="bg-red-500 text-white p-2 text-center">
              You are offline. Some features may be unavailable.
            </div>
          )}

          {/* Mobile View */}
          <div className="md:hidden flex flex-col h-screen bg-[#1c1c1c]">
            {selectedChat ? (
              // CHAT CONVERSATION VIEW - FIXED LAYOUT
              <div className="flex flex-col h-screen">
                {/* Fixed Header */}
                <header className={`${inter.className} bg-[#1F1F21] p-5 flex items-center justify-between`}>
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
                      src={selectedChat.rentalProperty?.images?.[0] || "/icons/placeholderimageformessage.svg"}
                      alt="Main"
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] mr-2 ml-3 rounded-full"
                    />

                    {/* Chat Title */}
                    <span className="text-white font-inter text-[14px] font-medium leading-[194%]">
                      {formatChatTitle(selectedChat)}
                    </span>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => {
                      if (!selectedChat || !selectedChat.rentalProperty) return;
                      const isOwner = selectedChat.rentalProperty.listedBy._id === currentUserId;
                      const otherUser = selectedChat.users.find(user => user._id !== currentUserId);
                      if (isOwner && otherUser) {
                        router.push(`/show-profile/${otherUser._id}`);
                      } else if (selectedChat.rentalProperty) {
                        router.push(`/show-listing/${selectedChat.rentalProperty._id}`);
                      }
                    }}
                    className="rounded-[57px] bg-[#353537] px-6 py-1.5">
                    <span className="text-white text-center text-[12px] font-medium leading-[194%]">
                      View
                    </span>
                  </button>
                </header>

                {/* Messages Area - ONLY THIS PART SCROLLS */}
                <div className="flex-1 overflow-y-auto bg-white">
                  <div className="p-5 flex flex-col">
                    {loading ? (
                      <div className="flex items-center justify-center p-4">
                        <p>Loading messages...</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`mb-3 ${message.sender._id === currentUserId ? "self-end text-right ml-auto" : "self-start text-left mr-auto"}`}
                          >
                            <div
                              className={`max-w-64 p-3 ${message.sender._id === currentUserId
                                ? "rounded-tl-xl rounded-bl-xl rounded-tr-xl bg-[#0A84FF]"
                                : "rounded-tr-xl rounded-br-xl rounded-tl-xl bg-[#F4F4F4]"
                                }`}
                            >
                              <p
                                className={`${message.sender._id === currentUserId
                                  ? 'text-white font-medium'
                                  : 'text-[#2C3C4E] font-normal'
                                  } font-inter text-sm leading-relaxed`}
                              >
                                {message.content}
                              </p>
                              {message.image && (
                                <Image
                                  src={message.image}
                                  alt="Attachment"
                                  width={200}
                                  height={150}
                                  className="mt-2 rounded-md"
                                />
                              )}
                            </div>
                            <span
                              className="text-xs"
                              style={{
                                fontSize: "12px",
                                color: "rgba(44, 60, 78, 0.80)",
                                fontFamily: "Inter",
                                fontWeight: 400,
                                lineHeight: "194%",
                                display: "block",
                              }}
                            >
                              {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}

                        {imagePreview && (
                          <div className="w-full max-w-xs mx-auto my-4 relative">
                            <div className="relative">
                              <Image src={imagePreview} alt="Selected image" width={300} height={200} className="rounded-lg w-full h-auto" />
                              <button onClick={handleRemoveImage} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black bg-opacity-60 text-white flex items-center justify-center">
                                ×
                              </button>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                </div>

                {/* Fixed Footer with Input */}
                <footer className="bg-[#1C1C1C] sticky bottom-0 w-full">
                  {!isProfileComplete && (
                    <div className="flex flex-row items-center py-4 px-5">
                      <div className="flex items-center bg-white rounded-full p-2 mr-3">
                        <Image src={"/icons/usercomplete.svg"} alt="create Profile" height={24} width={24} />
                      </div>
                      <div className="text-white font-normal text-sm">
                        <span onClick={() => { router.push("/complete-account") }} className="font-medium underline">Create your profile</span> to ensure landlords <br /> respond promptly to your messages.
                      </div>
                    </div>
                  )}
                  <div className="flex py-4 px-6 items-center space-x-4">
                    <button
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                      onClick={handleImageClick}
                      disabled={isUploading}
                    >
                      <Image src="/icons/plusiconsend.svg" alt="add" height={120} width={120} className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type your message"
                      className="flex-grow rounded-md px-3 py-4 bg-white text-[#7D7D7D] text-sm placeholder-[#7D7D7D] outline-none"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      disabled={isUploading}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button
                      className={`w-10 h-10 rounded-full ${isUploading ? 'bg-gray-400' : 'bg-[#007AFF]'} flex items-center justify-center`}
                      onClick={handleSendMessage}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Image
                          src="/icons/sendicon.svg"
                          alt="Send"
                          width={128}
                          height={128}
                          className="h-4 w-4"
                        />
                      )}
                    </button>
                  </div>
                </footer>
              </div>
            ) : (
              // CHAT LIST VIEW
              <div className="flex flex-col h-screen">
                {/* Fixed Header */}
                <header className="flex-none">
                  <MessagesNavbar />
                </header>

                {/* Chat List - Scrollable Area */}
                <div className="flex-1 overflow-y-auto bg-white mt-5 rounded-t-3xl">
                  {loading ? (
                    <div className="flex items-center justify-center p-4">
                      <p>Loading...</p>
                    </div>
                  ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-5 text-center">
                      <p className="text-gray-500">No messages yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Your conversations will appear here
                      </p>
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <div key={chat._id}>
                        <div
                          className={`${chat.unreadCount > 0 ? 'bg-[#F9F9F9]' : 'bg-white'} flex justify-between items-start p-5 cursor-pointer`}
                          onClick={() => handleChatClick(chat)}
                        >
                          <div className="flex items-center">
                            <Image
                              src={chat.rentalProperty?.images?.[0] || "/icons/similarlisting.png"}
                              alt="Thumbnail"
                              width={40}
                              height={40}
                              className="rounded-full w-9 h-9 mr-3"
                            />
                            <div className="flex space-y-2 flex-col">
                              <div className="flex items-center">
                                <span className={`font-semibold text-[#2C3C4E]`}
                                  style={{
                                    fontFamily: "Inter",
                                    fontSize: "14px",
                                    lineHeight: "124%",
                                  }}
                                >
                                  {formatChatTitle(chat)}
                                </span>
                                <span
                                  style={{
                                    color: "#2C3C4E",
                                    fontFamily: "Inter",
                                    lineHeight: "120%",
                                  }}
                                  className={`ml-4 ${chat.unreadCount === 0 ? "font-normal" : "font-medium"} text-sm`}
                                >
                                  {formatRelativeTime(chat.updatedAt)}
                                </span>
                              </div>
                              <span
                                style={{
                                  color: "#2C3C4E",
                                  fontFamily: "Inter",
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  lineHeight: "120%",
                                }} className="flex items-center"
                              >
                                {
                                  chat.unreadCount > 0 && (
                                    <p className="h-1.5 w-1.5 rounded-full bg-[#0A84FF] mr-2"></p>
                                  )
                                }
                                {chat.lastMessage?.content || "No messages yet"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="mt-1">
                              <svg
                                width="48"
                                height="48"
                                viewBox="0 0 20 18"
                                className="h-6 w-6"
                                onClick={(e) => handleStarToggle(chat._id, e)}
                              >
                                <path
                                  d="M9.04894 0.927052C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927051L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.335C19.3037 6.2918 19.7065 7.53141 18.9228 8.10081L14.947 10.9894C14.5966 11.244 14.4499 11.6954 14.5838 12.1074L16.1024 16.7812C16.4017 17.7025 15.3472 18.4686 14.5635 17.8992L10.5878 15.0106C10.2373 14.756 9.7627 14.756 9.41221 15.0106L5.43648 17.8992C4.65276 18.4686 3.59828 17.7025 3.89763 16.7812L5.41623 12.1074C5.55011 11.6954 5.40345 11.244 5.05296 10.9894L1.07722 8.10081C0.293507 7.53141 0.696283 6.2918 1.66501 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.53035 5.60081L9.04894 0.927052Z"
                                  fill={chat.starred ? "#FFBA1A" : "#D9D9D9"}
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    ))
                  )}
                  {/* Add padding at the bottom for mobile navigation */}
                  <div className="h-16"></div>
                </div>

                {/* Fixed Footer with Bottom Tabs */}
                <footer className="fixed bottom-0 w-full">
                  <MobileBottomTabs />
                </footer>
              </div>
            )}
            <ProfileCreationModal onConfirm={handleProfileComplete} />
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
              <div className="w-full h-full border-r rounded-tl-3xl overflow-y-auto bg-white flex justify-end">
                <div className="w-96 h-full">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <p>Loading...</p>
                    </div>
                  ) : chats.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-500">No messages yet</p>
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <div key={chat._id}>
                        <div
                          className={`${selectedChat?._id === chat._id ? 'bg-[#F9F9F9]' : ''
                            } flex justify-between items-start h-20 p-5 cursor-pointer`}
                          onClick={() => handleChatClick(chat)}
                        >
                          <div className="flex items-start">
                            <Image
                              src={chat.rentalProperty?.images?.[0] || "/icons/similarlisting.png"}
                              alt="Thumbnail"
                              width={40}
                              height={40}
                              className="rounded-full w-10 h-10 mr-3"
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span className="text-[#2C3C4E] font-inter text-[14px] font-semibold leading-[124%]">
                                  {formatChatTitle(chat)}
                                </span>
                                <span className="text-[#2C3C4E] text-[10px] font-normal ml-2">
                                  {formatRelativeTime(chat.updatedAt)}
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="text-[#2C3C4E] font-inter text-[14px] font-medium leading-[120%]">
                                  {chat.lastMessage?.content || "No messages yet"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-auto">
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 20 18"
                              className="h-6 w-6"
                              onClick={(e) => handleStarToggle(chat._id, e)}
                            >
                              <path
                                d="M9.04894 0.927052C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927051L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.335C19.3037 6.2918 19.7065 7.53141 18.9228 8.10081L14.947 10.9894C14.5966 11.244 14.4499 11.6954 14.5838 12.1074L16.1024 16.7812C16.4017 17.7025 15.3472 18.4686 14.5635 17.8992L10.5878 15.0106C10.2373 14.756 9.7627 14.756 9.41221 15.0106L5.43648 17.8992C4.65276 18.4686 3.59828 17.7025 3.89763 16.7812L5.41623 12.1074C5.55011 11.6954 5.40345 11.244 5.05296 10.9894L1.07722 8.10081C0.293507 7.53141 0.696283 6.2918 1.66501 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.53035 5.60081L9.04894 0.927052Z"
                                fill={chat.starred ? "#FFBA1A" : "#D9D9D9"}
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Middle section - Chat/Message view */}
              <div className="w-full flex flex-col border-r">
                {selectedChat ? (
                  <>
                    {/* Chat messages */}
                    <div className="flex-grow overflow-y-auto p-6">
                      {messages.map((message) => (
                        <div
                          key={message._id}
                          className={`mb-4 max-w-52 ${message.sender._id === currentUserId ? "ml-auto" : "mr-auto"
                            }`}
                        >
                          <div
                            className={`p-4 ${message.sender._id === currentUserId
                              ? "rounded-tl-xl rounded-bl-xl rounded-tr-xl bg-[#F4F4F4] text-[#2C3C4E]"
                              : "rounded-tr-xl rounded-br-xl rounded-tl-xl bg-[#353537] text-white"
                              } `}
                          >
                            <p className="font-inter text-[15px] font-normal leading-relaxed">
                              {message.content}
                            </p>
                            {message.image && (
                              <Image
                                src={message.image}
                                alt="Attachment"
                                width={200}
                                height={150}
                                className="mt-2 rounded-md"
                              />
                            )}
                          </div>
                          <span
                            className={`text-xs text-[rgba(44,60,78,0.8)] mt-1 ${message.sender._id === currentUserId ? "text-right" : "text-left"
                              }`}
                          >
                            {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat input */}
                    <div className="p-4 border-t flex items-center">
                      <button
                        className="w-10 h-10 rounded-full bg-[#F4F4F4] flex items-center justify-center mr-3"
                        onClick={handleImageClick}
                        disabled={isUploading}
                      >
                        <Image
                          src="/icons/plusiconsend.svg"
                          alt="add"
                          height={120}
                          width={120}
                          className="w-3 h-3"
                        />
                      </button>

                      {imagePreview && (
                        <div className="relative mr-2">
                          <div className="h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={handleRemoveImage}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="Type your message"
                        className="flex-grow rounded-md px-4 py-3 bg-[#F4F4F4] text-[#7D7D7D] text-sm placeholder-[#7D7D7D] outline-none"
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 400,
                        }}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        disabled={isUploading}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />

                      <button
                        className={`w-10 h-10 rounded-full ${isUploading ? 'bg-gray-400' : 'bg-[#007AFF]'} flex items-center justify-center ml-3`}
                        onClick={handleSendMessage}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Image
                            src="/icons/sendicon.svg"
                            alt="Send"
                            width={120}
                            height={120}
                            className="h-4 w-4"
                          />
                        )}
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
        </>
      )}
    </div>
  );
}