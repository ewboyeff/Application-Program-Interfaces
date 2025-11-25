import ChatHeader from "./subComponents/ChatHeader";
import Conversation from "./subComponents/Conversation";
import SendMessage from "./subComponents/SendMessage";

function ChatContainer() {
  return (
    <div className="w-full flex flex-col">
      <ChatHeader />
      <Conversation />
      <SendMessage />
    </div>
  );
}

export default ChatContainer;
