let mediaRecorder;
let audioChunks = [];

document.getElementById('startRecord').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('audio', audioBlob);

            try {
                const response = await fetch('/transcribe', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                document.getElementById('result').textContent = result.text;
            } catch (error) {
                console.error('转写错误:', error);
                document.getElementById('status').textContent = '转写失败';
            }
        };

        mediaRecorder.start();
        document.getElementById('startRecord').disabled = true;
        document.getElementById('stopRecord').disabled = false;
        document.getElementById('status').textContent = '录音中...';
        
    } catch (error) {
        console.error('录音错误:', error);
        document.getElementById('status').textContent = '无法访问麦克风';
    }
});

document.getElementById('stopRecord').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('startRecord').disabled = false;
    document.getElementById('stopRecord').disabled = true;
    document.getElementById('status').textContent = '正在转写...';
    audioChunks = [];
}); 