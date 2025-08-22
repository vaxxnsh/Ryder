import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useLocationStore } from "@/store/useLocationStore";
import { PaymentProps } from "@/types/type";
import { useAuth } from "@clerk/clerk-expo";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {

    const {
        userAddress,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationAddress,
        destinationLongitude,
    } = useLocationStore();
    const { userId } = useAuth();
    const [success, setSuccess] = useState<boolean>(false);

    const placeOrder = async () => {
        try {
                    await fetchAPI("/(api)/ride/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  origin_address: userAddress,
                  destination_address: destinationAddress,
                  origin_latitude: userLatitude,
                  origin_longitude: userLongitude,
                  destination_latitude: destinationLatitude,
                  destination_longitude: destinationLongitude,
                  ride_time: rideTime.toFixed(0),
                  fare_price: parseInt(amount) * 100,
                  payment_status: "paid",
                  driver_id: driverId,
                  user_id: userId,
                }),
        });
        setSuccess(true);
        router.push("/(root)/(tabs)/home");
        }
        catch (err) {
            setSuccess(false);
            console.log(err)
        }
    }

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={() => setSuccess(true)}
      />

      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />

          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Booking placed successfully
          </Text>

          <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
            Thank you for your booking. Your reservation has been successfully
            placed. Please proceed with your trip.
          </Text>

          <CustomButton
            title="Back Home"
            onPress={placeOrder}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;