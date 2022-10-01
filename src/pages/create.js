import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, FlatList } from "react-native"
import Playlist from "../components/playlist"
import config from "../config"
import jwtDecode from "jwt-decode";
import { TokenContext } from "../store/token"
import SpotifyLogin from "../components/login/spotify"

export default Create = ({navigation}) => {
    const [playlist, setPlaylist] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useContext(TokenContext)

    let decodedToken = null
    if (token != "") {
        decodedToken = jwtDecode(token)
    }

    useEffect(() => {
        (async () => {
            let data = await (await fetch(config.API + "/playlist", {
                headers: {
                    "authorization": "Bearer " + token
                }
            })
            .catch(e => console.log(e))
            ).json()
            setPlaylist(data)
            setLoading(false)
        })()
    }, [])

    return (
        <View
            style={styles.container}
        >
            <Text
                style={styles.text}
            >
                Choisis la playlist que tu veux utiliser pour le blindtest
            </Text>
            { !loading ?
                <ScrollView
                    style={{
                        marginTop: 20,
                        width: '100%',
                        paddingLeft: 20,
                        paddingRight: 20,
                    }}
                >
                    {
                        playlist.map((p, i) => {
                            return (
                                <View
                                    key={i}
                                    style={{
                                        marginTop: 20,
                                        borderRadius: 5,
                                        borderColor: "#FFFFFF",
                                        borderWidth: 1,
                                    }}
                                >
                                    <Playlist
                                        navigation={navigation}
                                        playlist_data={p}
                                        setLoading={setLoading}
                                        arrow
                                    />
                                </View>
                            )
                        })
                    }
                </ScrollView>
                :
                <View
                    style={{
                        width: '100%',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: "center"
                    }}
                >
                    <ActivityIndicator />
                </View>
            }
        </View>
    )   
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#091227",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    logo:{
        color: "#FFFFFF",
        fontFamily: "Gilroy-Black",
        paddingBottom: 50,
        fontSize: 30
    },
    text: {
        marginTop: 10,
        color: "#FFFFFF",
        fontFamily: "Gilroy-SemiBold",
        textAlign: "center"
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
    divider: {
        marginTop: 20,
        marginBottom: 20,
        width: "80%",
        height: 1,
        backgroundColor: "#EAF0FF"
    }
})