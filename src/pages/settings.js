import AsyncStorage from "@react-native-async-storage/async-storage"
import { useContext, useEffect, useState } from "react"
import { Text, View } from "react-native"
import SpotifyLogin from "../components/login/spotify"
import styles from "../components/style/default"
import { Button } from "react-native-paper";
import jwtDecode from "jwt-decode"
import { TokenContext } from "../store/token"

export default function Settings ({ navigation }) {
    const [token, setToken] = useContext(TokenContext)
    
    let decodedToken = null
    if (token != "") {
        decodedToken = jwtDecode(token)
    }

    return (
        <View style={{
            flex: 1,
            ...styles.container,
            width: "100%",
        }}>
            <Text
                style={{
                    ...styles.text,
                    fontSize: 20,
                    marginBottom: 30,
                }}
            >
                Settings
            </Text>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    paddingLeft: 20,
                    paddingRight: 20,
                }}
            >
                <Text
                    style={{
                        ...styles.text,
                        marginBottom: 20,
                        fontSize: 16
                    }}
                >
                    Liaison avec Spotify
                </Text>
                {decodedToken && decodedToken.spotify ? 
                    <Text
                        style={{
                            color: "white"
                        }}
                    >
                        Connexion à Spotify établie !
                    </Text>
                    :
                    <SpotifyLogin navigation={navigation} isLogged title="Lier Spotify"/>
                }
            </View>
            <Button
                mode="outlined"
                style={{
                    ...styles.button,
                    position: "absolute", 
                    bottom: 30,
                    borderColor: "red"
                }}
                labelStyle={{
                    ...styles.text,
                    color: "red"
                }}
                icon="door"
                onPress={async () => {
                    setToken("")
                    navigation.navigate("login")
                }}
            >
                Deconnexion
            </Button>
        </View>
    )
}