import { icons } from '@/constants';
import { useFetch } from '@/lib/fetch';
import { calculateDriverTimes, calculateRegion, calculateZoom, generateMarkersFromData } from '@/lib/map';
import { useDriverStore, useLocationStore } from '@/store/useLocationStore';
import { Driver, MarkerData } from '@/types/type';
import { useImage } from 'expo-image';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { GoogleMapsColorScheme, GoogleMapsMapType, GoogleMapsPolyline } from 'expo-maps/build/google/GoogleMaps.types';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';





export default function Map() {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const markerIcon = useImage(icons.marker);
  const selectedMarkerIcon = useImage(icons.selectedMarker);
  const { data: drivers, error } = useFetch<Driver[]>("/(api)/driver");
  let polyLines : GoogleMapsPolyline[] = []

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude, userLatitude, userLongitude, setDrivers]);

  const zoom = calculateZoom(region.latitudeDelta);

  if(userLatitude && userLongitude && destinationLatitude && destinationLongitude) {
    polyLines = [
      {
        coordinates : [
          {
            latitude : userLatitude,
            longitude : userLongitude
          },
          {
            latitude : destinationLatitude,
            longitude  : destinationLongitude,
          }
        ]
      }
    ]
  }


  if ((!userLatitude && !userLongitude))
    return (
    <View className="flex-1 justify-center items-center w-full h-full">
      <ActivityIndicator size="small" color="#000" />
    </View>
    );

  if (error)
  return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
  );

 

  return (
    <View className="flex-1 w-full">
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          style={{ flex: 1 }}
          cameraPosition={{
            coordinates: {
              latitude: region.latitude,
              longitude: region.longitude,
            },
            zoom,
          }}
          
        />
      ) : Platform.OS === 'android' ? (
        <GoogleMaps.View
          style={{ flex: 1 }}
          properties={{
            mapType: GoogleMapsMapType.NORMAL,
            isIndoorEnabled: true,
          }}
          polylines={polyLines}
          uiSettings={{
            scrollGesturesEnabled: true,
            scrollGesturesEnabledDuringRotateOrZoom: true,
            compassEnabled : false,
            scaleBarEnabled : true,
            zoomControlsEnabled: true,
          }}
          colorScheme={GoogleMapsColorScheme.LIGHT}
          markers={[...markers.map((m) => {
            return {
            id : m.id+'',
            coordinates : {
              latitude : m.latitude,
              longitude : m.longitude
            },
            icon : (selectedDriver === m.id ? selectedMarkerIcon : markerIcon) ?? undefined 
            }
          }),
          {
            coordinates : {
              latitude : userLatitude ?? undefined,
              longitude : userLongitude ?? undefined,
            }
          }
        ]}
          cameraPosition={{
            coordinates: {
              latitude: region.latitude,
              longitude: region.longitude,
            },
            zoom,
            
          }}

          
          
        />
      ) : (
        <Text className="text-white">Maps are only available on Android and iOS</Text>
      )}
    </View>
  );
}