import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const navigation = useNavigation();

    const goToRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.homeContainer}>
            <View style={styles.header}>
                <Text style={styles.appTitle}>TaskMaster</Text>
                <Text style={styles.appTagline}>Organiza tu vida, un día a la vez</Text>
                <TouchableOpacity onPress={goToRegister} style={styles.ctaButton}>
                    <Text style={styles.ctaButtonText}>Comienza Ahora</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.features}>
                <View style={styles.featureItem}>
                    <Text style={styles.featureTitle}>Gestión de Tareas</Text>
                    <Text style={styles.featureDescription}>Crea, edita y organiza tus tareas diarias con facilidad.</Text>
                </View>
                <View style={styles.featureItem}>
                    <Text style={styles.featureTitle}>Calendario Integrado</Text>
                    <Text style={styles.featureDescription}>Visualiza tus tareas programadas en un calendario intuitivo.</Text>
                </View>
                <View style={styles.featureItem}>
                    <Text style={styles.featureTitle}>Notificaciones Personalizadas</Text>
                    <Text style={styles.featureDescription}>Recibe recordatorios para mantenerte siempre al día.</Text>
                </View>
            </View>

            <View style={styles.imageSection}>
                <Image
                    source={{ uri: 'https://revista-urbana.nyc3.cdn.digitaloceanspaces.com/DALL%C2%B7E%202024-11-01%2020.27.46%20-%20A%20modern%20and%20minimalistic%20homepage%20design%20for%20a%20web%20app,%20showcasing%20a%20sleek%20calendar%20and%20task%20management%20interface.%20The%20page%20features%20a%20calendar%20secti.webp' }}
                    style={styles.appImage}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f4f4f9',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    appTitle: {
        fontSize: 28,
        color: '#3e89f3',
    },
    appTagline: {
        fontSize: 18,
        color: '#777',
        marginTop: 10,
    },
    ctaButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#3e89f3',
        borderRadius: 5,
    },
    ctaButtonText: {
        color: 'white',
        fontSize: 16,
    },
    features: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        maxWidth: 800,
        marginBottom: 30,
    },
    featureItem: {
        alignItems: 'center',
        maxWidth: 250,
        marginBottom: 20,
    },
    featureTitle: {
        fontSize: 20,
        color: '#3e89f3',
    },
    featureDescription: {
        fontSize: 16,
        color: '#555',
    },
    imageSection: {
        width: '100%',
        justifyContent: 'center',
    },
    appImage: {
        width: '80%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
});

export default Home;
