# import ffmpeg

from faster_whisper import WhisperModel
# import numpy as np
# import scipy

from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)

CORS(app, origins="*")  # Enable CORS for the entire app
# ! docker build . -t flask-server -f Dockerfile.gpu
# ! docker run -it --gpus all -p 5002:5002 flask-server:latest
# Initialize Whisper model
model_size = "base.en"
model = WhisperModel(model_size, device="cuda", compute_type="float16")


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
