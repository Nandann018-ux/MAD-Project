import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AnimatedButton } from '@/components/ui/animated-button';
import { LinearGradient } from 'expo-linear-gradient';

export default function SetupScreen() {
    const { completeSetup } = useAuth();
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [currency, setCurrency] = useState('₹');

    const handleSave = () => {
        if (!name.trim()) return;
        completeSetup({
            name,
            gender,
            currency,
            email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Let's get set up</Text>
                <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

                {/* Profile Photo Button */}
                <TouchableOpacity style={styles.photoBtn}>
                    <LinearGradient
                        colors={Colors.gradients.secondary}
                        style={styles.photoGradient}
                    >
                        <IconSymbol name="camera.fill" size={32} color="#FFF" />
                    </LinearGradient>
                    <Text style={styles.photoText}>Upload Profile Photo</Text>
                </TouchableOpacity>

                {/* Name Input (Styled as card) */}
                <View style={styles.inputCard}>
                    <Text style={styles.label}>Your Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Alex Johnson"
                        placeholderTextColor={Colors.text.muted}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />
                </View>

                {/* Gender Buttons */}
                <Text style={styles.sectionLabel}>Gender</Text>
                <View style={styles.row}>
                    {['Male', 'Female', 'Other'].map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[
                                styles.pillBtn,
                                gender === g && styles.pillBtnActive
                            ]}
                            onPress={() => setGender(g)}
                        >
                            <Text style={[
                                styles.pillText,
                                gender === g && styles.pillTextActive
                            ]}>{g}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Currency Buttons */}
                <Text style={styles.sectionLabel}>Currency</Text>
                <View style={styles.row}>
                    {['₹', '$', '€', '£'].map((c) => (
                        <TouchableOpacity
                            key={c}
                            style={[
                                styles.currencyBtn,
                                currency === c && styles.currencyBtnActive
                            ]}
                            onPress={() => setCurrency(c)}
                        >
                            <Text style={[
                                styles.currencyText,
                                currency === c && styles.currencyTextActive
                            ]}>{c}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Floating Save Button */}
            <View style={styles.footer}>
                <AnimatedButton
                    onPress={handleSave}
                    disabled={!name.trim()}
                    style={[styles.saveBtn, !name.trim() && styles.disabledBtn]}
                >
                    <LinearGradient
                        colors={name.trim() ? Colors.gradients.primary : [Colors.neutral[300], Colors.neutral[400]]}
                        style={styles.saveGradient}
                    >
                        <Text style={styles.saveText}>Save & Continue</Text>
                        <IconSymbol name="checkmark" size={24} color="#FFF" />
                    </LinearGradient>
                </AnimatedButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 24,
        paddingTop: 80,
        paddingBottom: 120,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginBottom: 40,
    },
    photoBtn: {
        alignItems: 'center',
        marginBottom: 40,
    },
    photoGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: Colors.primary.solid,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    photoText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary.solid,
    },
    inputCard: {
        backgroundColor: '#FFF',
        card: {
            backgroundColor: Colors.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        inputContainer: {
            marginBottom: 24,
        },
        label: {
            fontSize: 14,
            fontWeight: '700',
            color: Colors.text.secondary,
            marginBottom: 8,
            textTransform: 'uppercase',
        },
        input: {
            backgroundColor: Colors.card,
            padding: 16,
            borderRadius: 12,
            fontSize: 16,
            color: Colors.text.primary,
        },
        sectionLabel: {
            fontSize: 18,
            fontWeight: '700',
            color: Colors.text.primary,
            marginBottom: 16,
        },
        genderContainer: {
            flexDirection: 'row',
            gap: 16,
            marginBottom: 32,
        },
        genderBtn: {
            flex: 1,
            backgroundColor: Colors.card,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'transparent',
        },
        genderBtnActive: {
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderColor: Colors.primary.solid,
        },
        genderText: {
            fontSize: 16,
            fontWeight: '600',
            color: Colors.text.secondary,
        },
        genderTextActive: {
            color: Colors.primary.solid,
        },
        currencyContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 32,
        },
        currencyBtn: {
            width: '30%',
            backgroundColor: Colors.card,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'transparent',
        },
        currencyBtnActive: {
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderColor: Colors.primary.solid,
        },
        currencySymbol: {
            fontSize: 24,
            fontWeight: '700',
            color: Colors.text.primary,
            marginBottom: 4,
        },
        currencyName: {
            fontSize: 12,
            color: Colors.text.secondary,
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            paddingBottom: 40,
            backgroundColor: 'rgba(238, 242, 255, 0.9)', // Semi-transparent background
        },
        width: '100%',
        height: 64,
        borderRadius: 32,
        padding: 0, // Remove default padding to let gradient fill
        overflow: 'hidden',
        shadowColor: Colors.primary.solid,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    disabledBtn: {
        shadowOpacity: 0,
        elevation: 0,
    },
    saveGradient: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    saveText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
});
