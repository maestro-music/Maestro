import { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native"
import { Button, TextInput } from "react-native-paper";
import KeycodeInput from "../components/test";
import config from "../config";
import { TokenContext } from "../store/token";

export default Join = ({navigation}) => {
    const [token] = useContext(TokenContext)
    const [value, setValue] = useState('');
    const [name, setName] = useState('')
    const [ready, setReady] = useState(false)

    const join_room = async () => {
        await fetch(config.API + "/game/" + value, {
            method: "GET",
            headers: {
                "authorization": "Bearer " + token
            }
        }).then(d => d.json())
        .then(data => {
            console.log(data)
            if (data.exists) {
                navigation.navigate("waiting", {
                    game_id: value,
                    name: name
                })
            } else {
                alert("cette room n'existe pas")
            }
        })
    }

    useEffect(() => {
        if (value.length == 6) {
            setReady(true)
        }
    }, [value])

    return (
        <View
            style={[styles.container, {
                textAlign: "left",
                paddingLeft: 20,
                paddingRight: 20
            }]}
        >
                <Text
                    style={[styles.text, {
                        textAlign: 'left',
                        fontFamily: "Gilroy-Bold",
                        marginTop: 30
                    }]}
                >
                    REJOINDRE UN BLINDTEST 
                </Text>
                <Text
                    style={[styles.text, {
                        textAlign: 'left',
                        fontFamily: "Gilroy-Medium",
                        marginTop: 20
                    }]}
                >
                    Renseigne le code de la room pour t'y connecter, n'importe qui dans la room peut te le donner
                </Text>
            <View
                style={{
                    marginTop: 80,
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <TextInput 
                    label="Code de la room"
                    keyboardType="numeric"
                    mode="outlined"
                    style={{
                        width: "90%",
                        marginTop: 40
                    }}
                    onChangeText={setValue}
                    value={value}    
                    maxLength={6}
                    returnKeyType="done"
                />
            </View>
            <Button
                icon="arrow-right-bold-circle"
                mode="contained"
                color={ready ? "#24ad34" : "grey"}
                style={{
                    marginTop: 30,
                    borderRadius: 30,
                    paddingLeft: 10,
                    paddingRight: 10,
                    padding: 5
                }}
                onPress={ready ? () => join_room() : null}
            >
                Entrer
            </Button>
        </View>
    )
}

const styles2 = StyleSheet.create({
    root: {flex: 1, padding: 20},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
    },
    focusCell: {
      borderColor: '#000',
    },
  });
  

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
        width: '100%'
    },
    button: {
        borderRadius: 30,
        marginTop: 20,
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