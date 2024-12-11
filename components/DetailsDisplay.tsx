import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import React from "react";
import useLocationStore from "@/store/locationStore";

const DetailsDisplay = () => {
    const maxSpeed = useLocationStore((state) => state.maxSpeed);

    return (
        <View style={styles.row}>
            <ThemedText type="subtitle">maximum speed is{' '}</ThemedText>
            <ThemedText type='title'>{maxSpeed}</ThemedText>
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

export default DetailsDisplay;
