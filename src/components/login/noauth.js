import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
import config from '../../config';
import { TokenContext } from '../../store/token';

export default function NoAuthLogin ({ onSuccess }) {
    const [token, setToken] = useContext(TokenContext)

    const login = () => {
        fetch(config.API + "/login/noauth", {
            method: "POST"
        }).then(data => data.text())
        .then(data => {
            setToken(data)
            onSuccess()
        }).catch(e => console.log("error", e))
    }

    return (
        <Button
            mode="outlined"
            style={styles.button}
            labelStyle={styles.text}
            icon="pirate"
            onPress={() => login()}
        >
            Continuer sans compte
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