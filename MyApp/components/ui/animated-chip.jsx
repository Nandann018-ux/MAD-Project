import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedChip({
    label,
    selected = false,
    onPress,
    style,
}) {
    const scale = useSharedValue(1);
    const backgroundColor = useSharedValue(selected ? Colors.primary.solid : Colors.neutral[100]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        backgroundColor: backgroundColor.value,
    }));

    React.useEffect(() => {
        backgroundColor.value = withTiming(
            selected ? Colors.primary.solid : Colors.neutral[100],
            { duration: 200 }
        );
    }, [selected]);

    const handlePressIn = () => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const handlePress = () => {
        Haptics.selectionAsync();
        onPress?.();
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.chip, animatedStyle, style]}
        >
            <Text style={[styles.text, selected && styles.selectedText]}>
                {label}
            </Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.neutral[200],
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    selectedText: {
        color: Colors.text.white,
    },
});
