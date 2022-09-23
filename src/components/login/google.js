import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
import config from '../../config';
import { TokenContext } from '../../store/token';

export default function GoogleLogin ({ navigation }) {
    const [token, setToken] = useContext(TokenContext)

    const [req, res, googlePromptAsync] = Google.useAuthRequest({
        expoClientId: '827587780905-l23bpr5od94cp10hlabq5pko3r7o00ln.apps.googleusercontent.com',
        iosClientId: '827587780905-mr8lqrqq1h58vghbbdergr42dm4ecdni.apps.googleusercontent.com',
        androidClientId: '827587780905-o2np37bk075n8ppbjvrege5k2dslcnr8.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (!res) return
        if (res.type === "success") {
            fetch(config.API + "/login/google", {
                method: "POST",
                body: JSON.stringify(res.authentication),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(data => data.text())
            .then(async data => {
                console.log("data", data)
                setToken(data)
                navigation.reset({
                    index: 0,
                    routes: [{ 
                        name: 'home',
                    }]
                })
            }).catch(e => console.log(e))
        } else {
            console.log(res.error)
        }
    }, [res])

    return (
        <Button
            mode="outlined"
            style={styles.button}
            labelStyle={styles.text}
            icon="google"
            onPress={() => googlePromptAsync()}
        >
            Se connecter avec Google
        </Button>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "#FFFFFF",
        fontFamily: "Gilroy-SemiBold",
    },
    button: {
        borderRadius: 30,
        borderColor: "#FFFFFF",
        borderWidth: 2,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 7,
        paddingBottom: 7,
        minWidth:"87%"
    },
})