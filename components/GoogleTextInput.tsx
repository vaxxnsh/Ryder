import { GoogleInputProps } from "@/types/type";
import React from "react";
import { View } from "react-native";
import GooglePlacesAutocomplete from 'react-native-google-places-textinput';

const googleApiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY || "";

const GooglePlacesInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  
  const handlePlaceSelect = (place: any, sessionToken?: string | null) => {    
    if (place && place.details) {
      handlePress({
        latitude: place.details.location.latitude,
        longitude: place.details.location.longitude,
        address: place.details.formatted_address || place.details.displayName.text || '',
      });
    }
  };

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >      
      <GooglePlacesAutocomplete
        apiKey={googleApiKey}
        onPlaceSelect={handlePlaceSelect}
        placeHolderText={initialLocation ?? "Where do you want to go?"}
        fetchDetails={true}
        debounceDelay={200}
        showLoadingIndicator={false}
        showClearButton={false}
        minCharsToFetch={1}
        languageCode="en"
        style={{
          container: {
            flex: 1,
          },
          suggestionsContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          input: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
            color: "black",
          },
          suggestionsList: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "relative",
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
              
        onError={(error) => {
          console.error('Google Places API Error:', error);
        }}
      />
    </View>
  );
};

export default GooglePlacesInput;