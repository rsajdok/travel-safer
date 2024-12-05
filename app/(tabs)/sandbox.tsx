import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SandboxScreen = () => {
    const currentSpeed = 55; // Dummy data
    const roadName = "Main St"; // Dummy data
    const messages = [
        { id: '1', text: 'Message 1' },
        { id: '2', text: 'Message 2' },
        { id: '3', text: 'Message 3' },
    ]; // Dummy data

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topSection}>
                <Text style={styles.speedText}>Current Speed: {currentSpeed} km/h</Text>
                <Text style={styles.roadText}>Road Name: {roadName}</Text>
                {currentSpeed > 50 && <Text style={styles.warningText}>Warning: Slow Down!</Text>}
            </View>
            <View style={styles.bottomSection}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => <Text style={styles.messageText}>{item.text}</Text>}
                    keyExtractor={item => item.id}
                />
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#e9ecef', // Slightly darker color
        padding: 32,
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e9ecef', // Slightly darker color
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    speedText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    roadText: {
        fontSize: 20,
        marginVertical: 10,
    },
    warningText: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',
        marginTop: 10,
    },
    bottomSection: {
        flex: 1,
        marginTop: 20,
    },
    messageText: {
        fontSize: 16,
        padding: 10,
        backgroundColor: '#e9ecef', // Slightly darker color
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
});

export default SandboxScreen;
