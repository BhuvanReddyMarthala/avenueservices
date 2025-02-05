import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GatePassScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to GatePass</Text>
            <Text style={styles.description}>
                This is the Restaurant page. Here you can add details about the restaurant.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        color: '#666',
    },
});

export default GatePassScreen;
