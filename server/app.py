from faster_whisper import WhisperModel
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import pyttsx3
import sounddevice as sd
import soundfile as sf
from rvc_infer import rvc_convert
from tortoise_api import Tortoise_API

import google.generativeai as genai
import re
import uuid 
import os

app = Flask(__name__)

CORS(app, origins="*")  # Enable CORS for the entire app

# ! docker build . -t flask-server -f Dockerfile.gpu
# ! docker run -it --gpus all -p 5002:5002 flask-server:latest

# ! docker run -it --volume D:\server-mount:/result --gpus all -p 5002:5002 flask-server:latest
# Initialize Whisper model
model_size = "base.en"
model = WhisperModel(model_size, device="cuda", compute_type="float16")


safety_settings={'HARASSMENT':'block_none'}


genai.configure(api_key="API_KEY")

g_model = genai.GenerativeModel('gemini-pro')

#intialize tortoise tss
tortoise = Tortoise_API()

path_to_file = "output/out.wav"

messages = [{'role':'user',
     'parts': ["You are Ava who is very excellent in programming and tech,and help other with their queries.Give very short responses under 200 words."]} ]

response = g_model.generate_content(messages,
                                generation_config=genai.types.GenerationConfig(
                                
                                temperature=0.6),
                                safety_settings=safety_settings)

messages.append({'role':'model',
                    'parts':[response.text]})




def transcribe():
        # Process the audio using the Whisper model
        segments, _ = model.transcribe('audio.mp3', beam_size=5)
        # concatenated_text = ' '.join([segment["text"] for segment in segments])
        text = []
        for segment in segments:
            text.append(segment.text)

        return text[0]


def chat(user_query):
     messages.append( {'role':'user',
        'parts': [user_query]})
     
     response = g_model.generate_content(messages,
                                        generation_config=genai.types.GenerationConfig(
                                        # Only one candidate for now.
                                        candidate_count=1,
                                        stop_sequences=['x'],
                                        max_output_tokens=1000,
                                        temperature=0.4),
                                    safety_settings=safety_settings)
     messages.append({'role':'model',
                        'parts':[response.text]})
     
     return response.text
        

def combine_audio_files(input_paths, output_path):
    # Combine logic (you may use a library like pydub for this)
    # Example using pydub:
    from pydub import AudioSegment

    combined_audio = AudioSegment.from_wav(input_paths[0])

    for path in input_paths[1:]:
        audio_segment = AudioSegment.from_wav(path)
        combined_audio += audio_segment

    combined_audio.export(output_path, format="wav")
    
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

        transcribe_text = transcribe()

        bot_replie= chat(transcribe_text)

        emoji_pattern = re.compile("["
        u"\U0001F600-\U0001F64F"  # emoticons
                           "]+", flags=re.UNICODE)
        
        cleaned_response = re.sub('[<>?!@*():"/\&#$%^;]', '', bot_replie)

        cleaned_response = emoji_pattern.sub(r'',  cleaned_response)

        cleaned_responses = [response for response in cleaned_response.split('.') if response.strip()]

        cleaned_responses = [response.replace('\n\n', ' ').replace('\n', ' ') for response in cleaned_responses]

        processed_audio_paths = []

        # Create a folder to store individual sentence audio files
        output_folder = "processed_audio"
        os.makedirs(output_folder, exist_ok=True)

        # # Process each sentence in the cleaned_responses array
        for cleaned_response in cleaned_responses:
            # Call the TTS function to convert text to speech and save the intermediate audio file
            audio_file_name = tortoise.call_api(cleaned_response)

            # Call the RVC function to convert the TTS audio file and save the final audio file
            output_audio_path = rvc_convert(model_path="ava.pth",
                        f0_up_key=2,
                        input_path=audio_file_name,
                        )
            
             # Append the processed audio path to the list
            processed_audio_paths.append(output_audio_path)
        

         # Combine all individual audio files into one
        combined_audio_path = os.path.join(output_folder, "combined_audio.wav")
        combine_audio_files(processed_audio_paths, combined_audio_path)
            
         

            # Send the processed audio file as a response for each sentence
    #    Send the combined processed audio file as a response
        return send_file(
            combined_audio_path,
            mimetype="audio/wav",
            as_attachment=False,
        ), 200

      
     
        

    except Exception as e:
        return jsonify({"error": str(e)}), 500








if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
