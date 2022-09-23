import { Button, IconButton, List } from "react-native-paper"
import { Image, View, Text } from "react-native"

export default Playlist = ({ navigation, music, onPress }) => {
    let name = music.track.album.name
    let image = music.track.album.images[0].url
    // console.log(music.track.album.name)
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
            }}
        >
            <Image 
                source={{
                    uri: image,
                    width: 60,
                    height: 60,
                }}
                style={{
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    marginRight: 10,
                }}
            />
            <Text
                style={{
                    color: "#091227",
                    fontFamily: "Gilroy-SemiBold",
                }}
            >
                {name.slice(0, 35)}{name.length > 35 ? "..." : ""} 
            </Text>
        </View>
    )
}

