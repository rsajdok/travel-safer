import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import React from "react";
import useLocationStore from "@/store/locationStore";

const SpeedDisplay = () => {
    const speed = useLocationStore((state) => state.speed);

    return (
        <View style={styles.row}>
            <ThemedText type="subtitle">You drive{' '}</ThemedText>
            <ThemedText type='title'>{(speed).toFixed(0)} km\h</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8
    }
});

export default SpeedDisplay;
