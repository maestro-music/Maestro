import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from 'sentry-expo';

import App from "./src/route"
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

Sentry.init({
    dsn: 'https://0ef2d032e7234b9a80a5e8e6cbf681e0@o1341716.ingest.sentry.io/6752715',
    enableInExpoDevelopment: false,
    debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

SplashScreen.preventAutoHideAsync();

export default function EntryPoint() {
    let [fontsLoaded] = useFonts(
        {
            "Gilroy-Black": require("./src/assets/fonts/Gilroy-Black.ttf"),
            "Gilroy-BlackItalic": require("./src/assets/fonts/Gilroy-BlackItalic.ttf"),
            "Gilroy-Bold": require("./src/assets/fonts/Gilroy-Bold.ttf"),
            "Gilroy-BoldItalic": require("./src/assets/fonts/Gilroy-BoldItalic.ttf"),
            "Gilroy-ExtraBold": require("./src/assets/fonts/Gilroy-ExtraBold.ttf"),
            "Gilroy-ExtraBoldItalic": require("./src/assets/fonts/Gilroy-ExtraBoldItalic.ttf"),
            "Gilroy-Heavy": require("./src/assets/fonts/Gilroy-Heavy.ttf"),
            "Gilroy-HeavyItalic": require("./src/assets/fonts/Gilroy-HeavyItalic.ttf"),
            "Gilroy-Light": require("./src/assets/fonts/Gilroy-Light.ttf"),
            "Gilroy-LightItalic": require("./src/assets/fonts/Gilroy-LightItalic.ttf"),
            "Gilroy-Medium": require("./src/assets/fonts/Gilroy-Medium.ttf"),
            "Gilroy-MediumItalic": require("./src/assets/fonts/Gilroy-MediumItalic.ttf"),
            "Gilroy-Regular": require("./src/assets/fonts/Gilroy-Regular.ttf"),
            "Gilroy-RegularItalic": require("./src/assets/fonts/Gilroy-RegularItalic.ttf"),
            "Gilroy-SemiBold": require("./src/assets/fonts/Gilroy-SemiBold.ttf"),
            "Gilroy-SemiBoldItalic": require("./src/assets/fonts/Gilroy-SemiBoldItalic.ttf"),
            "Gilroy-Thin": require("./src/assets/fonts/Gilroy-Thin.ttf"),
            "Gilroy-ThinItalic": require("./src/assets/fonts/Gilroy-ThinItalic.ttf"),
            "Gilroy-UltraLight": require("./src/assets/fonts/Gilroy-UltraLight.ttf"),
            "Gilroy-UltraLightItalic": require("./src/assets/fonts/Gilroy-UltraLightItalic.ttf"),
        }
    );

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync()
    }, [fontsLoaded])

    if (!fontsLoaded) return null

    return (
        <App />
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
