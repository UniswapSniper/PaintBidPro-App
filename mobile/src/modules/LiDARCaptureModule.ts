import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const LINKING_ERROR =
    `The package 'LiDARCaptureModule' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo Go\n';

const LiDARNative = NativeModules.LiDARCaptureModule
    ? NativeModules.LiDARCaptureModule
    : new Proxy(
        {},
        {
            get() {
                throw new Error(LINKING_ERROR);
            },
        }
    );

const eventEmitter = new NativeEventEmitter(LiDARNative);

export interface LiDARCapabilities {
    hasLiDAR: boolean;
    supportsRoomPlan: boolean;
    supportsDepth: boolean;
    iosVersion: string;
    deviceModel: string;
}

export interface RoomDimensions {
    width: number;
    length: number;
    height: number;
    floorArea: number;
    ceilingArea: number;
    totalWallArea: number;
    paintableWallArea: number;
}

export interface Wall {
    id: string;
    width: number;
    height: number;
    area: number;
}

export interface Opening {
    id: string;
    width: number;
    height: number;
    area: number;
}

export interface RoomMeasurements {
    dimensions: RoomDimensions;
    walls: Wall[];
    doors: Opening[];
    windows: Opening[];
    openings: { id: string }[];
}

export interface LiDAREvents {
    onLiDARSessionStarted: (data: { timestamp: number; configuration: any }) => void;
    onLiDARFrameUpdate: (data: { frameNumber: number; timestamp: number; hasDepth: boolean }) => void;
    onRoomDetected: (data: { wallCount: number; doorCount: number; windowCount: number }) => void;
    onMeasurementUpdate: (data: RoomMeasurements) => void;
    onRecordingStarted: (data: { outputPath: string; timestamp: number }) => void;
    onRecordingStopped: (data: { frameCount: number; timestamp: number }) => void;
    onError: (data: { error: string }) => void;
}

class LiDARCaptureModule {
    /**
     * Check if LiDAR is supported on this device
     */
    async checkLiDARSupport(): Promise<LiDARCapabilities> {
        if (Platform.OS !== 'ios') {
            return {
                hasLiDAR: false,
                supportsRoomPlan: false,
                supportsDepth: false,
                iosVersion: 'N/A',
                deviceModel: 'N/A',
            };
        }
        return LiDARNative.checkLiDARSupport();
    }

    /**
     * Start LiDAR + RoomPlan session
     */
    async startLiDARSession(): Promise<{ success: boolean }> {
        return LiDARNative.startLiDARSession();
    }

    /**
     * Stop LiDAR session
     */
    async stopLiDARSession(): Promise<{ success: boolean }> {
        return LiDARNative.stopLiDARSession();
    }

    /**
     * Start recording video with depth data
     */
    async startRecording(outputPath: string): Promise<{ success: boolean }> {
        return LiDARNative.startRecording(outputPath);
    }

    /**
     * Stop recording
     */
    async stopRecording(): Promise<{ success: boolean; frameCount: number }> {
        return LiDARNative.stopRecording();
    }

    /**
     * Get room measurements (walls, doors, windows, dimensions)
     */
    async getRoomMeasurements(): Promise<RoomMeasurements> {
        return LiDARNative.getRoomMeasurements();
    }

    /**
     * Export room as USDZ model
     */
    async exportRoomModel(outputPath: string): Promise<{ success: boolean; path: string }> {
        return LiDARNative.exportRoomModel(outputPath);
    }

    /**
     * Subscribe to LiDAR events
     */
    addEventListener<K extends keyof LiDAREvents>(
        eventName: K,
        listener: LiDAREvents[K]
    ) {
        return eventEmitter.addListener(eventName, listener);
    }

    /**
     * Remove event listener
     */
    removeEventListener(subscription: any) {
        subscription.remove();
    }
}

export default new LiDARCaptureModule();
