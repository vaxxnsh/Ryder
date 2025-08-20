import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Page = () => {
  const { isSignedIn,isLoaded } = useAuth();
  console.log("is loaded : ",isLoaded)
  console.log("is signed in : ",isSignedIn)
  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;