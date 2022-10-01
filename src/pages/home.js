import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet, Image, Text, FlatList, ScrollView, TouchableOpacity } from "react-native";
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

    const data = [
        {
            name: "Années 80",
            image: require("../assets/playlist/perso.png"),
            onPress: () => {
                navigation.navigate("create")
            }
        }, 
        {
            name: "Années 80",
            image: require("../assets/playlist/annee80.png")
        }, 
        {
            name: "Top 50",
            image: require("../assets/playlist/top.png")
        }, 
        {
            name: "Rock",
            image: require("../assets/playlist/rock.png")
        }, 
        {
            name: "Rap Français",
            image: require("../assets/playlist/rap.png")
        },
    ]

    return (
        <ScrollView 
            scrollEnabled={false}
            contentContainerStyle={[styles.container, {
                alignItems: "flex-start",
                justifyContent: "flex-start"
            }]}
            style={{
                backgroundColor: "#091227",
            }}
        >
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
                        marginBottom: 30
                    }}
                />
                <Text
                    style={[styles.text, {
                        textAlign: 'left',
                        fontFamily: "Gilroy-Bold",
                        marginTop: 30
                    }]}
                >
                    BLINDTEST CLASSIQUE
                </Text>
                <Text
                    style={[styles.text, {
                        textAlign: 'left',
                        fontFamily: "Gilroy-Medium",
                        marginTop: 20
                    }]}
                >
                    Lance un blindtest avec une des playlist de Maestro ou en utilisant tes playlists Spotify 
                </Text>
            </View>
            <View
                style={{
                    height: 125,
                    marginTop: 30,
                    marginBottom: 20,
                }}
            >
                <FlatList 
                    horizontal={true}
                    data={data}
                    renderItem={({item, index}) => {
                        return (
                            <TouchableOpacity
                                onPress={item.onPress}  
                            >
                                <Image 
                                    style={{ height: 125, width: 125, marginLeft: 20, marginRight: (index == data.length - 1) ? 20 : 0}} 
                                    source={item.image}
                                />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <View
                style={{
                    paddingLeft: 20,
                    paddingRight: 20,
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
            </View>
            {/* <View
                style={{
                    paddingRight: 20,
                    paddingLeft: 20,
                    width: '100%',
                }}
            >
                <Text
                    style={[styles.text, {
                        textAlign: 'left',
                        fontFamily: "Gilroy-Bold",
                        marginTop: 40
                    }]}
                >
                    BLINDTEST BATTLEROYAL
                </Text>
                <Text
                    style={[styles.text, {
                        textAlign: 'left',
                        fontFamily: "Gilroy-Medium",
                        marginTop: 10
                    }]}
                >
                    Une erreur et tu es éliminé, pas d'erreur et tu deviens le Maestro !
                </Text>
                <View
                    style={{
                        height: 75,
                        width: '100%',
                        overflow: 'hidden',
                        backgroundColor: "red",
                        marginTop: 20
                    }}
                >
                </View>
                <View
                    style={{
                        height: 75,
                        width: '100%',
                        overflow: 'hidden',
                        backgroundColor: "green",
                        marginTop: 20
                    }}
                >
                </View>
            </View>
            <View 
                style={{
                    height: 50,
                    width: '100%',
                }}
            /> */}
        </ScrollView>
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
