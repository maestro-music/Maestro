import React, { useContext, useEffect } from "react"
import { View, StyleSheet, Image, Text } from "react-native";
import GoogleLogin from "../components/login/google";
import AppleLogin from "../components/login/apple";
import SpotifyLogin from "../components/login/spotify";
import styles from "../components/style/default"
import { TokenContext } from "../store/token";

export default function LoginView ({navigation}) {
    const [token, setToken] = useContext(TokenContext)

    useEffect(() => {
        if (token && token != "") {
            navigation.reset({
                index: 0,
                routes: [{ 
                    name: 'home',
                }]
            })
        }
    }, [token])

    return (
        <View style={styles.container}>
            <Image 
                source={require("../assets/logo/logo.png")}
                style={{
                    width: 150,
                    height: 40,
                    marginBottom: 20
                }}
            />
            <Text
                style={{
                    ...styles.text,
                    marginBottom: 50
                }}
            >Deviens le maitre de la musique 🎷</Text>
            <View>
                <GoogleLogin navigation={navigation} />
            </View>
            <View
                style={{marginTop: 15}}
            >
                <SpotifyLogin navigation={navigation} />
            </View>
            <View
                style={{marginTop: 15}}
            >
                <AppleLogin navigation={navigation} />
            </View>
            <Text
                style={{
                    ...styles.text,
                    position: "absolute",
                    bottom: 20,
                }}
            >
                made in 🇫🇷
            </Text>
        </View>
    )
}