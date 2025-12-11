# RoomPlan LiDAR Integration - Xcode Polish Guide

## 📁 Files Created

1. **RoomPlanModule.swift** - Main native module
2. **RoomPlanModule.m** - Objective-C bridge
3. **RoomPlanModule.ts** - TypeScript wrapper

## 🎯 What to Polish in Xcode

### 1. Add RoomPlan Framework
- Open `mobile.xcworkspace` in Xcode
- Select your app target → **General** → **Frameworks, Libraries, and Embedded Content**
- Click **+** and add **RoomPlan.framework**
- Add **RealityKit.framework**
- Add **ARKit.framework**

### 2. Add the Files to Xcode Project
- In Xcode, right-click on the `mobile` folder
- Select **Add Files to "mobile"...**
- Navigate to `ios/mobile/` and add:
  - `RoomPlanModule.swift`
  - `RoomPlanModule.m`
- Make sure **"Copy items if needed"** is unchecked
- Make sure **"Create groups"** is selected
- Target membership: Check **mobile**

### 3. Update Info.plist (Already Done)
✅ Camera permission: Already added
✅ Microphone permission: Already added

### 4. Polish RoomPlanModule.swift

#### Key Areas to Enhance:

**A. RoomCaptureSessionDelegate**
Add delegate to receive real-time updates:

```swift
extension RoomPlanModule: RoomCaptureSessionDelegate {
    func captureSession(_ session: RoomCaptureSession, didUpdate room: CapturedRoom) {
        // Send real-time room updates to React Native
        sendEvent(withName: "onRoomScanUpdated", body: [
            "wallCount": room.walls.count,
            "doorCount": room.doors.count,
            "windowCount": room.windows.count,
            "progress": calculateProgress(room)
        ])
    }
    
    func captureSession(_ session: RoomCaptureSession, didEndWith data: CapturedRoomData, error: Error?) {
        if let error = error {
            sendEvent(withName: "onRoomScanError", body: ["error": error.localizedDescription])
        } else {
            processCapturedRoom(data)
        }
    }
}
```

**B. Extract Room Dimensions**
In `getRoomData()`, extract actual measurements:

```swift
@objc
func getRoomData(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard #available(iOS 16.0, *) else {
        reject("UNSUPPORTED", "RoomPlan requires iOS 16.0 or later", nil)
        return
    }
    
    guard let capturedRoom = self.capturedRoom else {
        reject("NO_DATA", "No room data available", nil)
        return
    }
    
    // Calculate room dimensions
    var minX: Float = .infinity
    var maxX: Float = -.infinity
    var minZ: Float = .infinity
    var maxZ: Float = -.infinity
    var height: Float = 0
    
    for wall in capturedRoom.walls {
        for point in wall.curve {
            minX = min(minX, point.x)
            maxX = max(maxX, point.x)
            minZ = min(minZ, point.z)
            maxZ = max(maxZ, point.z)
        }
        height = max(height, wall.dimensions.y)
    }
    
    let width = maxX - minX
    let length = maxZ - minZ
    let area = width * length
    
    // Extract walls
    let walls = capturedRoom.walls.map { wall in
        return [
            "id": wall.identifier.uuidString,
            "dimensions": [
                "width": wall.dimensions.x,
                "height": wall.dimensions.y
            ],
            "area": wall.dimensions.x * wall.dimensions.y
        ]
    }
    
    // Extract doors
    let doors = capturedRoom.doors.map { door in
        return [
            "id": door.identifier.uuidString,
            "dimensions": [
                "width": door.dimensions.x,
                "height": door.dimensions.y
            ]
        ]
    }
    
    // Extract windows
    let windows = capturedRoom.windows.map { window in
        return [
            "id": window.identifier.uuidString,
            "dimensions": [
                "width": window.dimensions.x,
                "height": window.dimensions.y
            ]
        ]
    }
    
    resolve([
        "walls": walls,
        "doors": doors,
        "windows": windows,
        "openings": capturedRoom.openings.map { ["id": $0.identifier.uuidString] },
        "dimensions": [
            "width": width,
            "length": length,
            "height": height,
            "area": area
        ]
    ])
}
```

**C. Add Progress Calculation**

```swift
private func calculateProgress(_ room: CapturedRoom) -> Double {
    // Simple progress based on detected surfaces
    let totalExpected = 4 // walls
    let detected = room.walls.count
    return min(Double(detected) / Double(totalExpected), 1.0)
}
```

**D. Store Captured Room**
Add property to store the final room:

```swift
private var capturedRoom: CapturedRoom?
```

### 5. Build in Xcode
- Press **Cmd+B** to build
- Fix any Swift errors
- Make sure the module compiles

### 6. Test on Your iPhone
After building, the module will be available in React Native!

## 🚀 Usage in React Native (Already Set Up)

```typescript
import RoomPlanModule from '../modules/RoomPlanModule';

// Check support
const capabilities = await RoomPlanModule.isRoomPlanSupported();
if (capabilities.supported) {
  // Start scanning
  await RoomPlanModule.startRoomScan();
  
  // Listen for updates
  const subscription = RoomPlanModule.addEventListener('onRoomScanUpdated', (data) => {
    console.log('Scan progress:', data.progress);
  });
  
  // Stop and get data
  await RoomPlanModule.stopRoomScan();
  const roomData = await RoomPlanModule.getRoomData();
}
```

## 📝 Next Steps

1. Open Xcode (`mobile.xcworkspace`)
2. Add the frameworks (RoomPlan, RealityKit, ARKit)
3. Add the Swift/Obj-C files to the project
4. Polish the `getRoomData()` method with real measurements
5. Add the delegate methods for real-time updates
6. Build and test on your iPhone

## 🎨 Polish Ideas

- Add confidence scores for detected surfaces
- Export room as USDZ file
- Add floor plan visualization
- Detect paint condition (smooth/textured walls)
- Calculate paint coverage automatically
- Add room labeling (bedroom, kitchen, etc.)

---

**The foundation is ready! Now you can polish it in Xcode to extract precise measurements and enhance the LiDAR scanning experience.** 🚀
