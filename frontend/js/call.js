// ... existing WebRTC setup code ...

// Initialize caption manager for local user
let localCaptionManager;
// Store caption managers for remote users
const remoteCaptionManagers = new Map();

function initializeCaptions() {
    // Initialize local captions
    localCaptionManager = new CaptionManager();
    
    // Start capturing local speech when the call starts
    localCaptionManager.start();

    // Send transcribed text to other participants
    localCaptionManager.recognition.onresult = (event) => {
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

        // Update local captions
        localCaptionManager.updateCaptions(finalTranscript, interimTranscript);

        // Send captions to remote peers via your existing data channel
        sendDataToAllPeers({
            type: 'captions',
            final: finalTranscript,
            interim: interimTranscript,
            userId: localUserId // Assuming you have a local user ID
        });
    };
}

// Handle received caption data from remote peers
function handleReceivedCaptions(data) {
    const { userId, final, interim } = data;
    
    // Create or update caption display for remote user
    let remoteCaptionElement = document.getElementById(`captions-${userId}`);
    if (!remoteCaptionElement) {
        remoteCaptionElement = document.createElement('div');
        remoteCaptionElement.id = `captions-${userId}`;
        remoteCaptionElement.className = 'captions';
        document.getElementById('captions-container').appendChild(remoteCaptionElement);
    }

    remoteCaptionElement.innerHTML = `
        <div class="final">${final}</div>
        <div class="interim">${interim}</div>
    `;
}

// Add this to your existing data channel message handler
function handleDataChannelMessage(message) {
    const data = JSON.parse(message.data);
    if (data.type === 'captions') {
        handleReceivedCaptions(data);
    }
    // ... handle other message types ...
}

// Clean up when call ends
function endCall() {
    if (localCaptionManager) {
        localCaptionManager.stop();
    }
    // ... existing cleanup code ...
}

// Initialize captions when call starts
function startCall() {
    initializeCaptions();
    // ... existing call setup code ...
} 