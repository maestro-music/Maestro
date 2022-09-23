import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native"
import Music from "../components/music"
import Playlist from "../components/playlist"
import config from "../config"

export default Create = ({route}) => {
    let playlist_data = route.params.playlist_data

    return (
        <View
            style={styles.container}
        >
            <Text
                style={styles.text}
            >
                Playlist : {playlist_data.name}
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
                        playlist_data.items.slice(0, 20).map(p => {
                            return (
                                <View
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