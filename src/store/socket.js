import React, { createContext, useRef } from "react"

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
    const socket = useRef(null)

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}