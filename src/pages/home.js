import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet, Image, Text, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import config from "../config";
import { TokenContext } from "../store/token";
import { WaitingView } from "../components/waiting"
import { SocketContext } from "../store/socket";

export default function LoginView({ navigation, route }) {
    const [token, setToken, decodedToken] = useContext(TokenContext)
    const socket = useContext(SocketContext)
    const [data, setData] = useState([])

    const [categories, setCategories] = useState([])
    const [individual, setIndividual] = useState([])

    let spotify = {
        name: "spotify",
        image: require("../assets/playlist/perso.png"),
        local: true,
        onPress: () => {
            navigation.navigate("create")
        }
    }

    const generate_special_game = async (playlist_id) => {
        let req_data = await fetch(config.API + "/game", {
            method: "POST",
            headers: {
                'authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playlist_id: playlist_id,
                special: true
            })
        })
        let data = await req_data.json()
        if (data.error) {
            alert("choose an other playlist pls")
        } else {
            navigation.navigate("waiting", { game_id: data.game_id, is_admin: true })
        }
    }

    useEffect(() => {
        if (socket.current && (route.params && !route.params.socket_shoud_not_quit)) {
            console.log(route.params)
            socket.current.disconnect()
            console.log("socket disconnected")
        }
        (async () => {
            let rdata = await fetch(config.API + "/maestro_playlist", {
                method: "GET",
                headers: {
                    "authorization": "Bearer " + token
                }
            })
            let datam = await rdata.json()

            let cat = datam.categories
            cat = cat.map(c => ({
                ...c,
                data: c.data.map(d => ({
                    ...d,
                    onPress: () => generate_special_game(d.id)
                }))
            }))

            let ind = datam.individual

            ind = ind.map(i => ({
                ...i,
                onPress: () => generate_special_game(i.id)
            }))

            setCategories(cat)
            setIndividual(ind)
        })()
    }, [])

    const render_playlist = (item, index, len) => {
        return (
            <TouchableOpacity
                onPress={item.onPress}
            >
                <Image
                    style={{ height: 125, width: 125, marginLeft: 20 }}
                    source={
                        item.local ?
                            item.image :
                            { uri: item.image }
                    }
                />
            </TouchableOpacity>
        );
    }

    const render_category = (item, index) => {
        return <View
            style={{
                marginBottom: 20
            }}
        >
            <Text
                style={[styles.text, {
                    textAlign: 'left',
                    fontFamily: "Gilroy-Bold",
                    marginTop: 20,
                    marginLeft: 20,
                    marginBottom: 10
                }]}
            >
                {item.category.toUpperCase()}
            </Text>
            <Text
                style={[styles.text, {
                    textAlign: 'left',
                    fontFamily: "Gilroy-Medium",
                    marginBottom: 20,
                    marginLeft: 20,
                    marginRight: 20
                }]}
            >
                {item.description}
            </Text>
            <FlatList
                horizontal
                data={item.data}
                renderItem={({ item, index }) => {
                    return render_playlist(item, index)
                }}
            />
        </View>
    }

    if (categories.length == 0 || individual.length == 0) {
        return <WaitingView />
    }

    return (
        <FlatList
            style={{
                backgroundColor: "#091227",
            }}
            data={categories}
            ListHeaderComponent={
                <View
                    style={{
                        paddingRight: 20,
                        paddingLeft: 20
                    }}
                >
                    <Image
                        source={require("../assets/logo/logo.png")}
                        style={{
                            marginTop: 50,
                            width: 150,
                            height: 40,
                            marginBottom: 20
                        }}
                    />
                    <Text
                        style={[styles.text, {
                            textAlign: 'left',
                            fontFamily: "Gilroy-Medium",
                            marginTop: 20,
                            marginBottom: 20
                        }]}
                    >
                        Faites des blindtest seul, en famille, avec des amis, dans la même pièce ou de l'autre bout du monde avec Maestro!
                    </Text>
                    <View
                        style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            marginBottom: 20,
                            width: '100%'
                        }}
                    >
                        <Button
                            mode="outlined"
                            style={styles.button}
                            labelStyle={styles.text}
                            icon="arrow-right-bold-circle"
                            onPress={() => navigation.navigate("join")}
                        >
                            Rejoindre un blindtest
                        </Button>
                        {decodedToken && decodedToken.spotify ?
                            <Button
                                mode="outlined"
                                style={[styles.button, {
                                    marginTop: 15
                                }]}
                                labelStyle={styles.text}
                                icon="spotify"
                                onPress={() => navigation.navigate("create")}
                            >
                                Jouer avec tes playlists
                            </Button>
                            :
                            <Button
                                style={[{
                                    alignContent: 'center',
                                    marginTop: 15
                                }]}
                                labelStyle={[styles.text, {
                                    color: "#535f7a"
                                }]}
                                icon="spotify"
                                onPress={() => alert("Connecte toi à Spotify dans les paramètres pour faire tes propres blindtest")}
                            >
                                Jouer avec tes playlists
                            </Button>}
                    </View>
                </View>
            }
            ListFooterComponent={
                <View
                    style={{
                        marginBottom: 50
                    }}
                >
                    <Text
                        style={[styles.text, {
                            textAlign: 'left',
                            fontFamily: "Gilroy-Bold",
                            marginTop: 20,
                            marginLeft: 20,
                            marginBottom: 10
                        }]}
                    >
                        Uncategorized playlist
                    </Text>
                    <Text
                        style={[styles.text, {
                            textAlign: 'left',
                            fontFamily: "Gilroy-Medium",
                            marginBottom: 20,
                            marginLeft: 20,
                            marginRight: 20
                        }]}
                    >
                        Une selection de playlists fun et unique, elles sont toutes différentes et englobe tous les styles musicaux
                    </Text>
                    <FlatList
                        data={individual}
                        columnWrapperStyle={{
                            marginBottom: 20,
                            justifyContent: "center",
                        }}
                        renderItem={({ item, index }) => {
                            const get_offset = (index) => {
                                if (individual.length % 2 == 1 && index == individual.length - 1) return {}
                                if (index % 2 == 1) {
                                    return {
                                        marginLeft: 10
                                    }
                                } else {
                                    return {
                                        marginRight: 10
                                    }
                                }
                            }
                            return (
                                <TouchableOpacity
                                    onPress={item.onPress}
                                >
                                    <Image
                                        style={{ height: 125, width: 125, ...get_offset(index) }}
                                        source={
                                            item.local ?
                                                item.image :
                                                { uri: item.image }
                                        }
                                    />
                                </TouchableOpacity>
                            )
                        }}
                        numColumns={2}
                    />
                </View>
            }
            numColumns={1}
            renderItem={({ item, index }) => {
                return render_category(item)
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#091227",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    logo: {
        color: "#FFFFFF",
        fontFamily: "Gilroy-Black",
        paddingBottom: 50,
        fontSize: 30
    },
    text: {
        color: "#FFFFFF",
        fontFamily: "Gilroy-SemiBold",
        textAlign: "center",
    },
    button: {
        borderRadius: 30,
        borderColor: "#FFFFFF",
        borderWidth: 2,
        paddingLeft: 15,
        marginTop: 10,
        paddingRight: 15,
        paddingTop: 7,
        paddingBottom: 7,
        width: '100%'
    },
    divider: {
        marginTop: 20,
        marginBottom: 20,
        width: "80%",
        height: 1,
        backgroundColor: "#EAF0FF"
    }
})
