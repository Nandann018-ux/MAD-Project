import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated, Dimensions, Text } from 'react-native';
import { Colors } from '@/constants/colors';

export default function LoadingScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>PayMe</Text>
            </Animated.View>
            <View style={styles.loadingContainer}>
                <View style={styles.dot} />
                <View style={[styles.dot, { animationDelay: '0.2s' }]} />
                <View style={[styles.dot, { animationDelay: '0.4s' }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 1,
    },
    loadingContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary.solid,
    }
});
