import { Text, StyleSheet, View, TouchableOpacity, Animated, Dimensions, DrawerLayoutAndroidComponent } from "react-native"
import Presser from "./Presser"
import Database from "./Database"
import { useRef, useState } from "react"

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#3388aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 50,
        fontFamily: 'montserrat',
        textAlign: 'center',
    },
    textWrapper: {
        flex: 1,
        justifyContent: "flex-end"

    },
    clock: {
        flex: 3,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    particleText: {
        fontSize: 24,
        fontFamily: 'montserrat'
    },
    time: {
        flexDirection: 'row',
        position: 'absolute',
        transform: [{ translateY: -10 }],
        text: {
            fontSize: 30,
            fontFamily: 'secular'
        }
    },
    ampm: {
        flexDirection: 'row',
        position: 'absolute',
        transform: [{ translateY: 30 }],
        text: {
            fontFamily: 'montserrat',
            fontSize: 20
        }
    }
})

let total_jumps = 5
let jumps = [0, 0, 0]
const animate = (desired_value, reference_value, jump) => {

    if (jump == 0) { jump = Math.floor((desired_value - reference_value) / total_jumps) }
    if ((reference_value - desired_value) * -Math.sign(jump) <= 0) { jump = 0; return desired_value }
    return reference_value + jump

}

let minutes_radius = 110
let minutes_size = 50

const CreateAlarm = ({ navigation, route }) => {

    const [time, setTime] = useState([0, 0])
    const [focus, setFocus] = useState('hours')
    const [hour_animation, setHourAnimation] = useState(150)
    const [ampm, setAmpm] = useState('am')

    if (focus == 'hours') {
        const new_value = animate(150, hour_animation, jumps[0])
        minutes_radius = animate(110, minutes_radius, jumps[1])
        minutes_size = animate(50, minutes_size, jumps[2])
        if (hour_animation != 150) {
            setTimeout(() => { setHourAnimation(new_value) }, 1)
        }
    }
    if (focus == 'minutes') {
        const new_value = animate(500, hour_animation, jumps[0])
        minutes_radius = animate(150, minutes_radius, jumps[1])
        minutes_size = animate(65, minutes_size, jumps[2])
        if (hour_animation != 500) {
            setTimeout(() => { setHourAnimation(new_value) }, 1)
        }
    }

    const hour_hoop = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const minute_hoop = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]


    //submit new alarm
    const submit_alarm = () => {
        Database.add(parseInt(time[0]) + (ampm == 'pm' ? 12 : 0), time[1])
        route.params.read_db()
        setFocus('hours')
        setTimeout(() => { navigation.goBack() }, 500)
    }

    //focusing on hours
    const choose_hours = () => {
        setFocus('hours')
    }

    //focusing on minutes
    const choose_minutes = () => {
        setFocus('minutes')
    }

    //on particle click
    const set_value = (what) => {
        if (focus == 'hours') {
            setTime([what, time[1]])
            choose_minutes()
        }
        else {
            if (time[1] - what >= 0 && time[1] - what < 4) { what = time[1] + 1 }
            setTime([time[0], what])
        }
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.textWrapper}>
                <Text style={styles.text}>CREATE NEW ALARM</Text>
            </View>
            <View style={styles.clock}>
                {create_hoop(minute_hoop, minutes_radius, '#afafaf80', 0, minutes_size, focus == 'minutes' ? true : false, set_value)}
                {create_hoop(hour_hoop, parseInt(JSON.stringify(hour_animation)), '#cfcfcf', 0, 65, focus == 'hours' ? true : false, set_value)}
                <View style={styles.time}>
                    <TouchableOpacity onPress={choose_hours}>
                        <Text style={[styles.time.text, { backgroundColor: focus == 'hours' ? '#ffffff50' : '#ffffff00' }]}>{(time[0] + '').length == 1 ? '0' + time[0] : time[0]}</Text>
                    </TouchableOpacity>
                    <Text style={styles.time.text}>:</Text>
                    <TouchableOpacity onPress={choose_minutes}>
                        <Text style={[styles.time.text, { backgroundColor: focus == 'minutes' ? '#ffffff50' : '#ffffff00' }]}>{(time[1] + '').length == 1 ? '0' + time[1] : time[1]}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.ampm}>
                    <TouchableOpacity onPress={() => { setAmpm('am') }}><Text style={[styles.ampm.text, { backgroundColor: ampm == 'am' ? '#88ff8850' : '#ffffff00' }]}>am</Text></TouchableOpacity>
                    <Text style={styles.ampm.text}>/</Text>
                    <TouchableOpacity onPress={() => { setAmpm('pm') }}><Text style={[styles.ampm.text, { backgroundColor: ampm == 'pm' ? '#ff88ff50' : '#ffffff00' }]}>pm</Text></TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#d8bb5d', width: Dimensions.get('window').width, alignItems: 'center' }}>
                    <TouchableOpacity onPress={submit_alarm}>
                        <Text style={{ fontFamily: 'secular', fontSize: 30 }}>ADD ALARM</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const create_hoop = (elements, radius, color, zIndex, size, clickable, action) => {

    let output = []
    let angle = Math.PI * 2 / elements.length

    for (let i = 0; i < elements.length; i++) {
        output.push(
            <Particle content={elements[i]} clickable={clickable} action={action}
                style={{
                    position: 'absolute',
                    backgroundColor: color,
                    zIndex: zIndex,
                    width: size,
                    height: size,
                    borderRadius: 50,
                    left: Math.cos(angle * (i - elements.length / 4)) * radius,
                    top: Math.sin(angle * (i - elements.length / 4)) * radius,
                    transform: [{ translateX: -size / 2 }, { translateY: -(size / 2) }],
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            />
        )
    }

    return <Animated.View>{output}</Animated.View>

}

const Particle = ({ content, style, action, clickable }) => {

    const component = <View style={style}>
        <Text style={styles.particleText}>{content}</Text>
    </View>

    if (clickable) { return (<TouchableOpacity onPress={() => { action(content) }}>{component}</TouchableOpacity>) }
    return component

}

export default CreateAlarm