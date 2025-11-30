import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedInput } from '@/components/ui/animated-input';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Colors } from '@/constants/colors';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await signUp(name, email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primary.start, Colors.primary.end]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us to get started</Text>
          </View>

          <AnimatedCard style={styles.card} delay={100}>
            <AnimatedInput
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              style={styles.inputWrapper}
            />

            <AnimatedInput
              label="Email"
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.inputWrapper}
            />

            <AnimatedInput
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.inputWrapper}
            />

            <AnimatedButton
              onPress={submit}
              disabled={submitting}
              loading={submitting}
              variant="success"
              style={styles.button}
            >
              {submitting ? 'Creating...' : 'Sign Up'}
            </AnimatedButton>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/login">
                <Text style={styles.link}>Log in</Text>
              </Link>
            </View>
          </AnimatedCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.primary,
    opacity: 0.9,
  },
  card: {
    gap: 16,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  link: {
    color: Colors.primary.solid,
    fontWeight: '700',
    fontSize: 14,
  },
});

