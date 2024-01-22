export default function VideoDisplay({ videoSrc }) {

  const playVideoIcon = (
    <button onClick={() => {

    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5"
      >
        <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
      </svg>
    </button>
  );

  return (
    <div className="w-1/2 mt-16">
      {videoSrc ? (
        <video
          className="rounded-md h-96 mx-12"
          controls
          src={videoSrc}
          type="video/mp4"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="rounded-md bg-black h-96 w-auto mx-12"></div>
      )}
    </div>
  );
}
