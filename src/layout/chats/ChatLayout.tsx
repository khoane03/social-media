import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import ChatBox from "../../pages/chat/ChatBox";
import MenuChat from "../../pages/chat/Menu";

function ChatLayout() {
    const { userId } = useParams();

    return (
        <div className="bg-[rgb(242,244,247)] text-black min-h-screen w-screen flex flex-col">
            <Header />
            <div className="flex pt-[60px] bg-[#F2F4F7] h-screen gap-2">

                {/* Sidebar */}
                <div className={`
                        h-full overflow-hidden animate-move md:animate-slide-right
                        ${userId ? 'hidden md:flex' : 'flex '}
                        flex-[3]
                    `} >
                    <MenuChat />
                </div>

                {/* Main Chat Area */}
                <div className={`
                        h-full px-4 overflow-hidden
                        ${!userId ? 'hidden md:flex' : 'flex'}
                        flex-[6]
                    `} >
                    {userId ? (
                        <ChatBox userId={userId} />
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <h1 className="text-2xl font-bold text-gray-700">
                                Chưa có cuộc trò chuyện nào
                            </h1>
                            <p className="text-gray-500">
                                Hãy chọn một cuộc trò chuyện để bắt đầu.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatLayout;
