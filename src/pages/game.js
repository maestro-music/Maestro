import { useContext, useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native" 
import { Button } from "react-native-paper"
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
                }, ).catch(e => console.log("CATCH", e))
    
                audio.current = test.sound
            } catch (e) {
                console.log(e)
            }
    
            setTimeout(() => {
                launch_new_round(data)
            }, new Date(launch_date) - new Date())
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
                return "Leaderboard"
            case "results":
                return "Resultats"
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
            <ScrollView
                style={{
                    width: '100%'
                }}
            >
                {leader.sort((a,b) => b.score - a.score).map((user, i) => (
                    <View
                        key={i}
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            paddingLeft: 20,
                            paddingRight: 20,
                            justifyContent:'space-between'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <Text
                                style={{
                                    color: "white"
                                }}
                            >{i+1}</Text>
                            <Text
                                style={{
                                    color: "white",
                                    marginLeft: 20
                                }}
                            >
                                {user.name}
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: "white"
                            }}
                        >
                            {user.score}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        )
    }

    const render_music_text = (text) => {
        if (text.length > 30) {
            return text.slice(0, 30) + "..."
        } else {
            return text
        }
    }

    const render_final = () => {
        return <View
            style={styles.container}
        >
            <Text
                style={{
                    color: "white",
                    marginTop: 20,
                    marginBottom: 20,
                }}
            >
                Les musiques de la partie
            </Text>
            {gameRounds.map((i, ii) => (
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingLeft: 20,
                        paddingRight: 20,
                        justifyContent:'space-between'
                    }}
                >
                    <Text
                        style={{
                            color: "white"
                        }}
                    >{ii + 1}</Text>
                    <Text
                        style={{
                            color: "white"
                        }}
                    >{render_music_text(i.choices[i.result_index])}</Text>
                </View>
            ))}
            <Text
                style={{
                    color: "white",
                    marginTop: 20,
                    marginBottom: 20
                }}
            >Leaderboard final</Text>
            {render_leaderboard()}
            <Button
                icon="rocket"
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
        </View>
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
            <View>
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
                <View>
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
                            } : () => { alert("vous ne pouvez voter qu'une fois!")}}
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
            style={styles.container}
        >
            <Text
                style={{
                    ...styles.text,
                    marginBottom: 20
                }}
            >
                {render_game_status()}
            </Text>
            {render()}
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
        marginTop: 15,
        margin: 10,
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