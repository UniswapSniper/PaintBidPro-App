# LiDAR AI Video Estimator - Complete Implementation Guide

## 🎯 **Architecture Overview**

**Design Decisions:**
- ✅ **Live capture** with synchronized color + LiDAR depth
- ✅ **Hybrid output**: RoomPlan USDZ + MP4 video + JSON measurements
- ✅ **On-device processing**: No heavy Core ML models
- ✅ **UIKit integration**: Works with React Native/Expo Camera

## 📁 **Files Created**

| File | Purpose |
|------|---------|
| `LiDARCaptureModule.swift` | ARKit + RoomPlan session management |
| `LiDARCaptureModule.m` | Objective-C bridge |
| `LiDARCaptureModule.ts` | TypeScript wrapper |

## 🏗️ **What It Does**

### **1. ARKit Session**
- **Configuration**: `ARWorldTrackingConfiguration`
  - `sceneReconstruction = .meshWithClassification`
  - `frameSemantics = [.smoothedSceneDepth, .sceneDepth]`
  - `planeDetection = [.horizontal, .vertical]`

### **2. RoomPlan Integration**
- Detects walls, doors, windows, openings
- Calculates room dimensions automatically
- Exports USDZ 3D model

### **3. Video Recording**
- **Format**: HEVC (H.265) in .mov container
- **Resolution**: 1920x1440
- **Bitrate**: 10 Mbps
- Synchronized with ARKit frames

### **4. Measurements for Painting**
- Floor area (sq ft)
- Ceiling area (sq ft)
- Total wall area (sq ft)
- **Paintable wall area** (walls - doors - windows)
- Individual wall dimensions
- Room height

## 🔧 **Xcode Setup**

### **Step 1: Add Files to Xcode**
1. In Xcode, right-click `mobile` folder → **Add Files to "mobile"...**
2. Select:
   - `LiDARCaptureModule.swift`
   - `LiDARCaptureModule.m`
3. Uncheck "Copy items if needed"
4. Click **Add**

### **Step 2: Add Frameworks**
1. Select **mobile** target → **General** tab
2. **Frameworks, Libraries, and Embedded Content** → Click **+**
3. Add:
   - `ARKit.framework`
   - `RoomPlan.framework`
   - `RealityKit.framework`
   - `AVFoundation.framework` (should already be there)

### **Step 3: Build**
- Press **Cmd+B**
- Fix any errors (should compile cleanly)

## 🚀 **Usage in React Native**

### **1. Check Device Support**

```typescript
import LiDARCapture from '../modules/LiDARCaptureModule';

const capabilities = await LiDARCapture.checkLiDARSupport();

if (!capabilities.hasLiDAR) {
  // Show fallback: "Regular Video Estimate"
  Alert.alert(
    "LiDAR Not Available",
    "This device doesn't support LiDAR scanning. Use Regular Video Estimate instead."
  );
} else if (!capabilities.supportsRoomPlan) {
  // iOS 14-15 with LiDAR
  Alert.alert(
    "Limited Support",
    "Your device has LiDAR but needs iOS 16+ for full room scanning."
  );
} else {
  // Full support! iOS 16+ with LiDAR
  startLiDARScan();
}
```

### **2. Start LiDAR Session**

```typescript
// Start ARKit + RoomPlan
await LiDARCapture.startLiDARSession();

// Listen for room detection
const roomSubscription = LiDARCapture.addEventListener('onRoomDetected', (data) => {
  console.log(`Detected: ${data.wallCount} walls, ${data.doorCount} doors`);
  setAiMessage(`Found ${data.wallCount} walls. Keep scanning...`);
});

// Listen for frame updates
const frameSubscription = LiDARCapture.addEventListener('onLiDARFrameUpdate', (data) => {
  console.log(`Frame ${data.frameNumber}`);
});
```

### **3. Start Recording**

```typescript
import * as FileSystem from 'expo-file-system';

const outputPath = `${FileSystem.documentDirectory}room_scan_${Date.now()}.mov`;
await LiDARCapture.startRecording(outputPath);

// AI voice coaching while recording
await VoiceAI.speak("Great! I'm capturing the room. Move slowly and pan around.");
```

### **4. Stop and Get Measurements**

```typescript
// Stop recording
await LiDARCapture.stopRecording();

// Get room measurements
const measurements = await LiDARCapture.getRoomMeasurements();

console.log('Room Dimensions:', measurements.dimensions);
// {
//   width: 12.5,        // feet
//   length: 15.2,       // feet
//   height: 8.0,        // feet
//   floorArea: 190.0,   // sq ft
//   ceilingArea: 190.0, // sq ft
//   totalWallArea: 440.0,     // sq ft
//   paintableWallArea: 380.0  // sq ft (minus doors/windows)
// }

// Export 3D model
const modelPath = `${FileSystem.documentDirectory}room_model.usdz`;
await LiDARCapture.exportRoomModel(modelPath);

// Stop session
await LiDARCapture.stopLiDARSession();
```

### **5. Generate Estimate**

```typescript
const { dimensions, walls, doors, windows } = measurements;

// Calculate paint needed (2 coats, 350 sq ft per gallon)
const gallonsNeeded = Math.ceil((dimensions.paintableWallArea * 2) / 350);

// Generate line items
const lineItems = [
  {
    description: `Wall Painting (${dimensions.paintableWallArea.toFixed(0)} sq ft)`,
    quantity: dimensions.paintableWallArea,
    unit_price: 2.50,
    total: dimensions.paintableWallArea * 2.50
  },
  {
    description: `Ceiling Painting (${dimensions.ceilingArea.toFixed(0)} sq ft)`,
    quantity: dimensions.ceilingArea,
    unit_price: 2.00,
    total: dimensions.ceilingArea * 2.00
  },
  {
    description: `Door/Window Trim (${doors.length + windows.length} units)`,
    quantity: doors.length + windows.length,
    unit_price: 45.00,
    total: (doors.length + windows.length) * 45.00
  },
  {
    description: `Paint & Materials (${gallonsNeeded} gallons)`,
    quantity: gallonsNeeded,
    unit_price: 35.00,
    total: gallonsNeeded * 35.00
  }
];
```

## 🎨 **Integration with VideoEstimatorScreen**

Replace the existing camera-only approach with LiDAR:

```typescript
// In VideoEstimatorScreen.tsx

const [hasLiDAR, setHasLiDAR] = useState(false);
const [useLiDAR, setUseLiDAR] = useState(false);

useEffect(() => {
  checkLiDARSupport();
}, []);

const checkLiDARSupport = async () => {
  const capabilities = await LiDARCapture.checkLiDARSupport();
  setHasLiDAR(capabilities.supportsRoomPlan);
  setUseLiDAR(capabilities.supportsRoomPlan);
};

const startScan = async () => {
  if (useLiDAR) {
    // LiDAR mode
    await LiDARCapture.startLiDARSession();
    const outputPath = `${FileSystem.documentDirectory}scan_${Date.now()}.mov`;
    await LiDARCapture.startRecording(outputPath);
  } else {
    // Regular video mode (existing code)
    cameraRef.current?.recordAsync({ maxDuration: 60 });
  }
  
  setIsRecording(true);
  runStep(0);
};

const stopScan = async () => {
  if (useLiDAR) {
    await LiDARCapture.stopRecording();
    const measurements = await LiDARCapture.getRoomMeasurements();
    await LiDARCapture.stopLiDARSession();
    handleLiDARComplete(measurements);
  } else {
    cameraRef.current?.stopRecording();
  }
  
  setIsRecording(false);
};
```

## 🎯 **AI Voice Coaching Prompts**

Update prompts for LiDAR scanning:

```typescript
const LIDAR_PROMPTS = {
  greeting: "I'm starting the LiDAR scanner. Point your camera at a wall and move slowly.",
  walls: "Perfect! I'm detecting the walls. Keep panning slowly around the room.",
  corners: "Great! Now focus on the corners. I need to see where the walls meet.",
  doors: "I see a door. Make sure to capture the full frame.",
  windows: "Window detected. Scan around it so I can measure the trim.",
  ceiling: "Almost done! Tilt up to show me the ceiling height.",
  complete: "Excellent! I've captured the entire room. Processing measurements..."
};
```

## 📊 **Events You'll Receive**

| Event | When | Data |
|-------|------|------|
| `onLiDARSessionStarted` | Session begins | timestamp, configuration |
| `onLiDARFrameUpdate` | Every 10 frames | frameNumber, timestamp, hasDepth |
| `onRoomDetected` | Room structure found | wallCount, doorCount, windowCount |
| `onRecordingStarted` | Recording begins | outputPath, timestamp |
| `onRecordingStopped` | Recording ends | frameCount, timestamp |
| `onError` | Error occurs | error message |

## 🐛 **Troubleshooting**

### **"No such module 'RoomPlan'"**
- Make sure you added `RoomPlan.framework` in Xcode
- iOS deployment target must be 16.0+

### **"This device does not support LiDAR"**
- Only iPhone 12 Pro+ and iPad Pro (2020+) have LiDAR
- Show fallback UI for regular video estimate

### **Recording fails**
- Check file permissions
- Ensure output path is writable
- Use `FileSystem.documentDirectory` for output

## 🎉 **What You Get**

After a successful scan:
1. **Video file** (.mov) with HEVC encoding
2. **Room model** (.usdz) for AR preview
3. **Measurements** (JSON):
   - Precise room dimensions
   - Wall-by-wall breakdown
   - Paintable surface area
   - Door/window locations and sizes

## 🚀 **Next Steps**

1. **Add files to Xcode** (5 minutes)
2. **Build and test** on your iPhone
3. **Integrate into VideoEstimatorScreen** (15 minutes)
4. **Polish AI coaching** for LiDAR-specific prompts
5. **Add fallback UI** for non-LiDAR devices

---

**You now have a complete LiDAR AI Video Estimator ready to polish in Xcode!** 🎨📐
