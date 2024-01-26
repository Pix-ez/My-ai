//@ts-nocheck

import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
const apiUrl = 'http://localhost:5002/process_audio';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const sendAudio = async (message) => {
    try {
      if (audioBlob) {
        setLoading(true);

        const formData = new FormData();
        formData.append('audio_data', audioBlob, 'audio.wav');

        const response =  await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer',
        });

        console.log('Audio uploaded successfully');
        // Create an Audio object directly from the binary audio data
       // Create a Blob from the response data

       const audio = new Blob([response.data], { type: 'audio/wav' });
       setAudio(audio);
       setLoading(false);

      
      }
    } catch (error) {
      console.error('Error sending audio:', error.message);
    }
    
   
    // const resp = (await data.json()).messages;
    // setMessages((messages) => [...messages, ...resp]);
    // setLoading(false);
  };

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audio, setAudio] = useState(null);

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        sendAudio,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,

        recording,
        setRecording,
        audioBlob,
        setAudioBlob,
         audio,
        setAudio

      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const Chat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};