import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedButton({
    onPress,
    children,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
}) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const handlePress = () => {
        if (!disabled && !loading && onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress();
        }
    };

    const getVariantStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primary;
            case 'secondary':
                return styles.secondary;
            case 'danger':
                return styles.danger;
            case 'success':
                return styles.success;
            default:
                return styles.primary;
        }
    };

    const getTextVariantStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[
                styles.button,
                getVariantStyle(),
                animatedStyle,
                (disabled || loading) && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'secondary' ? Colors.primary.solid : Colors.text.white} />
            ) : (
                <Text style={[styles.text, getTextVariantStyle(), textStyle]}>
                    {children}
                </Text>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    primary: {
        backgroundColor: Colors.primary.solid,
        shadowColor: Colors.primary.solid,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    secondary: {
        backgroundColor: Colors.neutral[100],
        borderWidth: 1,
        borderColor: Colors.neutral[200],
    },
    danger: {
        backgroundColor: Colors.danger.main,
        shadowColor: Colors.danger.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    success: {
        backgroundColor: Colors.success.main,
        shadowColor: Colors.success.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
    primaryText: {
        color: Colors.text.white,
    },
    secondaryText: {
        color: Colors.primary.solid,
    },
    disabled: {
        opacity: 0.5,
    },
});
