import { Image, View, Text } from "react-native"

export default WaitingPlayer = ({name, is_ready}) => {
    return (
        <View
            style={{
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    marginTop: 10,
                    color: "#FFFFFF",
                    fontFamily: "Gilroy-SemiBold",
                }}
            >
                {name[0].toUpperCase() + name.slice(1, 40)} { is_ready ? "✅" : "🛑"}
            </Text>
        </View>
    )
}