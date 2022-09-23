import React, { createContext, useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TokenContext = createContext()

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState("")

    useEffect(() => {
        AsyncStorage.getItem("token").then(data => {
            if (data != "") {
                setToken(data)
            }
        })
    }, [])

    useEffect(() => {
        if (token) {
            AsyncStorage.setItem("token", token)
        }
    }, [token])

    return (
        <TokenContext.Provider value={[token, setToken]}>
            {children}
        </TokenContext.Provider>
    )
}