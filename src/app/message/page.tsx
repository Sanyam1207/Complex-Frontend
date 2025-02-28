import Image from "next/image"

const page = () => {
    return (
        <div className="flex flex-col h-screen py-5 w-full bg-[#1F1F21]">
            {/* 1. Top bar */}
            <div className="flex flex-row items-center justify-around px-4 py-5 bg-[#1c1c1c]">
                {/* Left side: back arrow + address */}
                <div className="flex flex-row items-center space-x-2">
                    <div className="p-3 rounded-full bg-[#353537]">
                        <Image
                            src="/icons/backarrow.svg"
                            alt="Back"
                            width={32}
                            height={32}
                            className="w-5 h-5"
                        />
                    </div>

                    <span className="text-white  px-6 py-3 text-sm">
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
                        <p className="text-right text-xs text-gray-500 mt-1">
                            2:50 pm
                        </p>
                    </div>
                    <div>
                        
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
    )
}

export default page