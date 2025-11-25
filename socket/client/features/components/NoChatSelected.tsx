function NoChatSelected() {
  return (
    <div className="flex items-center justify-center w-full h-screen text-center bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        {/* Icon yoki dekorativ element */}
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-800 text-blue-400 text-3xl">
          💬
        </div>
        {/* Matn */}
        <h2 className="text-xl font-semibold text-gray-200">
          No Chat Selected
        </h2>
        <p className="text-sm text-gray-400">
          Please select a chat to start messaging
        </p>
      </div>
    </div>
  );
}

export default NoChatSelected;
