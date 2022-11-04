import { useContext, useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image } from "react-native"
import { Button, DataTable } from "react-native-paper"
import { SocketContext } from "../store/socket"
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const musicDir = FileSystem.cacheDirectory + 'music/';

export default Game = ({ navigation, route }) => {
    const socket = useContext(SocketContext)
    const [gameState, setGameState] = useState("waiting")
    const [round, setRound] = useState(-1)
    const [highlight, setHightlight] = useState(-1)
    const [gameRounds, setGameRounds] = useState(route.params.rounds)
    const [leader, setLeader] = useState([])
    const audio = useRef(null)
    const [page, setPage] = useState(0)

    const launch_new_round = async (data) => {
        setGameState("game")
        await audio.current.playAsync()
        setRound(data.round)
        setHightlight(-1)
    }

    useEffect(() => {
        socket.current.on("start timer", async (_data) => {
            let data = JSON.parse(_data)
            let { launch_date } = data
            try {
                console.log("loading the song")

                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                });

                let file = musicDir + gameRounds[data.round].id + ".mp3"
                // console.log(gameRounds[data.round].preview_url, data.round)
                let test = await Audio.Sound.createAsync({
                    uri: file
                }, {
                    shouldPlay: false,
                },).catch(e => console.log("CATCH", e))

                audio.current = test.sound
            } catch (e) {
                console.log(e)
            }

            launch_new_round(data)
        })

        socket.current.on("round result", async () => {
            setGameState("results")
        })

        socket.current.on("leaderboard", async (data) => {
            await audio.current.pauseAsync()
            await audio.current.unloadAsync()
            data = JSON.parse(data)
            setLeader(data)
            setGameState("leaderboard")
        })

        socket.current.on("final screen", () => {
            setGameState("final")
        })
    }, [])


    const render_game_status = () => {
        switch (gameState) {
            case "waiting":
                return "En attente du début"
            case "game":
                return "Quelle est la musique qui joue ?"
            case "leaderboard":
                return "Classement"
            case "results":
                return "Reponses"
            case "final":
                return "Merci d'avoir joué!"
            default:
                return "?"
        }
    }

    const render = () => {
        switch (gameState) {
            case "game":
                return render_round()
            case "leaderboard":
                return render_leaderboard()
            case "results":
                return render_results()
            case "final":
                return render_final()
            default:
                return render_waiting()
        }
    }

    const render_leaderboard = () => {
        return (
            <DataTable
                style={{
                    width: '100%',
                    flex: gameState == "final" ? null : 1,
                    backgroundColor: "white"
                }}
            >
                <DataTable.Header>
                    <DataTable.Title >Place</DataTable.Title>
                    <DataTable.Title style={{ flex: 3 }}>Pseudo</DataTable.Title>
                    <DataTable.Title numeric>Points</DataTable.Title>
                </DataTable.Header>
                {leader.sort((a, b) => b.score - a.score).map((user, i) => (
                    <DataTable.Row>
                        <DataTable.Cell>{i + 1}</DataTable.Cell>
                        <DataTable.Cell style={{ flex: 3 }}>{user.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{user.score}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        )
    }

    const render_music_text = (text) => {
        if (text.length > 40) {
            return text.slice(0, 40) + "..."
        } else {
            return text
        }
    }

    const render_final = () => {
        return <ScrollView
            contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 200
            }}
            style={styles.container}
        >
            <Text
                style={[styles.text, {
                    textAlign: 'left',
                    fontFamily: "Gilroy-Bold",
                    marginLeft: 40,
                    marginBottom: 20
                }]}
            >
                LE LEADERBOARD FINAL
            </Text>
            {render_leaderboard()}
            <Text
                style={[styles.text, {
                    textAlign: 'left',
                    fontFamily: "Gilroy-Bold",
                    marginLeft: 40,
                    marginTop: 20,
                    marginBottom: 20
                }]}
            >
                TOUTES LES MUSIQUES JOUEES
            </Text>
            <DataTable
                style={{
                    width: '100%',
                    backgroundColor: "white"
                }}
            >
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 3 }} numberOfLines={2}>Musique</DataTable.Title>
                    <DataTable.Title numeric>Passage</DataTable.Title>
                </DataTable.Header>
                {gameRounds.map((i, ii) => (
                    <DataTable.Row>
                        <DataTable.Cell style={{ flex: 3 }}>{i.choices[i.result_index]}</DataTable.Cell>
                        <DataTable.Cell numeric>{ii + 1}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </ScrollView>
    }

    // render les results du round
    const render_results = () => {
        let choices = gameRounds[round].choices
        let music_result = gameRounds[round].result_index

        const get_button_color = (index) => {
            if (index == highlight && index == music_result) {
                return "green"
            }
            if (index == highlight) {
                return "red"
            }
            if (index == music_result) {
                return "grey"
            }
            return null
        }

        return (
            <View
                style={{
                    width: '100%',
                    alignItems: "center",
                    paddingLeft: 20,
                    paddingRight: 20
                }}
            >
                {choices.map((m, i) => (
                    <Button
                        style={styles.button}
                        mode={get_button_color(i) ? "contained" : "outlined"}
                        color={get_button_color(i)}
                    >
                        <Text
                            style={styles.text}
                        >
                            {m}
                        </Text>
                    </Button>
                ))}
            </View>
        )
    }

    const render_round = () => {
        if (round < 0) return <></>
        let choices = gameRounds[round].choices
        if (choices) {
            return (
                <View
                    style={{
                        width: '100%',
                        alignItems: "center",
                        paddingLeft: 20,
                        paddingRight: 20
                    }}
                >
                    {choices.map((m, i) => (
                        <Button
                            style={styles.button}
                            mode={(highlight == i) ? "contained" : "outlined"}
                            onPress={highlight == -1 ? () => {
                                socket.current.emit('vote', JSON.stringify({
                                    vote: i,
                                    date: new Date().getTime()
                                }))
                                setHightlight(i)
                            } : () => { alert("vous ne pouvez voter qu'une fois!") }}
                        >
                            <Text
                                style={styles.text}
                            >
                                {m}
                            </Text>
                        </Button>
                    ))}
                </View>
            )
        } else {
            return <Text>loading</Text>
        }
    }

    const render_waiting = () => {
        return <></>
    }

    return (
        <View
            style={[styles.container, {
                alignItems: "flex-start",
                justifyContent: "flex-start"
            }]}
        >
            {gameState != "final" && (
                <Text
                    style={[styles.text, {
                        textAlign: 'left',
                        fontFamily: "Gilroy-Bold",
                        marginLeft: 20
                    }]}
                >
                    BLINDTEST CLASSIQUE
                </Text>
            )}
            {gameState == "final" && (
                <Image
                    source={require("../assets/logo/logo.png")}
                    style={{
                        width: 150,
                        height: 40,
                        marginBottom: 10,
                        marginLeft: 20,
                    }}
                />
            )}

            <Text
                style={{
                    ...styles.text,
                    textAlign: "left",
                    marginBottom: 40,
                    marginLeft: 20,
                }}
            >
                {render_game_status()}
            </Text>
            {render()}
            {gameState == "final" && (
                <View
                    style={{
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <Button
                        icon="door"
                        mode="contained"
                        color="red"
                        style={{
                            position: "absolute",
                            bottom: 30,
                            borderRadius: 30,
                            paddingLeft: 10,
                            paddingRight: 10,
                            padding: 5
                        }}
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{
                                    name: 'home',
                                }],
                            });
                        }}
                    >
                        Revenir au menu
                    </Button>
                </ View>
            )}
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
    },
    logo: {
        color: "#FFFFFF",
        fontFamily: "Gilroy-Black",
        paddingBottom: 50,
        fontSize: 30
    },
    text: {
        marginTop: 10,
        color: "#FFFFFF",
        fontFamily: "Gilroy-SemiBold",
        width: '100%'
    },
    button: {
        borderRadius: 30,
        marginTop: 15,
        margin: 10,
        borderColor: "#FFFFFF",
        borderWidth: 2,
        paddingLeft: 15,
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