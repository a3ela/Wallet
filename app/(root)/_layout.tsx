import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";

const RootGroupLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) return <Redirect href="/sign-in" />;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Slot />;
};
export default RootGroupLayout;
