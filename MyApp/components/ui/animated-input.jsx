import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

export function AnimatedInput({
    label,
    error,
    style,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = useSharedValue(Colors.neutral[700]);
    const labelScale = useSharedValue(1);
    const labelTranslateY = useSharedValue(0);

    const animatedBorderStyle = useAnimatedStyle(() => ({
        borderColor: borderColor.value,
    }));

    const handleFocus = () => {
        setIsFocused(true);
        borderColor.value = withTiming(Colors.primary.solid, {
            duration: 200,
            easing: Easing.ease
        });
    };

    const handleBlur = () => {
        setIsFocused(false);
        borderColor.value = withTiming(
            error ? Colors.danger.main : Colors.neutral[700],
            { duration: 200, easing: Easing.ease }
        );
    };

    return (
        <View style={style}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Animated.View style={[styles.inputContainer, animatedBorderStyle]}>
                <TextInput
                    {...props}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={styles.input}
                    placeholderTextColor={Colors.neutral[400]}
                />
            </Animated.View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 6,
    },
    inputContainer: {
        borderWidth: 2,
        borderRadius: 12,
        backgroundColor: Colors.surface,
    },
    input: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text.primary,
    },
    error: {
        fontSize: 12,
        color: Colors.danger.main,
        marginTop: 4,
    },
});
