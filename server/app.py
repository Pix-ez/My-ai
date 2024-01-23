# import ffmpeg

from faster_whisper import WhisperModel
# import numpy as np
# import scipy


from flask import Flask, request, jsonify
from flask_cors import CORS

import pyttsx3
import sounddevice as sd
import soundfile as sf
from rvc_infer import rvc_convert
from tortoise_api import Tortoise_API



app = Flask(__name__)

CORS(app, origins="*")  # Enable CORS for the entire app

# ! docker build . -t flask-server -f Dockerfile.gpu
# ! docker run -it --gpus all -p 5002:5002 flask-server:latest

# ! docker run -it --volume D:\server-mount:/result --gpus all -p 5002:5002 flask-server:latest
# Initialize Whisper model
model_size = "base.en"
model = WhisperModel(model_size, device="cuda", compute_type="float16")


def text_to_wav(text, filename, voice_index=0, ):
    engine = pyttsx3.init(driverName='sapi5')
    
    voices = engine.getProperty('voices')
    if voice_index >= len(voices):
        print(f"Invalid voice index. Choose between 0 and {len(voices) - 1}. Using default voice.")
    else:
        engine.setProperty('voice', voices[voice_index].id)
    
    engine.setProperty('rate', 150)
    engine.save_to_file(text, filename)
    engine.runAndWait()

def play_audio(filename):
    data, samplerate = sf.read(filename)
    sd.play(data, samplerate)
    sd.wait()

def tts():
    engine = pyttsx3.init(driverName='sapi5')
    voices = engine.getProperty('voices')
    print("Available voices:")
    for index, voice in enumerate(voices):
        print(f"{index}: {voice.name}")

    voice_index = 1
    text = "Hello there, my name is marine and I am excited to meet you!"
    audio_file_name = "out.wav"
    
    text_to_wav(text, 
                
                audio_file_name, 
                voice_index)
    
    return audio_file_name



@app.route('/')
def hello():
    response_data = {"message": "Hello from the server!"}
    return jsonify(response_data)



@app.route('/process_audio', methods=['POST'])
def process_audio():
    try:
        f = request.files['audio_data']
        f.save('audio.mp3')
        f.flush()
        f.close()
       
        

       
        
        # Process the audio using the Whisper model
        segments, info = model.transcribe('audio.mp3', beam_size=5)

        # Prepare the response
        response = {
            "language": info.language,
            "language_probability": info.language_probability,
            "segments": [
                {"start": segment.start, "end": segment.end, "text": segment.text}
                for segment in segments
            ],
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route('/uploader', methods = ['GET', 'POST'])
# def upload_file():
#     if request.method == 'POST':
#         f = request.files['audio_data']
#         f.save('audio.mp3')
#         f.flush()
#         f.close()
#     return 'file uploaded successfully'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
