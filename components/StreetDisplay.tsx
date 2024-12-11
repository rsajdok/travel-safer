import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import React from "react";
import useLocationStore from "@/store/locationStore";

const StreetDisplay = () => {
    const street = useLocationStore((state) => state.street);

    return (
        <View style={styles.row}>
            <ThemedText type="subtitle">on{' '}</ThemedText>
            {street && <ThemedText type='title'>{street}</ThemedText>}
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

export default StreetDisplay;
