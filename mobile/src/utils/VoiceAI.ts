import { Audio } from 'expo-av';
import { API_URL } from '../lib/api';
import * as FileSystem from 'expo-file-system';

// Conversational prompts
const PROMPTS = {
    greeting: "Hey there! I'm your AI estimating assistant. Let's get this room scanned. Start at the entrance and I'll guide you through.",
    walls: "Perfect. Now slowly pan around the room. I'm analyzing the wall conditions and looking for any damage that needs prep work.",
    windows: "Great work. Now focus on any windows and doors. I need to see the trim and frames up close.",
    ceiling: "Almost done! Tilt up and show me the ceiling. I'm checking for any water damage or texture issues.",
    complete: "Excellent scan! I've got everything I need. Give me a moment to crunch the numbers.",
    listening: "I'm listening. What's your question?",
};

class VoiceAI {
    private recording: Audio.Recording | null = null;
    private sound: Audio.Sound | null = null;
    private isSpeaking = false;

    // Speak using OpenAI TTS (ultra-realistic)
    async speak(text: string): Promise<void> {
        try {
            // Stop any current playback
            if (this.sound) {
                await this.sound.stopAsync();
                await this.sound.unloadAsync();
                this.sound = null;
            }

            this.isSpeaking = true;

            // Call OpenAI TTS API
            const response = await fetch(`${API_URL}/ai/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    voice: 'nova' // Friendly, warm female voice
                }),
            });

            const data = await response.json();

            if (data.audio) {
                // Save base64 audio to temp file
                const fileUri = FileSystem.cacheDirectory + 'tts_audio.mp3';
                await FileSystem.writeAsStringAsync(fileUri, data.audio, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Configure audio mode
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                });

                // Play the audio
                const { sound } = await Audio.Sound.createAsync(
                    { uri: fileUri },
                    { shouldPlay: true }
                );
                this.sound = sound;

                // Wait for playback to complete
                return new Promise((resolve) => {
                    sound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded && status.didJustFinish) {
                            this.isSpeaking = false;
                            resolve();
                        }
                    });
                });
            }
        } catch (error) {
            console.error('TTS error:', error);
            this.isSpeaking = false;
        }
    }

    // Stop speaking
    async stop() {
        if (this.sound) {
            try {
                await this.sound.stopAsync();
                await this.sound.unloadAsync();
            } catch { }
            this.sound = null;
        }
        this.isSpeaking = false;
    }

    // Start recording user speech
    async startListening(): Promise<void> {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Audio permission not granted');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            this.recording = recording;
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    }

    // Stop recording and transcribe with Whisper
    async stopListening(): Promise<string> {
        if (!this.recording) return '';

        try {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();
            this.recording = null;

            if (!uri) return '';

            // Read audio file
            const audioBase64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Create form data for upload
            const formData = new FormData();
            formData.append('audio', {
                uri,
                type: 'audio/m4a',
                name: 'recording.m4a',
            } as any);

            const response = await fetch(`${API_URL}/ai/transcribe`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data.transcription || '';
        } catch (error) {
            console.error('Failed to transcribe:', error);
            return '';
        }
    }

    // Ask AI a question
    async askAI(question: string, context?: string): Promise<string> {
        try {
            const response = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    context: context || 'User is scanning a room for a painting estimate',
                }),
            });

            const data = await response.json();
            return data.response || "I didn't quite catch that. Could you repeat?";
        } catch (error) {
            console.error('AI chat failed:', error);
            return "I'm having trouble connecting. Let's continue with the scan.";
        }
    }

    // Get prompt for current step
    getStepPrompt(step: 'greeting' | 'walls' | 'windows' | 'ceiling' | 'complete'): string {
        return PROMPTS[step];
    }

    // Clean up resources
    async cleanup() {
        if (this.recording) {
            try {
                await this.recording.stopAndUnloadAsync();
            } catch { }
            this.recording = null;
        }
        await this.stop();
    }
}

export default new VoiceAI();
export { PROMPTS };
