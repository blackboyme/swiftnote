from flask import Flask, request, jsonify, render_template
import whisper
import tempfile
import os

app = Flask(__name__)
model = whisper.load_model("base")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': '没有收到音频文件'}), 400
    
    audio_file = request.files['audio']
    
    # 创建临时文件保存上传的音频
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        audio_file.save(temp_audio.name)
        # 使用 Whisper 模型转写音频
        result = model.transcribe(temp_audio.name)
        
    # 删除临时文件
    os.unlink(temp_audio.name)
    
    return jsonify({'text': result['text']})

if __name__ == '__main__':
    app.run(debug=True) 