import { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app, storage } from "@/firebase/config";
import Image from "next/image";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { data } from "../app/dashboard/data";

const VideoClip = ({ key, video, scalar }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: video.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    width: 100,
    height: 50,
    minWidth: video.length * 50 * (scalar / 50),
    backgroundColor: "#ff6f3c",
    boxShadow: "1px 1px 1px #F6C7B3",
    marginRight: 10,
    borderRadius: 5,
    display: "flex",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ height: 3 }}></div>
      {video.flex == true && (
        <div style={{ margin: 8 }}>
          <text>C</text>
        </div>
      )}
      <text style={{ margin: 8 }}>{video.id}</text>
    </div>
  );
};

const VideoUploadInput = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState([]);
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState([]);
  const [selectedMediaType, setSelectedMediaType] = useState("video");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (selectedMediaType === "audio" && file.type.startsWith("audio/")) {
        setAudioFile(file);
        uploadToFirebase(file, "audio");
      } else if (selectedMediaType === "video") {
        const videoURL = URL.createObjectURL(file);
        setVideoSrc(videoURL);
        setVideoFile(file);
        uploadToFirebase(file, "video");
      }
    }
  };

  const uploadToFirebase = (file, mediaType) => {
    if (!file) {
      return;
    }

    let storageRef = ref(storage, `${mediaType}s/${file.name}`);
    let uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (mediaType === "video") {
            setUploadedVideoFiles((prevFiles) => [
              ...prevFiles,
              {
                name: file.name,
                url: downloadURL,
                thumbnail: videoSrc,
              },
            ]);
          } else if (mediaType === "audio") {
            setUploadedAudioFiles((prevFiles) => [
              ...prevFiles,
              {
                name: file.name,
                url: downloadURL,
              },
            ]);
          }
        });
      }
    );
  };

  const handleMediaTypeChange = (mediaType) => {
    setSelectedMediaType(mediaType);
  };

  {
    /* Timeline Styles */
  }
  const timeline = {};
  const controlBar = {
    display: "flex",
    justifyContent: "space-between",
    height: 50,
    marginLeft: 20,
    marginRight: 20,
  };
  const buttons = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: 275,
  };
  const button = {
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 5,
    color: "blue",
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10,
    cursor: "pointer",
  };

  const vidaudcontainer = {
    overflowX: "scroll",
    height: 100,
    margin: 10,
    height: 150,
  };

  const [videoClips, setVideoClips] = useState(data);
  const [inputValue, setInputValue] = useState("");
  // // Add new Clips
  // const addUser = () => {
  //   let newUser = { id: Date.now().toString(), name: inputValue };
  //   setInputValue("");
  //   setUsers((users) => [...users, newUser]);
  // };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setVideoClips((videoClips) => {
      const oldIndex = videoClips.findIndex(
        (videoClip) => videoClip.id === active.id
      );
      const newIndex = videoClips.findIndex(
        (videoClip) => videoClip.id === over.id
      );
      console.log(newIndex); // Send users[newIndex] to the server to trim in the trim function.
      return arrayMove(videoClips, oldIndex, newIndex);
    });
  };

  const loadVideoClips = (videoClips, sliderValue) => {
    videoClips.map((videoClip) => (
      <VideoClip key={videoClip.id} video={videoClip} scalar={sliderValue} />
    ));
  };

  const [sliderValue, setSliderValue] = useState(50);

  // for each video clip, change the parameter of css length, but parameter showing up as undefined rn why ?

  useEffect(() => {
    let changeableClips = [];
    videoClips.forEach((videoClip) => {
      if (videoClip.flex == true) {
        changeableClips.push(videoClip);
      }
    });
    console.log(changeableClips);
  }, [videoClips]);

  return (
    <div>
      <div className="py-16 rounded-lg text-center flex">
        <MediaLibrary />
        <div className="border-[0.9px] border-gray-300"></div>
        <VideoDisplay />
      </div>
      <TimeLine />
    </div>
  );

  function TimeLine() {
    return (
      <div style={timeline}>
        <div style={controlBar}>
          {/* Buttons */}
          <div style={buttons}>
            <div
              onClick={() => {
                console.log("pushed");
              }}
              style={button}
            >
              <text>Algorithm</text>
            </div>
            <div style={button}>
              <text>Button 2</text>
            </div>
            <div style={button}>
              <text>Button 3</text>
            </div>
          </div>
          {/* Buttons */}
          {/* Spacer */}
          <div></div>
          {/* Timestamp Tracker */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <text>00:03.84 / 00:13.60</text>
          </div>
          {/* Timestamp Tracker */}
          {/* Spacer */}
          <div style={{ width: 145 }}></div>
          {/* Min/Max Timeline Control */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="range"
              value={sliderValue}
              onChange={(e) => setSliderValue(e.target.value)}
              min="1"
              max="100"
            />
          </div>
          {/* Min/Max Timeline Control */}
        </div>
        {/* Video and Audio Main Timeline */}
        <div style={vidaudcontainer}>
          {/* Transfer Over the code from monsters lessons here */}
          <div>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext items={videoClips}>
                <div style={{ display: "flex" }}>
                  {/* Why PROPS Passed as undefined ?? */}
                  {videoClips.map((videoClip) => (
                    <VideoClip
                      key={videoClip.id}
                      video={videoClip}
                      scalar={sliderValue}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
          {/* Transfer Over the code from monsters lesson above
          <div style={{ display: "flex" }}>
            <VideoClip size={5} id="1" />
            <VideoClip size={3} id="2" />
            <VideoClip size={2} id="3" />
            <VideoClip size={4} id="4" />
          </div>
                  */}
          <div style={{ display: "flex", paddingTop: 20 }}>
            <AudioClip size={15} id="1" scalar={sliderValue} />
          </div>
        </div>
      </div>
    );
  }

  function AudioClip(params) {
    return (
      <div
        style={{
          height: 50,
          minWidth: params.size * 50 * (sliderValue / 50),
          backgroundColor: "#ff9a3c",
          boxShadow: "1px 1px 1px #F6C7B3",
          marginRight: 10,
          borderRadius: 5,
        }}
      >
        <div
          style={{
            margin: 5,
          }}
        >
          <text>{params.id}</text>
        </div>
      </div>
    );
  }

  function MediaLibrary() {
    return (
      <div className="w-1/2">
        <div className="flex justify-start ml-16 mb-4 space-x-4">
          <button
            className="bg-blue-600 text-white p-3"
            onClick={() => handleMediaTypeChange("video")}
          >
            Videos
          </button>
          <button
            className="bg-blue-600 text-white p-3"
            onClick={() => handleMediaTypeChange("audio")}
          >
            Audio
          </button>
        </div>

        <div className="h-96 mx-16 border-2 border-dashed border-gray-400">
          {selectedMediaType == "video"
            ? uploadedVideoFiles.map((file) => (
                <div
                  key={file.name}
                  className="m-3 p-3 border-gray-300 border-[1px]  h-20 flex items-center space-x-4"
                >
                  <video
                    className="rounded-md h-16 w-auto"
                    src={file.url}
                    type="video/mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-gray-700 text-xs">{file.name}</p>
                </div>
              ))
            : uploadedAudioFiles.map((file) => <AudioCard name={file.name} />)}
        </div>

        <button className="my-6 w-full flex justify-end pr-20">
          <input
            type="file"
            accept={selectedMediaType === "video" ? "video/*" : "audio/*"}
            className="hidden"
            id="media-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="media-upload"
            className="text-white p-4 bg-blue-600 underline underline-offset-4 cursor-pointer"
          >
            Add files
          </label>
        </button>
      </div>
    );
  }

  function VideoDisplay() {
    return (
      <div className="w-1/2">
        {videoSrc ? (
          <video
            className="rounded-md h-96 mx-16"
            controls
            src={videoSrc}
            type="video/mp4"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="rounded-md bg-black h-96 w-auto mx-16"></div>
        )}
      </div>
    );
  }

  function AudioDisplay() {
    return (
      <div className="w-1/2">
        <audio
          className="rounded-md h-96 mx-16"
          controls
          src={videoSrc}
          type="video/mp4"
        >
          Your browser does not support the video tag.
        </audio>
      </div>
    );
  }

  function AudioCard({ name }) {
    return (
      <div
        key={name}
        className="m-3 p-3 border-gray-300 border-[1px] h-20 flex items-center space-x-4"
      >
        <Image
          className="rounded-md h-16 w-auto"
          src={"/audio-image.png"}
          width={50}
          height={50}
        ></Image>
        <p className="text-gray-700 text-xs">{name}</p>
      </div>
    );
  }
};

export default VideoUploadInput;
