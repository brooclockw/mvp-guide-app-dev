import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

interface TermsAndConditionsScreenProps {
  navigation?: any;
}

export const TermsAndConditionsScreen: React.FC<TermsAndConditionsScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation?.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.content}>
          {/* Términos y Condiciones */}
          <Text style={styles.sectionTitle}>TÉRMINOS Y CONDICIONES</Text>
          <Text style={styles.lastUpdated}>Última actualización: {new Date().toLocaleDateString('es-ES')}</Text>

          <Text style={styles.paragraph}>
            Bienvenido a GUIDE. Al acceder y utilizar esta aplicación, aceptas cumplir con los siguientes términos y condiciones.
          </Text>

          <Text style={styles.subsectionTitle}>1. Aceptación de los Términos</Text>
          <Text style={styles.paragraph}>
            Al registrarte y utilizar GUIDE, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar la aplicación.
          </Text>

          <Text style={styles.subsectionTitle}>2. Uso de la Aplicación</Text>
          <Text style={styles.paragraph}>
            GUIDE es una plataforma diseñada para facilitar la gestión y descubrimiento de eventos y actividades. Te comprometes a utilizar la aplicación de manera legal y ética, respetando los derechos de otros usuarios.
          </Text>

          <Text style={styles.subsectionTitle}>3. Cuenta de Usuario</Text>
          <Text style={styles.paragraph}>
            Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Aceptas notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.
          </Text>

          <Text style={styles.subsectionTitle}>4. Contenido del Usuario</Text>
          <Text style={styles.paragraph}>
            Al publicar contenido en GUIDE, otorgas a la plataforma una licencia para usar, modificar y distribuir dicho contenido según sea necesario para el funcionamiento del servicio.
          </Text>

          <Text style={styles.subsectionTitle}>5. Propiedad Intelectual</Text>
          <Text style={styles.paragraph}>
            Todo el contenido de GUIDE, incluyendo pero no limitado a textos, gráficos, logos, iconos, imágenes y software, es propiedad de GUIDE o sus proveedores de contenido y está protegido por leyes de propiedad intelectual.
          </Text>

          <Text style={styles.subsectionTitle}>6. Limitación de Responsabilidad</Text>
          <Text style={styles.paragraph}>
            GUIDE no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar la aplicación.
          </Text>

          <Text style={styles.subsectionTitle}>7. Modificaciones</Text>
          <Text style={styles.paragraph}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la aplicación.
          </Text>

          <Text style={styles.subsectionTitle}>8. Terminación</Text>
          <Text style={styles.paragraph}>
            Podemos terminar o suspender tu acceso a GUIDE inmediatamente, sin previo aviso, por cualquier motivo, incluyendo el incumplimiento de estos términos.
          </Text>

          {/* Política de Privacidad */}
          <Text style={styles.sectionTitle}>POLÍTICA DE PRIVACIDAD</Text>
          <Text style={styles.lastUpdated}>Última actualización: {new Date().toLocaleDateString('es-ES')}</Text>

          <Text style={styles.paragraph}>
            En GUIDE, nos comprometemos a proteger tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.
          </Text>

          <Text style={styles.subsectionTitle}>1. Información que Recopilamos</Text>
          <Text style={styles.paragraph}>
            Recopilamos información que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, y cualquier otra información que elijas compartir al crear tu cuenta o utilizar nuestros servicios.
          </Text>

          <Text style={styles.subsectionTitle}>2. Uso de la Información</Text>
          <Text style={styles.paragraph}>
            Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones, comunicarnos contigo, y personalizar tu experiencia.
          </Text>

          <Text style={styles.subsectionTitle}>3. Compartir Información</Text>
          <Text style={styles.paragraph}>
            No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar nuestros servicios, cumplir con la ley, o proteger nuestros derechos.
          </Text>

          <Text style={styles.subsectionTitle}>4. Seguridad</Text>
          <Text style={styles.paragraph}>
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
          </Text>

          <Text style={styles.subsectionTitle}>5. Tus Derechos</Text>
          <Text style={styles.paragraph}>
            Tienes derecho a acceder, corregir, eliminar o limitar el procesamiento de tu información personal. Puedes ejercer estos derechos contactándonos a través de los canales proporcionados en la aplicación.
          </Text>

          <Text style={styles.subsectionTitle}>6. Cookies y Tecnologías Similares</Text>
          <Text style={styles.paragraph}>
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la aplicación y personalizar el contenido.
          </Text>

          <Text style={styles.subsectionTitle}>7. Cambios a esta Política</Text>
          <Text style={styles.paragraph}>
            Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página.
          </Text>

          <Text style={styles.subsectionTitle}>8. Contacto</Text>
          <Text style={styles.paragraph}>
            Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de los canales de soporte disponibles en la aplicación.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Al continuar, aceptas haber leído y comprendido tanto los Términos y Condiciones como la Política de Privacidad de GUIDE.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => navigation?.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Aceptar y cerrar"
        >
          <Text style={styles.acceptButtonText}>Entendido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  content: {
    maxWidth: '100%',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 32,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  acceptButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

