import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet, Image, Text } from "react-native";
import { Button } from "react-native-paper";
import Storage from '@react-native-async-storage/async-storage';
import config from "../config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import jwtDecode from "jwt-decode";
import { TokenContext } from "../store/token";

export default function LoginView ({navigation}) {
    const [token, setToken] = useContext(TokenContext)
    
    let decodedToken = null
    if (token != "") {
        decodedToken = jwtDecode(token)
    }

    return (
        <View style={styles.container}>
            <Image 
                source={require("../assets/logo/logo.png")}
                style={{
                    width: 150,
                    height: 40,
                    marginBottom: 30
                }}
            />
            <View
                style={{
                    width: '90%',
                    marginBottom: 30
                }}
            >
                <Text
                    style={styles.text}
                >
                    Créez ou rejoingnez des sessions de blind test avec vos amis 👯 et tentez de devenir un Maestro
                </Text>
            </View>
            {decodedToken && decodedToken.spotify ? 
                <Button
                    mode="outlined"
                    style={styles.button}
                    labelStyle={styles.text}
                    icon="gamepad-variant"
                    onPress={() => navigation.navigate("create")}
                >
                    Créer un blindtest
                </Button>
            : <></>
            }
            <Button
                mode="outlined"
                style={styles.button}
                labelStyle={styles.text}
                icon="arrow-right-bold-circle"
                onPress={() => navigation.navigate("join")}
            >
                Rejoindre un blindtest
            </Button>
            <View 
                style={{
                    height: 200
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#091227",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    logo:{
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
