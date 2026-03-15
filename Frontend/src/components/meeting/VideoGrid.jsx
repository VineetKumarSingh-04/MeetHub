import VideoTile from "./VideoTile";

export default function VideoGrid({ localStream, remoteStreams, localUser }) {
  const remoteEntries = Object.entries(remoteStreams);

  return (
    <div className={`grid gap-2 w-full h-full p-2 ${remoteEntries.length === 0 ? "grid-cols-1" : remoteEntries.length < 4 ? "grid-cols-2" : "grid-cols-3"}`}>
      <VideoTile stream={localStream} label={`${localUser?.name} (You)`} muted />
      {remoteEntries.map(([socketId, stream]) => (
        <VideoTile key={socketId} stream={stream} label={socketId} />
      ))}
    </div>
  );
}
