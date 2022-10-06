import AsyncStorage from "@react-native-async-storage/async-storage"
import { useContext, useEffect, useState } from "react"
import { Text, View, Keyboard } from "react-native"
import SpotifyLogin from "../components/login/spotify"
import styles from "../components/style/default"
import { Button, HelperText, TextInput } from "react-native-paper";
import jwtDecode from "jwt-decode"
import { TokenContext } from "../store/token"
import config from "../config"

export default function Settings ({ navigation }) {
    const [token, setToken, decodedToken, setDecoded] = useContext(TokenContext)
    const [name, setName] = useState("")

    const change_pseudo = () => {
        fetch(config.API + "/profil/name", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name: name
            })
        }).then(t => t.text())
        .then(data => {
            setToken(data)
            alert("Votre pseudo a été changé!")
            setName("")
            Keyboard.dismiss()
        })
        .catch(e => console.log(e))
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
                Paramètres
            </Text>
            <View
                style={{
                    width: "100%",
                    paddingLeft: 20,
                    paddingRight: 20,
                    marginTop: 20
                }}
            >
                <Text
                    style={{
                        ...styles.text,
                        marginBottom: 20,
                        fontSize: 16
                    }}
                >
                   Lier son compte à Spotify 
                </Text>
                {decodedToken && decodedToken.spotify ? 
                    <Text
                        style={{
                            color: "white"
                        }}
                    >
                        ✅ Connexion à Spotify établie !
                    </Text>
                    :
                    <SpotifyLogin navigation={navigation} isLogged title="Lier Spotify"/>
                }
            </View>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    paddingLeft: 20,
                    paddingRight: 20,
                    marginTop: 60
                }}
            >
                <Text
                    style={{
                        ...styles.text,
                        marginBottom: 20,
                        fontSize: 16
                    }}
                >
                    Changer de pseudo
                </Text>
                <TextInput 
                    label={decodedToken?.name}
                    value={name}
                    returnKeyType="done"
                    error={name.length > 0 && name.length < 3}
                    onChangeText={setName}
                />
                {name.length > 0 && name.length < 3 && (
                    <HelperText type="error">
                        Le pseudo doit faire au moins 3 lettres
                    </HelperText>
                )}
                {name.length >= 3 && (
                    <Button
                        style={[styles.button, {
                            alignContent: 'center',
                            marginTop: 20
                        }]}
                        labelStyle={styles.text}
                        onPress={change_pseudo}
                    >
                        Valider le nouveau pseudo
                    </Button>
                )}
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
                    await AsyncStorage.clear()
                    setDecoded(null)
                    setToken("")
                    navigation.navigate("login")
                }}
            >
                Deconnexion
            </Button>
        </View>
    )
}