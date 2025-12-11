import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const LINKING_ERROR =
    `The package 'RoomPlanModule' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo Go\n';

const RoomPlanNative = NativeModules.RoomPlanModule
    ? NativeModules.RoomPlanModule
    : new Proxy(
        {},
        {
            get() {
                throw new Error(LINKING_ERROR);
            },
        }
    );

const eventEmitter = new NativeEventEmitter(RoomPlanNative);

export interface RoomPlanCapabilities {
    supported: boolean;
    iosVersion: string;
    hasLiDAR: boolean;
}

export interface RoomDimensions {
    width: number;
    length: number;
    height: number;
    area: number;
}

export interface RoomData {
    walls: any[];
    doors: any[];
    windows: any[];
    openings: any[];
    dimensions: RoomDimensions;
}

export interface RoomPlanEvents {
    onRoomScanStarted: (data: { status: string; timestamp: number }) => void;
    onRoomScanUpdated: (data: { progress: number }) => void;
    onRoomScanCompleted: (data: { status: string; timestamp: number }) => void;
    onRoomScanError: (data: { error: string }) => void;
}

class RoomPlanModule {
    /**
     * Check if RoomPlan is supported on this device
     */
    async isRoomPlanSupported(): Promise<RoomPlanCapabilities> {
        if (Platform.OS !== 'ios') {
            return {
                supported: false,
                iosVersion: 'N/A',
                hasLiDAR: false,
            };
        }
        return RoomPlanNative.isRoomPlanSupported();
    }

    /**
     * Start a room scanning session
     */
    async startRoomScan(): Promise<{ success: boolean }> {
        return RoomPlanNative.startRoomScan();
    }

    /**
     * Stop the current room scanning session
     */
    async stopRoomScan(): Promise<{ success: boolean }> {
        return RoomPlanNative.stopRoomScan();
    }

    /**
     * Get the captured room data
     */
    async getRoomData(): Promise<RoomData> {
        return RoomPlanNative.getRoomData();
    }

    /**
     * Subscribe to room scan events
     */
    addEventListener<K extends keyof RoomPlanEvents>(
        eventName: K,
        listener: RoomPlanEvents[K]
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

export default new RoomPlanModule();
