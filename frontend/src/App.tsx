//@ts-nocheck
import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript , setTranscript] = useState('')
  const [audio, setAudio] = useState(null);
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

  const sendAudio = async () => {
    try {
      if (audioBlob) {
        const formData = new FormData();
        formData.append('audio_data', audioBlob, 'audio.wav');

        // Replace 'http://localhost:8765' with the actual base URL of your Flask server
        const apiUrl = 'http://192.168.0.102:5002/process_audio';

        const response=  await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer',
        });

        
        console.log('Audio uploaded successfully');
        // setTranscript(response.data.segments[0].text)

        // Create an Audio object directly from the binary audio data
       // Create a Blob from the response data

       const audio = new Blob([response.data], { type: 'audio/wav' });
       setAudio(audio);

         // Check if the response data is a valid audio blob
      // if (response.data instanceof Blob) {
      //   // Create an Audio object directly from the binary audio data
      //   const audio = new Blob([response.data], { type: 'audio/wav' });
      //   setAudio(audio);
      // } else {
      //   console.error('Invalid server response:', response);
      // }

      // Ensure that playback starts only on user interaction
      // document.addEventListener('click', () => {
      //   audio.play();
      // }, { once: true });
      //   console.log('Server response:', response)
       
        // console.log('Server response:', response.data); // Log the server response
      }
    } catch (error) {
      console.error('Error sending audio:', error.message);
    }
  };

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
    <div>
       <button onTouchStart={startRecording} onMouseDown={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onTouchEnd={stopRecording} onMouseUp={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <button onClick={sendAudio} disabled={!audioBlob}>
        Send Audio
      </button>
      <p>{transcript}</p>
      <AudioPlayer />
    </div>
  );
};

export default AudioRecorder;
