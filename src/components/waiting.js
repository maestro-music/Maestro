import { View } from "react-native"
import { ActivityIndicator } from "react-native"

export const WaitingView = () => {
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#091227",
                flex: 1
            }}
        >
            <ActivityIndicator />
        </View>
    )
}