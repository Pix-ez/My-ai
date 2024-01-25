//@ts-nocheck
// import React, { useState, useRef } from 'react';
// import { Canvas, useFrame } from "@react-three/fiber";
// import axios from 'axios';

// const AudioRecorder = () => {
//   const [recording, setRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [transcript , setTranscript] = useState('')
//   const [audio, setAudio] = useState(null);
//   const mediaRecorder = useRef(null);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorder.current = new MediaRecorder(stream);

//       const chunks = [];

//       mediaRecorder.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);
//         }
//       };

//       mediaRecorder.current.onstop = () => {
//         const audioBlob = new Blob(chunks, { type: 'audio/wav' });
//         setAudioBlob(audioBlob);
//       };

//       mediaRecorder.current.start();
//       setRecording(true);
//     } catch (error) {
//       console.error('Error starting recording:', error.message);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
//       mediaRecorder.current.stop();
//       setRecording(false);
//     }
//   };

  // const sendAudio = async () => {
  //   try {
  //     if (audioBlob) {
  //       const formData = new FormData();
  //       formData.append('audio_data', audioBlob, 'audio.wav');

  //       // Replace 'http://localhost:8765' with the actual base URL of your Flask server
  //       const apiUrl = 'http://192.168.0.102:5002/process_audio';

  //       const response=  await axios.post(apiUrl, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         responseType: 'arraybuffer',
  //       });

        
  //       console.log('Audio uploaded successfully');
      

  //       // Create an Audio object directly from the binary audio data
  //      // Create a Blob from the response data

  //      const audio = new Blob([response.data], { type: 'audio/wav' });
  //      setAudio(audio);

      
  //     }
  //   } catch (error) {
  //     console.error('Error sending audio:', error.message);
  //   }
  // };

//  const AudioPlayer = () => {
//   if (audio) {
//     const audioUrl = URL.createObjectURL(audio);

//     return (
//       <div>
//         <audio controls>
//           <source src={audioUrl} type="audio/wav" />
//           Your browser does not support the audio element.
//         </audio>
//       </div>
//     );
//   }

//     return null;
//   };

//   const Scene = () => {
//     const directionalLightRef = useRef();
  
//     const { lightColour, lightIntensity } = useControls({
//       lightColour: "white",
//       lightIntensity: {
//         value: 0.5,
//         min: 0,
//         max: 5,
//         step: 0.1,
//       },
//     });
  
//     useHelper(directionalLightRef, DirectionalLightHelper, 0.5, "white");
  
//     return (
//       <>
//         <directionalLight
//           position={[0, 1, 2]}
//           intensity={lightIntensity}
//           ref={directionalLightRef}
//           color={lightColour}
//         />
//         {/* <pointLight ref={pointLightRef} position={[0, 1, 1]} /> */}
//         <ambientLight intensity={0.5} />
//       <Cube position={[1, 0, 0]} color={"green"} args={1} />
//         {/* <group position={[0, -1, 0]}>
//           // <Cube position={[1, 0, 0]} color={"green"} args={1} />
//           <Cube position={[-1, 0, 0]} color={"hotpink"} args={1} />
//           <Cube position={[-1, 2, 0]} color={"blue"} args={1} />
//           <Cube position={[1, 2, 0]} color={"yellow"} args={1} />
//         </group> */}
      
//         <OrbitControls enableZoom={false} />
//       </>
//     );
//   };

//   return (
//     <Canvas>
//     <Scene />
//   </Canvas>
//     // <div >
//     // <Canvas>
//     // <Scene/>
//     // </Canvas>
//     //    <button onTouchStart={startRecording} onMouseDown={startRecording} disabled={recording}>
//     //     Start Recording
//     //   </button>
//     //   <button onTouchEnd={stopRecording} onMouseUp={stopRecording} disabled={!recording}>
//     //     Stop Recording
//     //   </button>
//     //   <button onClick={sendAudio} disabled={!audioBlob}>
//     //     Send Audio
//     //   </button>
//     //   <p>{transcript}</p>
//     //   <AudioPlayer />
//     // </div>
 
//   );
// };

// export default AudioRecorder;


import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";
import { useRef, useState } from "react";
import {
  MeshWobbleMaterial,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { DirectionalLightHelper } from "three";
import { useControls } from "leva";

import { Loader } from "@react-three/drei";

import { Leva } from "leva";
import { Character } from "./components/Character";
import { UI } from "./components/UI";
// const Cube = ({ position, side, color }) => {
//   const ref = useRef();

//   return (
//     <mesh position={position} ref={ref}>
//       <boxGeometry args={[side, side, side]} />
//       <meshStandardMaterial color={color} />
//     </mesh>
//   );
// };







// const Scene = () => {
//   const directionalLightRef = useRef();

//   const { lightColour, lightIntensity } = useControls({
//     lightColour: "white",
//     lightIntensity: {
//       value: 0.5,
//       min: 0,
//       max: 5,
//       step: 0.1,
//     },
//   });

//   useHelper(directionalLightRef, DirectionalLightHelper, 0.5, "white");

//   return (
//     <>
//       <directionalLight
//         position={[0, 1, 2]}
//         intensity={lightIntensity}
//         ref={directionalLightRef}
//         color={lightColour}
//       />
//       {/* <pointLight ref={pointLightRef} position={[0, 1, 1]} /> */}
//       <ambientLight intensity={0.6} />
//       <Model/>
//       {/* <group position={[0, -1, 0]}>
//         <Cube position={[1, 0, 0]} color={"green"} args={1} />
//         <Cube position={[-1, 0, 0]} color={"hotpink"} args={1} />
//         <Cube position={[-1, 2, 0]} color={"blue"} args={1} />
//         <Cube position={[1, 2, 0]} color={"yellow"} args={1} />
//       </group> */}
      
//       <OrbitControls enableZoom={true} />
//     </>
//   );
// };

const App = () => {
  return (
 

    <><Loader />
    <Leva />
    <UI  />
    <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
      <Character />
    </Canvas></>
  );
};

export default App;