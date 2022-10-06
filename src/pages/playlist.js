import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native"
import Music from "../components/music"
import Playlist from "../components/playlist"
import config from "../config"
import { TokenContext } from "../store/token"

export default Create = ({route}) => {
    const [token] = useContext(TokenContext)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(route.params.playlist_data)
    let is_logged = route.params.is_logged 
    let game_id = route.params.game_id

    useEffect(() => {
        if (is_logged == false) {
            fetch(config.API + "/game/" + game_id + "/playlist", {
                method: "GET",
                headers: {
                    "authorization": "Bearer " + token
                }
            }).then(data => data.json())
            .then(data => {
                setData(data.playlist_data)
                setLoading(false)
            })
            .catch(e => console.log(e))
        } else {
            fetch(config.API + "/playlist/" + data.id, {
                method: "GET",
                headers: {
                    "authorization": "Bearer " + token
                }
            }).then(data => data.json())
            .then(data => {
                console.log(data)
                setData(data)
                setLoading(false)
            })
            .catch(e => console.log(e))
        }
    }, [])

    if (loading) {
        return <View style={styles.container} >
            <ActivityIndicator />
        </View>
    }

    return (
        <View
            style={styles.container}
        >
            <Text
                style={styles.text}
            >
                Playlist : {data.name || route.params.playlist_data.name}
            </Text>
                <ScrollView
                    style={{
                        marginTop: 20,
                        width: '100%',
                        paddingLeft: 10,
                        paddingRight: 10,
                    }}
                >
                    {
                        data.items.slice(0, 20).map((p, i) => {
                            return (
                                <View
                                    key={i}
                                    style={{
                                        marginTop: 15,
                                        borderRadius: 5,
                                        borderColor: "#FFFFFF",
                                        borderWidth: 1,
                                    }}
                                >
                                    <Music 
                                        music={p}
                                    />
                                </View>
                            )
                        })
                    }
                    <View style={{height: 30}}/>
                </ScrollView>
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