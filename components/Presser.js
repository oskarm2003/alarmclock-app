import { Text, View, TouchableOpacity, StyleSheet, TouchableNativeFeedback } from "react-native"

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ffffff',
        borderRadius: 50,
        padding: 0,
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        content: { fontSize: 32, fontWeight: 'bold', margin: 0 }
    }
})

//custom alarmclock adding button
const Presser = ({ action }) => {

    return (
        <TouchableNativeFeedback
            onPress={() => { action() }}
            background={TouchableNativeFeedback.Ripple('rgba(0,0,0,1)', true)}
        >
            <View style={styles.button}>
                <Text style={styles.button.content}>+</Text>
            </View>
        </TouchableNativeFeedback>
    )

}

export default Presser