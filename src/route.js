import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image } from "react-native"
import React from "react"

import { SocketProvider } from "./store/socket"
import { TokenProvider } from "./store/token"

import Login from "./pages/login"
import Home from "./pages/home"
import Create from "./pages/create"
import Playlist from './pages/playlist';
import Waiting from './pages/waiting';
import Game from './pages/game';
import Join from './pages/join';
import { IconButton } from 'react-native-paper';
import Settings from './pages/settings';

const Stack = createNativeStackNavigator()

export default App = () => {
    return (
        <NavigationContainer>
            <SocketProvider>
            <TokenProvider>
            <StatusBar barStyle="light-content" />
            <Stack.Navigator
                screenOptions={({navigation, route}) => ({
                    headerLeft: () => {
                        if (route.name != "game") {
                            return (
                                <View
                                    onTouchStart={() => navigation.goBack()}
                                >
                                    {["home", "login"].includes(route.name) ?  <React.Fragment /> : 
                                        <Image 
                                            style={styles.arrow}
                                            source={ require("./assets/icon/arrow.png") }
                                        />
                                    }
                                </View>
                            )
                        }
                    },
                    headerRight: () => {
                        if (route.name == "home") {
                            return (
                                <View
                                    onTouchStart={() => navigation.navigate("settings")}
                                >
                                    <IconButton icon="cog" color='white'/>
                                </View>
                            )
                        }
                    },
                    title: "",
                    headerStyle: {
                        backgroundColor: "#091227"
                    }
                })}
            >
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="home" component={Home} />
                <Stack.Screen name="create" component={Create} />
                <Stack.Screen name="playlist" component={Playlist} />
                <Stack.Screen name="waiting" component={Waiting} />
                <Stack.Screen name="game" component={Game} />
                <Stack.Screen name="join" component={Join} />
                <Stack.Screen name="settings" component={Settings} />
            </Stack.Navigator>
            </TokenProvider>
            </SocketProvider>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    container: {
        flex: 1,
        flexDirection: "row",
        alignContent: "space-between",
        justifyContent: "space-between",
    },
    arrow: {
        width: 25,
        height: 25
    },
    profil:{
        width: 30,
        height: 30,
        borderRadius:40,
        borderWidth: 1,
        borderColor:"white"
    }
})