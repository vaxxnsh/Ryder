import { AppleMaps, GoogleMaps } from 'expo-maps';
import { GoogleMapsColorScheme, GoogleMapsMapType } from 'expo-maps/build/google/GoogleMaps.types';
import { Platform, Text, View } from 'react-native';

export default function Map() {
  return (
    <View className="flex-1 w-full">
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          style={{ flex: 1 }}
          cameraPosition={{
            zoom: 10, 
          }}
        />
      ) : Platform.OS === 'android' ? (
        <GoogleMaps.View
          style={{ flex: 1 }}
          properties={{
            mapType: GoogleMapsMapType.NORMAL,
            isIndoorEnabled : true,
          }}
          uiSettings={{
            scrollGesturesEnabled : true,
            scrollGesturesEnabledDuringRotateOrZoom : true,
            zoomControlsEnabled: true, 
          }}
          colorScheme={GoogleMapsColorScheme.FOLLOW_SYSTEM}
          cameraPosition={{
            zoom: 10, 
          }}
        />
      ) : (
        <Text className="text-white">Maps are only available on Android and iOS</Text>
      )}
    </View>
  );
}