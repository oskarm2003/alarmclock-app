import { useState } from 'react'
import { View, Text, Switch, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Database from './Database'

const styles = StyleSheet.create({
    alarm: {
        flexDirection: 'row',
        time: {
            fontSize: 35,
            marginBottom: 10
        },
        wrapper: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            margin: 5,
            padding: 10,
        }
    },
    week: {
        flexDirection: 'row',
        flex: 1,
        alignSelf: 'center',
        marginTop: 20,
    }
})

const Alarm = ({ element, selection, delete_alarm, update_music }) => {

    const [height, setHeight] = useState(new Animated.Value(190))
    const [expanded, setExpanded] = useState(false)
    const [chosen, setChosen] = useState(element.days == 'null' ? [] : element.days.split(','))
    const [value, setValue] = useState(false)
    const [music, setMusic] = useState(false)

    //on bin image click
    const on_delete = () => {
        Database.delete(element.id)
        delete_alarm(element.id)
    }

    //update_days
    const update_days = (days) => {
        Database.setDays(days, element.id)
        Database.getOne(element.id).then((all) => { setChosen(JSON.parse(all).rows._array[0].days.split(',')) })
    }

    //toggle animation
    const toggle = () => {

        let toHeight = 260
        if (expanded) { toHeight = 190; }

        Animated.spring(height, { toValue: toHeight, useNativeDriver: false }).start()
        setExpanded(!expanded)

    }

    return (
        < Animated.View style={{ flex: 1, backgroundColor: '#55aacc', margin: 5, borderRadius: 10, height: height, overflow: 'hidden' }} >
            <View style={styles.alarm.wrapper}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.alarm.time, { color: value ? '#ffffff' : '#000000' }]}>
                        {element.hours.length == 1 ? '0' + element.hours : element.hours}:{element.minutes.length == 1 ? '0' + element.minutes : element.minutes}
                    </Text>
                    <Feather name="music" size={32} color={music ? '#aa2288' : '#000000'} />
                </View>
                <View >
                    <Switch style={{ marginBottom: 10 }} value={value} onChange={() => { selection({ id: element.id, hours: element.hours, minutes: element.minutes, music: music }, value); setValue(!value) }} thumbColor='#6f6f6f' trackColor={{ false: '#ffffff50', true: '#ffffff80' }} />
                    <Switch style={{ marginTop: 10 }} value={music} onChange={() => { setMusic(!music); update_music(element.id) }} thumbColor='#cfcfcf' trackColor={{ false: '#ffffff50', true: '#aa2288' }} />
                </View>
            </View>
            <View style={styles.alarm.wrapper}>
                <TouchableOpacity onPress={on_delete}><Ionicons name="trash-bin" size={32} color="white" /></TouchableOpacity>
                <TouchableOpacity onPress={toggle}><AntDesign name={expanded ? 'up' : 'down'} size={32} color="white" /></TouchableOpacity>
            </View>
            <Week update={update_days} chosen={chosen} element={element} />
        </Animated.View>)
}

const Week = ({ update, chosen }) => {

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
        <View style={styles.week}>
            {days.map((el, i) => {

                const selected = () => {
                    for (let day of chosen) {
                        if (day === el) {
                            return true
                        }
                    }
                    return false
                }

                const choose = () => {
                    if (selected()) {
                        const toUpdate = chosen.filter(day => day != el)
                        update(toUpdate)
                    } else {
                        const toUpdate = [...chosen, el]
                        update(toUpdate)
                    }
                }

                return <TouchableOpacity key={i} onPress={choose}><View style={{ backgroundColor: selected() ? '#ffffff80' : null, padding: 2, borderRadius: 50, padding: 8 }}><Text style={{ fontSize: 15 }}>{el}</Text></View></TouchableOpacity>
            })}
        </View>
    )
}

export default Alarm