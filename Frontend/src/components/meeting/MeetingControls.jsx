export default function MeetingControls({ muted, videoOff, onToggleMute, onToggleVideo, onShareScreen, onLeave }) {
  return (
    <div className="flex items-center justify-center gap-4 py-4 bg-gray-900">
      <button onClick={onToggleMute} className={`p-3 rounded-full text-white ${muted ? "bg-red-600" : "bg-gray-600 hover:bg-gray-500"}`}>
        {muted ? "🔇" : "🎤"}
      </button>
      <button onClick={onToggleVideo} className={`p-3 rounded-full text-white ${videoOff ? "bg-red-600" : "bg-gray-600 hover:bg-gray-500"}`}>
        {videoOff ? "📷" : "📹"}
      </button>
      <button onClick={onShareScreen} className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 text-white">🖥️</button>
      <button onClick={onLeave} className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold">Leave</button>
    </div>
  );
}
