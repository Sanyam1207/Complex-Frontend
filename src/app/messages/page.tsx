'use client'
import React from 'react'
import MobileBottomTabs from '@/components/MobileBottomTabs'
import Navbar from '@/components/NavBar'
import Image from 'next/image'
import DeleteListingModal from '@/components/DeleteListingModal'

const Page = () => {
  const [showMessage, setShowMessage] = React.useState(false)

  // State to control DeleteListingModal
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    console.log('Listing deleted!')
    setShowDeleteModal(false)
  }

  return (
    <>


      {/* --------------------------------- DESKTOP VIEW --------------------------------- */}
      <div className='sticky top-0'>
        <Navbar />
      </div>
      <div className=''>

        <div className="bg-[#1c1c1c] hidden md:flex h-screen text-[#2C3C4E]  flex-col pt-10">
          {/* Top Bar */}
          <div className="flex flex-row justify-between px-14 items-center">
            {/* Left Section: Search Bar & Sort Button */}
            <div className="flex flex-row space-x-3">
              {/* Search Bar */}
              <div className="flex items-center justify-center bg-[#2F2F2F] rounded-full px-4 py-2 w-[20.18rem]">
                <div className="bg-[#1c1c1c] p-2 rounded-full">
                  <Image
                    src="/icons/firrsearch.png"
                    height={15.43}
                    width={15.43}
                    alt="search-icon"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search location"
                  className="ml-2 w-full border-none outline-none bg-transparent text-[14px] text-white placeholder-white"
                />
              </div>

              {/* Sort Button */}
              <div>
                <button className="bg-[#2F2F2F] text-white px-6 py-2 rounded-full">
                  Sort
                </button>
              </div>
            </div>

            {/* Middle Section: Address & Rounded Image */}
            <div className="flex flex-row items-center space-x-3">
              <Image
                src="/icons/similarlisting.png"
                height={32}
                width={32}
                alt="user-avatar"
                className="rounded-full"
              />
              <span className="text-white text-sm">2958 Main Street</span>
            </div>

            {/* View Button */}
            <div>
              <button className="bg-[#2F2F2F] text-white px-6 py-2 rounded-full">
                View
              </button>
            </div>

            {/* Renter / Landlord Buttons */}
            <div className="flex flex-row items-center space-x-2">
              <button className="bg-[#2F2F2F] text-white px-6 py-2 rounded-full">
                Renter
              </button>
              <button className="bg-[#2F2F2F] text-white px-6 py-2 rounded-full">
                Landlord
              </button>
            </div>
          </div>

          {/* Main Section: 3 Columns => [All Chats] | [Opened Chat] | [Profile] */}
          <div className="flex h-screen mt-10 px-10 bg-white rounded-t-3xl flex-row justify-between">
            {/* 1) All Chats Section */}
            <div className="w-full flex justify-center flex-row">
              <div className="h-full overflow-y-auto p-5">
                {/* Example Chat */}
                <div className="flex items-start justify-between bg-white rounded-md p-3 cursor-pointer">
                  <div className="flex justify-center items-center">
                    <Image
                      src="/icons/similarlisting.png"
                      alt="Thumbnail"
                      width={32}
                      height={32}
                      className="rounded-full mr-3 h-10 w-10"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">265 Main St</span>
                      <span className="text-sm text-[#2C3C4E]">
                        This is the count of total char . . . 45
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">Just now</span>
                    <div className="mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.563 4.83c.07.214.257.361.48.395l5.036.732c.96.139 1.341 1.316.647 1.99l-3.64 3.547c-.166.162-.241.397-.203.626l.859 5.013c.163.953-.84 1.68-1.68 1.23L10 18.347l-4.501 2.367c-.84.45-1.843-.277-1.68-1.23l.859-5.013c.038-.229-.037-.464-.203-.626l-3.64-3.547c-.695-.674-.312-1.85.647-1.99l5.036-.732c.224-.034.41-.181.48-.395l1.563-4.83z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Repeat for other chats as needed... */}
              </div>
            </div>

            {/* 2) Opened Current Chat */}
            <div className="w-full flex flex-col justify-between border-x border-gray-200">
              {/* Chat Messages */}
              <div className="p-4 overflow-y-auto flex flex-col space-y-6">
                {/* Left Bubble (black) */}
                <div className="max-w-[60%]">
                  <div className="bg-[#353537] text-white rounded-lg px-4 py-2">
                    Hello, Is this available.
                  </div>
                  <span className="text-xs text-gray-500">2:50 pm</span>
                </div>

                {/* Right Bubble (light background) */}
                <div className="max-w-[60%] ml-auto text-right">
                  <div className="bg-gray-100 text-black rounded-lg px-4 py-2 inline-block">
                    Hello, Is this available.
                  </div>
                  <span className="text-xs text-gray-500 block mt-1">2:50 pm</span>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-[#F4F4F4] py-10 border-gray-200">
                <div className="flex items-center space-x-2">
                  {/* Plus Icon */}
                  <button className="bg-white py-2 px-3 rounded-full">+</button>

                  {/* Text Input */}
                  <input
                    type="text"
                    placeholder="Type your message"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
                  />

                  {/* Send Button */}
                  <button className="bg-blue-500 text-white rounded-full p-3">
                    <Image src="/icons/send.svg" width={20} height={20} alt="Send" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3) Profile Section */}
            <div className="w-full flex justify-center flex-col p-6">
              {/* Section Title */}
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-lg font-medium mb-4">Candidate Profile</h2>

                {/* Avatar + Name */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-pink-400 to-pink-200 flex items-center justify-center mb-2">
                    <Image
                      src="/icons/profile.svg"
                      alt="John Doe"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <p className="font-medium text-base">John Doe</p>
                </div>
              </div>

              <div className="w-5/6">
                {/* Gender */}
                <div className="mb-8">
                  <p className="text-sm font-medium">
                    <span>Gender:</span> Male
                  </p>
                </div>

                {/* Languages */}
                <div className="mb-8">
                  <p className="text-sm font-medium mb-3">Languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {["French", "Hindi", "Gujarati", "Punjabi", "Mandarin", "Telugu"].map(
                      (lang) => (
                        <span
                          key={lang}
                          className="px-4 py-2 rounded-full text-sm border border-gray-500"
                        >
                          {lang}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* About */}
                <div>
                  <p className="text-sm font-medium mb-2">About John Doe:</p>
                  <p className="text-sm">
                    Once you login, you will find the messages here. I am looking
                    for 2 Bedroom apartment for rent can you please help me to find
                    this character limit. let it flow down
                  </p>
                  <p className="text-sm mt-3">
                    Incase if its second paragraph how thats going to look.
                  </p>
                </div>
              </div>

              {/* Example: Trigger Delete Listing Modal */}
              <div className="mt-8">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-500 text-white px-6 py-2 rounded-full"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* --------------------------------- MOBILE VIEW --------------------------------- */}
      <div className="flex relative md:hidden flex-col h-screen  text-[#2C3C4E]">

        <div className={`w-full ${showMessage ? 'hidden' : 'block'} h-screen flex flex-col bg-[#1c1c1c]`}>
          {/* Fixed header with Renter and Landlord buttons */}
          <header className="flex-none sticky top-0 z-10">
            <div className="bg-[#1c1c1c] flex flex-row px-5 py-5">
              <button className="bg-[#2F2F2F] mr-5 text-white px-6 py-3 rounded-full">
                Renter
              </button>
              <button className="bg-[#2F2F2F] text-white px-6 py-3 rounded-full">
                Landlord
              </button>
            </div>
          </header>

          {/* Scrollable messages area contained in a white, rounded container */}
          <main className="flex-grow overflow-y-auto bg-white rounded-t-3xl">
            <div className="flex flex-col w-full">
              {/* Example: First message */}
              <div
                className="flex py-8 items-start justify-between bg-white rounded-3xl p-3 cursor-pointer"
                onClick={() => setShowMessage(true)}
              >
                <div className="flex justify-center items-center">
                  <Image
                    src="/icons/similarlisting.png"
                    alt="Thumbnail"
                    width={32}
                    height={32}
                    className="rounded-full mr-3 h-10 w-10"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">265 Main St</span>
                    <span className="text-sm text-[#2C3C4E]">
                      This is the count of total char . . . 45
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">Just now</span>
                  <div className="mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.563 4.83c.07.214.257.361.48.395l5.036.732c.96.139 1.341 1.316.647 1.99l-3.64 3.547c-.166.162-.241.397-.203.626l.859 5.013c.163.953-.84 1.68-1.68 1.23L10 18.347l-4.501 2.367c-.84.45-1.843-.277-1.68-1.23l.859-5.013c.038-.229-.037-.464-.203-.626l-3.64-3.547c-.695-.674-.312-1.85.647-1.99l5.036-.732c.224-.034.41-.181.48-.395l1.563-4.83z" />
                    </svg>
                  </div>
                </div>
              </div>
              <hr />

              {/* Example: Second message */}
              <div
                className="flex items-start justify-between bg-white rounded-md p-3 cursor-pointer"
                onClick={() => setShowMessage(true)}
              >
                <div className="flex justify-center items-center">
                  <Image
                    src="/icons/similarlisting.png"
                    alt="Thumbnail"
                    width={32}
                    height={32}
                    className="rounded-full mr-3 h-10 w-10"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">265 Main St</span>
                    <span className="text-sm text-[#2C3C4E]">
                      This is the count of total char . . . 45
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">Just now</span>
                  <div className="mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.563 4.83c.07.214.257.361.48.395l5.036.732c.96.139 1.341 1.316.647 1.99l-3.64 3.547c-.166.162-.241.397-.203.626l.859 5.013c.163.953-.84 1.68-1.68 1.23L10 18.347l-4.501 2.367c-.84.45-1.843-.277-1.68-1.23l.859-5.013c.038-.229-.037-.464-.203-.626l-3.64-3.547c-.695-.674-.312-1.85.647-1.99l5.036-.732c.224-.034.41-.181.48-.395l1.563-4.83z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Add more messages as needed */}
            </div>
          </main>

          {/* Fixed mobile bottom navigation */}
          <footer className="flex-none sticky bottom-0 z-10">
            <MobileBottomTabs />
          </footer>
        </div>

        {/* 2) Current Chat Detail (show if showMessage) */}
        <div
          className={`flex-col absolute h-screen -top-32 z-20 w-full bg-[#1F1F21] ${showMessage ? 'flex' : 'hidden'
            }`}
        >
          {/* 1. Top bar */}
          <div className="flex flex-row items-center justify-around px-4 py-5 bg-[#1c1c1c]">
            {/* Left side: back arrow + address */}
            <div className="flex flex-row items-center space-x-2">
              {/* Back arrow => go back to message list */}
              <div
                className="p-3 rounded-full bg-[#353537] cursor-pointer"
                onClick={() => setShowMessage(false)}
              >
                <Image
                  src="/icons/backarrow.svg"
                  alt="Back"
                  width={32}
                  height={32}
                  className="w-5 h-5"
                />
              </div>

              <span className="text-white px-6 py-3 text-sm">
                265 Mainstreet, Townsville
              </span>
            </div>
            {/* Right side: "View" button */}
            <div className="text-white text-sm bg-[#353537] px-5 py-3 rounded-full">
              View
            </div>
          </div>

          {/* 2. Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {/* Example of a sent message (aligned to the right) */}
            <div className="flex justify-end mb-2">
              <div className="bg-[#F1F1F1] p-3 rounded-lg max-w-[70%]">
                <p className="text-sm text-[#2C3C4E]">
                  Hello, Is this available.
                </p>
                <p className="text-right text-xs text-gray-500 mt-1">2:50 pm</p>
              </div>
            </div>
            {/* Add more sent/received messages here as needed */}
          </div>

          {/* 3. Input section */}
          <div className="flex flex-row items-center px-4 py-5 justify-center bg-[#1c1c1c]">
            {/* Plus icon */}
            <div className="mr-5 bg-white p-3 rounded-full">
              <Image
                height={32}
                width={32}
                src="/icons/plusiconblack.svg"
                alt="Add attachment"
                className="w-5 h-5 text-black"
              />
            </div>
            {/* Text input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type your message"
                className="w-full px-3 py-4 rounded-lg outline-none"
              />
            </div>
            {/* Send icon */}
            <div className="ml-5 p-3 rounded-full bg-blue-600">
              <Image
                width={32}
                height={32}
                src="/icons/send.svg"
                alt="Send message"
                className="w-5 h-5"
              />
            </div>
          </div>
        </div>
      </div>



      {/* ==================== Delete Listing Modal Integration ==================== */}
      <DeleteListingModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default Page
