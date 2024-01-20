export default function AudioDisplay({ audioSrc }) {
  return (
    <div className="w-1/2">
      <audio className="rounded-md h-4/5 w-5/6 mx-12" controls>
        <source src={audioSrc} type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
}
