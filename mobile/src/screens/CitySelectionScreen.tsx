import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

interface CitySelectionScreenProps {
  navigation?: any;
}

export const CitySelectionScreen: React.FC<CitySelectionScreenProps> = ({ navigation }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lista de ciudades de ejemplo (esto debería venir del backend)
  const cities = [
    'Buenos Aires',
    'Córdoba',
    'Rosario',
    'Mendoza',
    'La Plata',
    'Tucumán',
    'Mar del Plata',
    'Salta',
    'Santa Fe',
    'San Juan',
  ];

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = async (city: string) => {
    setIsLoading(true);
    try {
      // Aquí se guardaría la ciudad seleccionada y se navegaría al feed
      // await saveUserCity(city);
      // navigation.navigate('Feed');
      console.log('Ciudad seleccionada:', city);
    } catch (error) {
      console.error('Error al seleccionar ciudad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Selecciona tu ciudad</Text>
          <Text style={styles.subtitle}>
            Elige la ciudad donde te encuentras para personalizar tu experiencia
          </Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar ciudad..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Campo de búsqueda de ciudad"
              accessibilityHint="Escribe el nombre de la ciudad que deseas buscar"
            />
          </View>

          <View style={styles.citiesList}>
            {filteredCities.length === 0 ? (
              <Text style={styles.noResults}>No se encontraron ciudades</Text>
            ) : (
              filteredCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.cityButton,
                    selectedCity === city && styles.cityButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedCity(city);
                    handleCitySelect(city);
                  }}
                  disabled={isLoading}
                  accessibilityRole="button"
                  accessibilityLabel={`Seleccionar ciudad ${city}`}
                >
                  <Text
                    style={[
                      styles.cityButtonText,
                      selectedCity === city && styles.cityButtonTextSelected,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  citiesList: {
    gap: 12,
  },
  cityButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cityButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  cityButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  cityButtonTextSelected: {
    color: '#fff',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

