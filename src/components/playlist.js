import { Button, IconButton, List } from "react-native-paper"
import { Image, View, Text, Pressable } from "react-native"
import config from "../config"
import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { useContext } from "react"
import { TokenContext } from "../store/token"

export default Playlist = ({ navigation, playlist_data, setLoading, arrow }) => {
    const [token, setToken] = useContext(TokenContext)

    const generate_new_game = async (playlist_id) => {
        setLoading(true)
        let req_data = await fetch(config.API + "/game", {
            method: "POST",
            headers: {
                'authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playlist_id: playlist_id
            })
        })
        let data = await req_data.json()
        if (data.error) {
            alert("choose an other playlist pls")
        } else {
            navigation.navigate("waiting", { game_id: data.game_id, playlist_data: playlist_data, playlist_id: playlist_data.id, is_admin: true })
        }
    }

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#FFFFFF",
                alignItems: "center",
            }}
        >
            <Pressable
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                }}
                onPress={() => navigation.navigate("playlist", { playlist_data })}
            >
                <Image
                    source={{
                        uri: playlist_data.images[0].url,
                        width: 75,
                        height: 75,
                    }}
                    style={{
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5
                    }}
                />
                <Text
                    style={{
                        color: "#091227",
                        fontFamily: "Gilroy-SemiBold",
                        marginLeft: 10,
                    }}
                >
                    {playlist_data.name.slice(0, 25)}{playlist_data.name.length > 25 ? "..." : ""}
                </Text>
            </Pressable>
            { arrow && (
                <IconButton
                    style={{
                        width: 50,
                        height: 60,
                    }}
                    color="#091227"
                    icon="arrow-right"
                    onPress={() => generate_new_game(playlist_data.id)}
                />
            )}
        </View>
    )
}

