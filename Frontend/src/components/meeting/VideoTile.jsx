import { useEffect, useRef } from "react";

export default function VideoTile({ stream, label, muted = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
      <video ref={videoRef} autoPlay playsInline muted={muted} className="w-full h-full object-cover" />
      <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{label}</span>
    </div>
  );
}
