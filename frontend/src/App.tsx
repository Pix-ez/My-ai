//@ts-nocheck
import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript , setTranscript] = useState('')
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
        });

        
        console.log('Audio uploaded successfully');
        setTranscript(response.data.segments[0].text)
       
        console.log('Server response:', response.data); // Log the server response
      }
    } catch (error) {
      console.error('Error sending audio:', error.message);
    }
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
    </div>
  );
};

export default AudioRecorder;
