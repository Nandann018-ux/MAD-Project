import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

const GRADIENT_COLORS = [
    Colors.primary.solid,
    Colors.success.main,
    Colors.danger.main,
    Colors.warning.main,
    '#EC4899',
    '#8B5CF6',
    '#06B6D4',
];

export function Avatar({ name, size = 'medium', style }) {
    const initial = name?.trim()[0]?.toUpperCase() || '?';

    const colorIndex = name ? name.charCodeAt(0) % GRADIENT_COLORS.length : 0;
    const backgroundColor = GRADIENT_COLORS[colorIndex];

    const sizeStyles = {
        small: { width: 32, height: 32, borderRadius: 16 },
        medium: { width: 40, height: 40, borderRadius: 20 },
        large: { width: 56, height: 56, borderRadius: 28 },
    };

    const textSizeStyles = {
        small: { fontSize: 14 },
        medium: { fontSize: 18 },
        large: { fontSize: 24 },
    };

    return (
        <View
            style={[
                styles.avatar,
                sizeStyles[size],
                { backgroundColor },
                style,
            ]}
        >
            <Text style={[styles.text, textSizeStyles[size]]}>
                {initial}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        color: Colors.text.white,
        fontWeight: '700',
    },
});
