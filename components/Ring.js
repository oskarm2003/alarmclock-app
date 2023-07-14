import { View, Text, StyleSheet, Vibration, TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#dd6666'
    },
    text: {
        fontSize: 50,
        fontFamily: 'secular',
        color: 'white',
        textAlign: 'center'
    },
    stop_button: {
        backgroundColor: '#000000',
        fontSize: 40,
        color: "white",
        padding: 10,
        borderRadius: 15,
        fontFamily: 'secular',
    }
})

const Ring = ({ navigation, route }) => {

    const [x, setx] = useState(0)
    const [ringing, setRinging] = useState(true)
    const [sound, setSound] = useState()

    const playsound = async () => {
        if (!route.params.music) { return 0 }
        const { sound } = await Audio.Sound.createAsync(require('../assets/audio/the_swan.mp3'));
        setSound(sound)
        await sound.playAsync()
    }

    useEffect(() => { playsound() }, [])

    let rotation = 0

    if (ringing) {

        rotation = Math.sin(x) * 2
        setTimeout(() => {
            setx(x + 1)
        }, 10)

        if (x % 100 == 0) {
            Vibration.vibrate()
        }

        return (
            <View style={[styles.main]}>
                <Text style={styles.text}>It's time!{'\n'}BRRRRR</Text>
                <Ionicons style={{ transform: [{ rotate: rotation + 'deg' }] }} name="alarm-outline" size={256} color="white" />
                <TouchableOpacity onPress={() => { setRinging(false); if (route.params.music) { sound.unloadAsync() } }}>
                    <View style={styles.stop_button}>
                        <Text style={styles.stop_button}>STOP</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    setTimeout(() => {
        navigation.navigate('alarms')
    }, 1000)

    return (
        <View style={{ backgroundColor: '#22aa55', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 256, transform: [{ rotate: '90deg' }, { translateY: -25 }] }}>{':)'}</Text>
        </View>
    )


}

export default Ring