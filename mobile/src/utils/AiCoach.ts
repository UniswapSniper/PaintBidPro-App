import * as Speech from 'expo-speech';

// The "Script" for the walkthrough
export const WALKTHROUGH_STEPS = [
    {
        id: 'intro',
        text: "I'm ready to estimate. Please stand at the room's entrance and capture the entire layout.",
        duration: 6000
    },
    {
        id: 'walls',
        text: "Great. Now, slowly pan clockwise. I'm scanning for wall damage and outlet locations.",
        duration: 8000
    },
    {
        id: 'windows',
        text: "Please focus on any windows or doors. I need to see the trim condition.",
        duration: 6000
    },
    {
        id: 'ceiling',
        text: "Okay, tilt up. Let's look at the ceiling and crown molding.",
        duration: 5000
    },
    {
        id: 'outro',
        text: "Perfect. I have enough data. You can stop recording now.",
        duration: 3000
    }
];

class AiCoach {
    isSpeaking = false;

    speak(text: string) {
        // Stop any current speech
        if (this.isSpeaking) {
            Speech.stop();
        }

        this.isSpeaking = true;
        Speech.speak(text, {
            language: 'en-US',
            pitch: 1.0,
            rate: 0.9, // Slightly slower for clarity
            onDone: () => {
                this.isSpeaking = false;
            },
            onStopped: () => {
                this.isSpeaking = false;
            }
        });
    }

    stop() {
        Speech.stop();
        this.isSpeaking = false;
    }
}

export default new AiCoach();
