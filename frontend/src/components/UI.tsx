//@ts-nocheck

import { useRef ,useState} from "react";
import { Chat } from "../hooks/Chat";

export const UI = ({ hidden, ...props }) => {

  const [isrecording, setisRecording] = useState(false);

  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message, recording, sendAudio, 
   setRecording,
    audioBlob,
    setAudioBlob,
     audio,
    setAudio } = Chat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  

  const mediaRecorder = useRef(null);

     const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      const chunks = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  // const handleButtonClick = () => {
  //   console.log("button clicked")
  //   if (!isrecording) {
  //     startRecording();
  //   } else {
  //     stopRecording();
  //     // Call the function to send the audio to the server
  //     sendAudio();
  //   }
  // };

   const AudioPlayer = () => {
  if (audio) {
    const audioUrl = URL.createObjectURL(audio);

    return (
      <div>
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

    return null;
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl">Your AI Friend Ava.</h1>
          <p>I will help you with any query! 😊</p>
        </div>
        <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          {/* <button onTouchStart={startRecording} onMouseDown={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button onTouchEnd={stopRecording} onMouseUp={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
        <button onClick={sendAudio} disabled={!audioBlob}>
          Send Audio
        </button>
         
      <AudioPlayer /> */}
      
   
        </div>
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">

       <button onTouchStart={startRecording} onMouseDown={startRecording} disabled={recording}
        className={`bg-pink-500 hover:bg-pink-600 text-white p-2   font-semibold uppercase rounded-md ${
          loading || message ? "cursor-not-allowed opacity-30" : ""
        }`}>
        Start
        </button>
        <button onTouchEnd={stopRecording} onMouseUp={stopRecording} disabled={!recording}
         className={`bg-pink-500 hover:bg-pink-600 text-white p-2 px-10 font-semibold uppercase rounded-md ${
          loading || message ? "cursor-not-allowed opacity-30" : ""
        }`}>
          Stop
        </button>
        <button onClick={sendAudio} disabled={!audioBlob}
         className={`bg-pink-500 hover:bg-pink-600 text-white p-2 px-10 font-semibold uppercase rounded-md ${
          loading || message ? "cursor-not-allowed opacity-30" : ""
        }`}>
          Send
        </button>
    
        <AudioPlayer />
        
          {/* <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            placeholder="Type a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          /> */}
          {/* <button
            disabled={loading || message}
            onClick={sendMessage}
            className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
              loading || message ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            Send
          </button> */}
        </div>
      </div>
    </>
  );
};