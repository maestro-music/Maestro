import { useContext, useEffect, useState } from "react"
import { View, Text, Image } from "react-native"
import { Button, TextInput } from "react-native-paper"
import AppleLogin from "../components/login/apple"
import GoogleLogin from "../components/login/google"
import SpotifyLogin from "../components/login/spotify"
import styles from "../components/style/default"
import { TokenContext } from "../store/token"
import config from "../config"
import NoAuthLogin from "../components/login/noauth"

export const FirstTimePage = ({navigation, route}) => {
    const [token, setToken, decoded] = useContext(TokenContext)
    const [page, setPage] = useState("first")
    const [provider, setProvider] = useState("")
    const [name, setName] = useState("")

    useEffect(() => {
        console.log("token changed", decoded)
        if (decoded && decoded.name != "") {
            setPage("first")
            console.log("DECODED NAME", decoded.name)
            navigation.navigate("home")
        }
    }, [token, decoded])

    const change_pseudo = () => {
        fetch(config.API + "/profil/name", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name: name
            })
        }).then(t => t.text())
        .then(data => {
            setPage("first")
            setToken(data)
            navigation.navigate("home")
        })
        .catch(e => console.log(e))
    }

    const firstOnSuccess = (platform) => {
        if (platform == "spotify") {
            setProvider("spotify")
            setPage("third")
        } else {
            setProvider("other")
            setPage("second")
        }
    }

    const first = () => {
        return (
            <View style={[styles.container, {
                paddingTop: 40,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: "flex-start",
                justifyContent: "flex-start"
            }]}>
                <Image 
                    source={require("../assets/logo/logo.png")}
                    style={{
                        width: 150,
                        height: 40,
                        marginBottom: 30
                    }}
                />
                <Text style={[styles.text, {
                    fontSize: 20,
                    marginTop: 50,
                }]}>
                     Bienvenue sur Maestro ! 🎉
                </Text>
                <Text style={[styles.text, {
                    marginTop: 25
                }]}>
                    Connecte toi avec Spotify si tu veux utiliser tes playlist pour créer des blindtest, si tu veux juste jouer connecte toi en pirate
                </Text>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        marginTop: 50
                    }}
                >
                    {/* <View
                        style={{width: '100%'}}
                    >
                        <GoogleLogin onSuccess={() => {
                            firstOnSuccess("google")
                        }}/>
                    </View> */}
                    <View
                        style={{marginTop: 20, width: '100%'}}
                    >
                        <SpotifyLogin 
                            onSuccess={() => {
                                firstOnSuccess("spotify")
                            }}
                        />
                    </View>
                    <View
                        style={{marginTop: 20, width: '100%'}}
                    >
                        <NoAuthLogin 
                            onSuccess={() => {
                                firstOnSuccess("noauth")
                            }}
                        />
                    </View>
                    {/* <View
                        style={{marginTop: 20, width: '100%'}}
                    >
                        <AppleLogin onSuccess={() => {
                            firstOnSuccess("apple")
                        }} />
                    </View> */}
                </View>
            </View>
        )
    }

    const second = () => {
        return (
            <View style={[styles.container, {
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: "flex-start",
                justifyContent: "flex-start"
            }]}>
                <View
                    onTouchStart={() => setPage("first")} 
                >
                    <Image 
                        style={[styles.arrow, {
                            position: "absolute",
                            top: 0,
                            width: 30,
                            height: 30
                        }]}
                        source={ require("../assets/icon/arrow.png") }
                    />
                </View>
                <Image 
                    source={require("../assets/logo/logo.png")}
                    style={{
                        marginTop: 50,
                        width: 150,
                        height: 40,
                        marginBottom: 30
                    }}
                />
                <Text style={[styles.text, {
                    fontSize: 20,
                    marginTop: 50,
                }]}>
                    Profite pleinement de l'expérience !
                </Text>
                <Text style={[styles.text, {
                    marginTop: 30
                }]}>
                    Pour apprécier pleinement Maestro, connecte ton compte Spotify pour pouvoir jouer avec tes musiques préférées
                </Text>
                <View
                    style={{marginTop: 60, width: '100%'}}
                >
                    <SpotifyLogin isLogged onSuccess={() => {
                        setPage("third")
                    }}/>
                    <Button
                        style={[{
                            alignContent: 'center',
                            marginTop: 20
                        }]}
                        labelStyle={[styles.text, {
                            color: "#535f7a"
                        }]}
                        onPress={() => {
                            setPage("third")
                        }}
                    >
                        Ne pas lier maintenant
                    </Button>
                </View>
            </View>
        )
    }

    const third = () => {
        return (
            <View style={[styles.container, {
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: "flex-start",
                justifyContent: "flex-start"
            }]}>
                <View
                    onTouchStart={() => provider == "spotify" ? setPage("first") : setPage("second")} 
                >
                    <Image 
                        style={[styles.arrow, {
                            position: "absolute",
                            top: 0,
                            width: 30,
                            height: 30
                        }]}
                        source={ require("../assets/icon/arrow.png") }
                    />
                </View>
                <Image 
                    source={require("../assets/logo/logo.png")}
                    style={{
                        marginTop: 50,
                        width: 150,
                        height: 40,
                        marginBottom: 30
                    }}
                />
                <Text style={[styles.text, {
                    fontSize: 20,
                    marginTop: 50,
                }]}>
                    Un petit nom sympa ?
                </Text>
                <Text style={[styles.text, {
                    marginTop: 30
                }]}>
                    On est sur que tes amis t'ont donné un petit surnom sympa ou que tu as déjà un pseudo pour internet! 
                </Text>
                <View
                    style={{marginTop: 60, width: '100%'}}
                >
                    <TextInput 
                        label="Ton meilleur pseudo"
                        returnKeyType="done"
                        value={name}
                        onChangeText={setName}
                    />
                    <Button
                        style={[styles.button, {
                            alignContent: 'center',
                            marginTop: 40
                        }]}
                        labelStyle={styles.text}
                        onPress={() => {change_pseudo()}}
                    >
                        Valider
                    </Button>
                </View>
            </View>
        )
    }

    const render = () => {
        switch (page) {
            case "first":
                return first()
            case "second":
                return second()
            case "third":
                return third()
            default:
                return first()
        }
    }

    return render()
}