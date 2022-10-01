import * as AppleAuthentication from 'expo-apple-authentication';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
import config from '../../config';
import { TokenContext } from '../../store/token';

export default function AppleLogin ({ onSuccess }) {
    const [hasAppleLogin, setHasAppleLogin] = useState(false)
    const [appleData, setAppleData] = useState(null)
    const [token, setToken] = useContext(TokenContext)

    useEffect(() => {
        (async () => {
            let data = await AppleAuthentication.isAvailableAsync()
            setHasAppleLogin(data)
        })()
    }, [])

    useEffect(() => {
        if (!appleData) return
        fetch(config.API + "/login/apple", {
            method: "POST",
            body: JSON.stringify(appleData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(data => data.text())
        .then(async data => {
            setToken(data)
            onSuccess()
        }).catch(e => console.log(e))
    }, [appleData])

    if (hasAppleLogin) {
        return (
            <Button
                mode="outlined"
                style={styles.button}
                labelStyle={styles.text}
                icon="apple"
                onPress={async () => {
                    try {
                      const credential = await AppleAuthentication.signInAsync({
                        requestedScopes: [
                          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                          AppleAuthentication.AppleAuthenticationScope.EMAIL,
                        ],
                      });

                      setAppleData(credential)
                    } catch (e) {
                      if (e.code === 'ERR_CANCELED') {
                        // handle that the user canceled the sign-in flow
                      } else {
                        // handle other errors
                      }
                    }
                  }}
            
            >
                Se connecter avec Apple
            </Button>
        )
    }
    return <></>
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
        width: "100%"
    },
})