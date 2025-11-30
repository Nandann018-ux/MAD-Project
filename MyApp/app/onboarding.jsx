import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function OnboardingScreen() {
    return (
        <View style={styles.container}>

            <View style={styles.logoContainer}>
                <IconSymbol name="pause.fill" size={32} color={Colors.secondary.main} />
            </View>

            <View style={styles.content}>

                <View style={styles.illustration}>
                    <Image
                        source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/coins-stack-5658925-4715731.png' }}
                        style={styles.image}
                    />
                </View>

                <Text style={styles.heading}>Group expenses,{'\n'}simplified.</Text>

                <View style={styles.features}>
                    <FeatureRow
                        icon="person.2.fill"
                        title="Effortless Sharing"
                        text="Easily share expenses with friends and family."
                    />
                    <FeatureRow
                        icon="chart.pie.fill"
                        title="Financial Clarity"
                        text="Gain clear insights on who owes what, anytime."
                    />
                    <FeatureRow
                        icon="doc.text.fill"
                        title="Quick Bill Entry"
                        text="Add bills quickly and easily with just a few taps."
                    />
                </View>

                <View style={styles.spacer} />

                <Link href="/signup" asChild>
                    <TouchableOpacity style={styles.createBtn}>
                        <Text style={styles.btnText}>Create an account</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/login" asChild>
                    <TouchableOpacity style={styles.loginLink}>
                        <Text style={styles.loginText}>
                            Already have an account? <Text style={styles.loginHighlight}>Log In</Text>
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

function FeatureRow({ icon, title, text }) {
    return (
        <View style={styles.featureRow}>
            <View style={styles.iconBox}>
                <IconSymbol name={icon} size={20} color={Colors.secondary.main} />
            </View>
            <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureText}>{text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    illustration: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    heading: {
        fontSize: 36,
        fontWeight: '800',
        color: Colors.text.primary,
        lineHeight: 42,
        marginBottom: 32,
        textAlign: 'center',
    },
    features: {
        gap: 24,
    },
    featureRow: {
        flexDirection: 'row',
        gap: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(45, 212, 191, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
    spacer: {
        flex: 1,
    },
    createBtn: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.secondary.main,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    loginLink: {
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: Colors.text.primary,
    },
    loginHighlight: {
        color: Colors.secondary.main,
        fontWeight: '600',
    },
});
