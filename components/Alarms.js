import { useEffect, useState } from "react"
import { Text, StyleSheet, View, ScrollView, Switch, TouchableOpacity, Image } from "react-native"
import Presser from "./Presser"
import Database from "./Database"
import Alarm from "./Alarm"

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#3388aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_wrapper: {
        position: 'absolute',
        bottom: '10%'
    }
})

let chosen_alarms
let global_alarms

const ring_check = (navigation) => {

    let hour = new Date().getHours()
    let minutes = new Date().getMinutes()

    for (let el of chosen_alarms) {
        if (el.hours == hour && el.minutes == minutes) {
            navigation.navigate('ringing!', { music: el.music })
        }
    }

    setTimeout(() => { ring_check(navigation) }, 60000)

}

//main screen component
const Alarms = ({ navigation }) => {

    const [alarms, setAlarms] = useState([])
    const [selected, setSelected] = useState([])

    global_alarms = alarms

    const delete_alarm = (id) => {
        setAlarms(global_alarms.filter(el => el.props.element.id != id))
    }

    const selection = (what, value) => {
        if (value) {
            setSelected(chosen_alarms.filter(el => el.id != what.id))
        } else {
            setSelected([...chosen_alarms, what])
        }
    }

    const update_music = (id) => {
        let output = chosen_alarms
        for (let i = 0; i < chosen_alarms.length; i++) {
            if (chosen_alarms[i].id == id) {
                output[i].music = !chosen_alarms[i].music
                setSelected(output)
                return 0
            }
        }
    }

    const read_db = () => {
        Database.getAll().then((all) => {

            let db_array = JSON.parse(all).rows._array
            let output = db_array.map((el, i) => {

                if (el.hours != undefined) {
                    return (
                        <Alarm key={i} keycopy={i} element={el} delete_alarm={delete_alarm} selection={selection} update_music={update_music} />
                    )
                }
            })
            setAlarms(output)
        })
    }

    useEffect(() => {
        read_db()
        setTimeout(() => {
            ring_check(navigation)
        }, 1000 * (60 - (new Date().getSeconds())))
    }, [])

    chosen_alarms = selected

    return (
        <View style={styles.wrapper}>
            <ScrollView style={{ width: '100%' }}>
                <AlarmList alarms={alarms} />
            </ScrollView>
            <View style={styles.button_wrapper}>
                <Presser action={() => { navigation.navigate('create alarm', { read_db: read_db }) }} />
            </View>
        </View>
    )
}

const AlarmList = ({ alarms }) => {
    return (
        <View>
            {alarms}
        </View >
    )

}

export default Alarms