import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Colors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.heroContainer}>
                <View style={styles.heroImageContainer}>
                    <LinearGradient
                        colors={Colors.gradients.primary}
                        style={styles.heroPlaceholder}
                    >
                        <IconSymbol name="creditcard.fill" size={64} color="#FFF" />
                    </LinearGradient>
                </View>
                <Text style={styles.tagline}>Group expenses,{'\n'}simplified.</Text>
            </View>

            <View style={styles.featuresContainer}>
                <FeatureItem
                    icon="person.2.fill"
                    title="Effortless Sharing"
                    desc="Easily share expenses with friends and family."
                />
                <FeatureItem
                    icon="chart.pie.fill"
                    title="Financial Clarity"
                    desc="Gain clear insights on who owes what, anytime."
                />
                <FeatureItem
                    icon="doc.text.fill"
                    title="Quick Bill Entry"
                    desc="Add bills quickly and easily with just a few taps."
                />
            </View>

            <View style={styles.actionsContainer}>
                <Link href="/signup" asChild>
                    <AnimatedButton variant="primary" style={styles.createBtn}>
                        Create an account
                    </AnimatedButton>
                </Link>

                <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <Link href="/login">
                        <Text style={styles.loginLink}>Log In</Text>
                    </Link>
                </View>
            </View>
        </View>
    );
}

function FeatureItem({ icon, title, desc }) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
                <IconSymbol name={icon} size={24} color={Colors.primary.solid} />
            </View>
            <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 24,
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 40,
    },
    heroContainer: {
        alignItems: 'center',
    },
    heroImageContainer: {
        width: width * 0.8,
        height: 180,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary.solid,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    tagline: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.text.primary,
        textAlign: 'center',
        lineHeight: 40,
    },
    featuresContainer: {
        gap: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.secondary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
    actionsContainer: {
        gap: 16,
    },
    createBtn: {
        width: '100%',
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: Colors.text.secondary,
        fontSize: 14,
    },
    loginLink: {
        color: Colors.primary.solid,
        fontSize: 14,
        fontWeight: '700',
    },
});
