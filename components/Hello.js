import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"

const styles = StyleSheet.create({
    hello: {
        flex: 1,
        backgroundColor: '#3388aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    opacity: {
        flex: 1
    },
    text: (fontSize, fontface) => {
        return {
            color: 'white',
            fontSize: fontSize,
            textAlign: 'center',
            fontFamily: fontface
        }
    }
})

const Hello = ({ navigation }) => {

    return (
        <View style={styles.hello}>
            <TouchableOpacity onPress={() => { navigation.navigate('alarms') }}>
                <Text style={styles.text(60, 'secular')}>WAKE APP</Text>
                <Text style={styles.text(30, 'montserrat')}>Menage Sqlite{'\n'}Use animation{'\n'}Use ring</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Hello