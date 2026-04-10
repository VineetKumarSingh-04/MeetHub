import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";

export default function CallModal({ call, onAccept, onReject }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 text-white text-center w-80">
        <div className="text-4xl mb-4">📞</div>
        <p className="text-lg font-semibold mb-1">{call.callerName}</p>
        <p className="text-gray-400 text-sm mb-6">Incoming {call.callType} call...</p>
        <div className="flex justify-center gap-6">
          <button onClick={onAccept} className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full">Accept</button>
          <button onClick={onReject} className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full">Reject</button>
        </div>
      </div>
    </div>
  );
}
