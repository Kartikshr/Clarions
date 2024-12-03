class CaptionManager {
    constructor() {
        if (!('webkitSpeechRecognition' in window)) {
            console.error('Speech recognition not supported');
            return;
        }

        this.recognition = new webkitSpeechRecognition();
        this.setupRecognition();
    }

    setupRecognition() {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            this.updateCaptions(finalTranscript, interimTranscript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    }

    updateCaptions(finalText, interimText) {
        const captionElement = document.getElementById('captions');
        if (captionElement) {
            captionElement.innerHTML = `
                <div class="final">${finalText}</div>
                <div class="interim">${interimText}</div>
            `;
        }
    }

    start() {
        try {
            this.recognition.start();
            console.log('Speech recognition started');
        } catch (e) {
            console.error('Speech recognition error:', e);
        }
    }

    stop() {
        this.recognition.stop();
        console.log('Speech recognition stopped');
    }
} 