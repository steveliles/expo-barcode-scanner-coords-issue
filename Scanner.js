import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";

const { width, height } = Dimensions.get("window");

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [origin, setOrigin] = useState(); // iOS
  const [box, setBox] = useState(); // android
  const [code, setCode] = useState();

  const handleScanned = useCallback((params) => {
    setCode(params.data);
    if (params.boundingBox) {
      setBox(params.boundingBox);
    } else {
      setOrigin({
        x: params.bounds.origin.y * width,
        y: params.bounds.origin.x * height,
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null)
    return (
      <View>
        <Text>Getting permission ...</Text>
      </View>
    );

  if (hasPermission === false)
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={[StyleSheet.absoluteFillObject]}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.datamatrix],
        }}
        onBarCodeScanned={handleScanned}
      >
        {box && (
          <View
            style={{
              position: "absolute",
              left: box.origin.y,
              top: box.origin.x,
              width: box.size.height,
              height: box.size.width,
              backgroundColor: "red",
              opacity: 0.5,
            }}
          />
        )}
        {origin && (
          <>
            <View
              style={{
                position: "absolute",
                left: origin.x - 25,
                top: origin.y - 2.5,
                width: 50,
                height: 5,
                backgroundColor: "red",
                opacity: 0.5,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: origin.x - 2.5,
                top: origin.y - 25,
                width: 5,
                height: 50,
                backgroundColor: "red",
                opacity: 0.5,
              }}
            />
          </>
        )}
        {code && <Text style={{ color: "red", fontSize: 30 }}>{code}</Text>}
      </Camera>
    </View>
  );
}
