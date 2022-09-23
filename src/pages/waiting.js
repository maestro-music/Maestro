import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, FlatList, SafeAreaView } from "react-native"
import Playlist from "../components/playlist"
import config from "../config"
import { io } from "socket.io-client"
import QRCode from "react-native-qrcode-svg"
import { Button } from "react-native-paper"
import WaitingPlayer from "../components/waiting_player"
import * as FileSystem from 'expo-file-system';
import { SocketContext } from "../store/socket"
import { TokenContext } from "../store/token"

export default Create = ({navigation, route}) => {
    const socket = useContext(SocketContext)
    const [canLaunch, setCanLaunch] = useState(true)
    const [players, setPlayers] = useState([])
    const [downloadFinished, setDownloadFinished] = useState(false)
    const [ready, setReady] = useState(false)
    const [token, setToken] = useContext(TokenContext)

    let { params } = route 
    const is_admin = params.is_admin || false
    const game_id = params.game_id
    const name = params.name || ""
    let game_id_pretty = params.game_id.toString().split("").join(" ")

    const musicDir = FileSystem.cacheDirectory + 'music/';

    async function ensureDirExists() {
        const dirInfo = await FileSystem.getInfoAsync(musicDir);
        if (!dirInfo.exists) {
          console.log("Music directory doesn't exist, creating...");
          await FileSystem.makeDirectoryAsync(musicDir, { intermediates: true });
        }
    }      

    useEffect(() => {
        socket.current = io(config.API, {
            query: {
                game_id: game_id,
                is_admin,
                name: name
            },
            auth: {
                token: token
            }
        });

        console.log("SOCKET SET")

        socket.current.on("load data", async (data) => {
            data = JSON.parse(data)

            await ensureDirExists()

            await Promise.all(data.map(async i => {
                await FileSystem.downloadAsync(i.preview_url, musicDir + i.id + ".mp3")
            }))

            setDownloadFinished(true)

            if (is_admin) {
                socket.current.emit("ready")
            }
        })

        socket.current.on("player update", (data) => {
            data = JSON.parse(data)
            setPlayers(data)
        })

        socket.current.on("go to game page", (data) => {
            data = JSON.parse(data)
            navigation.reset({
                index: 0,
                routes: [{ 
                    name: 'game',
                    params: {
                        game_id: game_id,
                        rounds: data.rounds
                    }
                }],
            });
        })
    }, [])


    return (
        <View
            style={styles.container}
        >
            <Text
                style={styles.text}
            >
                Utilisez le QRCode ou le code pour inviter vos amis   
            </Text>
            {/* <View
                style={{
                    padding: 5,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 5,
                    marginTop: 20
                }}
            >
                <QRCode 
                    size={200}
                    value="fjefjefjeifjeijfeijfeifjeijfie"
                />
            </View> */}
            <Text
                style={{
                    padding: 10,
                    paddingRight: 15,
                    paddingLeft: 15,
                    color: "#FFFFFF",
                    fontFamily: "Gilroy-SemiBold",
                    textAlign: "center",
                    marginTop: 15,
                    fontSize: 16,
                    borderColor: "#FFFFFF",
                    borderRadius: 10,
                    borderWidth: 2
                }}
            >{game_id_pretty}</Text>


            <View 
                style={{
                    height: 1,
                    marginTop: 20,
                    backgroundColor: "#FFFFFF",
                    width: '90%'
                }}
            />
            <Text
                style={{
                    fontFamily: "Gilroy-SemiBold",
                    color: "#FFFFFF",
                    marginTop: 20,
                    marginBottom: 10,
                    fontSize: 15
                }}
            >
                Personnes présentes dans la session
            </Text>
            <FlatList
                style={{
                    marginTop: 10,
                    width: '90%'
                }}
                contentContainerStyle={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                }}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                keyExtractor={(_, i) => i}
                renderItem={(i, ii) => (
                    <View
                        key={ii}
                        style={{
                            margin: 10
                        }}
                    >
                        <WaitingPlayer {...i.item}/>
                    </View>
                )
                }
                data={players}
                extraData={(e) => console.log(e)}
            />
            {is_admin ?
                <Button
                    icon="rocket"
                    mode="contained"
                    color="#24ad34"
                    style={{
                        position: "absolute",
                        bottom: 30,
                        borderRadius: 30,
                        paddingLeft: 10,
                        paddingRight: 10,
                        padding: 5
                    }}
                    onPress={() => socket.current.emit("launch game")}
                >
                    Lancer le blindtest
                </Button>
            :
            <Button
                icon="rocket"
                mode="contained"
                color={ready ? "#d13843" : "#24ad34"}
                style={{
                    position: "absolute",
                    bottom: 30,
                    borderRadius: 30,
                    paddingLeft: 10,
                    paddingRight: 10,
                    padding: 5
                }}
                onPress={() => {
                    setReady(!ready)
                    socket.current.emit("ready")
                }}
            >
                {ready ? "pas prêt ! " : "prêt !"} 
            </Button>
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
        textAlign: "center",
        width: '80%'
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