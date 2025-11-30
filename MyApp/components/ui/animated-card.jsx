import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

export function AnimatedCard({ children, style, delay = 0 }) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        setTimeout(() => {
            opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
            translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        }, delay);
    }, [delay]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[styles.card, animatedStyle, style]}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card.background,
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.card.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 3,
    },
});
