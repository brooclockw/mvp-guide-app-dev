import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

interface OnboardingWelcomeScreenProps {
  navigation?: any;
}

export const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({ navigation }) => {
  const handleContinue = () => {
    // Navegar al siguiente paso del onboarding o a la pantalla principal
    if (navigation) {
      navigation.replace('CitySelection');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>👋</Text>
        </View>
        
        <Text style={styles.title}>¡Bienvenido a GUIDE!</Text>
        
        <Text style={styles.subtitle}>
          Estamos emocionados de tenerte aquí. Comencemos a personalizar tu experiencia.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continuar con el onboarding"
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 32,
  },
  icon: {
    fontSize: 80,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

