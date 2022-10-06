import React, { createContext, useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from "jwt-decode";

export const TokenContext = createContext()

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [decoded, setDecoded] = useState(null)

    useEffect(() => {
        AsyncStorage.getItem("token").then(data => {
            if (data != "") {
                setToken(data)
            }
        })
    }, [])

    useEffect(() => {
        if (token) {
            try {
                setDecoded(jwtDecode(token))
                AsyncStorage.setItem("token", token)
            } catch (e) {
                console.log(e, token)
            }
        } else {
            console.log("no token yet")
        }
    }, [token])

    return (
        <TokenContext.Provider value={[token, setToken, decoded, setDecoded]}>
            {children}
        </TokenContext.Provider>
    )
}