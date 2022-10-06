import * as WebBrowser from 'expo-web-browser';
import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { TokenContext } from '../../store/token';

const SPOTIFY_ENDPOINTS = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
}

WebBrowser.maybeCompleteAuthSession();

export default function SpotifyLogin ({ onSuccess, isLogged, title }) {
    const [token, setToken] = useContext(TokenContext)
    let redirectUri = makeRedirectUri({
        scheme: 'maestro.app'
    })

    // console.log("redirect", redirectUri)

    const [req, res, spotifyPromptAsync] = useAuthRequest(
        {
            clientId: "905cb3ef3f6d48ec832db7eac2b4c13b",
            scopes: [
                'user-read-email', 
                'playlist-modify-public', 
                "user-read-playback-state",
                "user-modify-playback-state",
                "user-read-currently-playing",
                "user-read-private",
                "user-follow-modify",
                "user-follow-read",
                "user-library-modify",
                "user-library-read",
                "streaming",
                "app-remote-control",
                "user-read-playback-position",
                "user-top-read",
                "user-read-recently-played",
                "playlist-modify-private",
                "playlist-read-collaborative",
                "playlist-read-private",
                "playlist-modify-public",
            ],
            usePKCE: false,
            redirectUri: redirectUri
        },
        SPOTIFY_ENDPOINTS
    )

    useEffect(() => {
        if (res?.type === 'success') {
            const { code } = res.params;
            if (isLogged) {
                fetch(config.API + "/account/spotify", {
                    method: "POST",
                    body: JSON.stringify({
                        code,
                        redirect_uri: redirectUri
                    }),
                    headers: {
                        'Content-Type': "application/json",
                        "authorization": "Bearer " + token
                    }    
                })
                .then(data => data.text())
                .then(async token => {
                    setToken(token)
                    if (onSuccess) {
                        onSuccess()
                    }
                }).catch(e => console.log("error", e))
            } else {
                fetch(config.API + "/login/spotify", {
                    method: "POST",
                    body: JSON.stringify({
                        code,
                        redirect_uri: redirectUri
                    }),
                    headers: {
                        'Content-Type': "application/json"
                    }
                })
                .then(data => data.text())
                .then(async data => {
                    setToken(data)
                    if (onSuccess) {
                        onSuccess()
                    }
                }).catch(e => console.log(e))
            }
        }
    }, [res]);

    return (
        <Button
            mode="outlined"
            style={styles.button}
            labelStyle={styles.text}
            disabled={!req}
            icon="spotify"
            onPress={() => spotifyPromptAsync().catch(e => console.log(e))}
        >
            {title || "Se connecter avec Spotify"}
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