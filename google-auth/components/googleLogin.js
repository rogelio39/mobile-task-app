import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import logo from '../assets/favicon.png'; // Importa correctamente la imagen
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../Context/AuthContext';

// https://expo.dev/accounts/rogerras/projects/google-auth/builds/8cce13ed-9112-4f48-a35b-ed62ad49bcdd

WebBrowser.maybeCompleteAuthSession();

const androidClientId = "521799423975-rtcrdsgqjci2sqb2op1uk0kia753i3gh.apps.googleusercontent.com";


export default function GoogleLogin() {
    
    const {handleSuccess} = useAuthContext()
    const navigation = useNavigation();
    const config = {
        androidClientId,
        responseType: "code", // Importante: obtener idToken
    };

    const getUserProfile = async (token) => {
        try {
            const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = await response.json();
        } catch (error) {
            console.log("error", error);
        }
    }

    const [request, response, promptAsync] = Google.useAuthRequest(config);
    const goToCalendar = () => {
        navigation.navigate('calendario'); // Cambia 'Calendar' por el nombre exacto de la ruta en tu configuración de navegación
    };

    const handleToken = async() => {
        if (response?.type === "success") { 
            const { authentication } = response;
            const token = authentication?.idToken;
            const accessToken = authentication?.accessToken;
            const successLogin = await handleSuccess(token);
            if(successLogin){
                goToCalendar();
            } else{
                console.log("no se recibio un idtoken")
            }
        
            getUserProfile(accessToken)
        }
    };

    useEffect(() => {
        handleToken();
    }, [response]);



    return (

        <View style={styles.container}>
            <TouchableOpacity style={styles.wrapper} onPress={() =>promptAsync()}>
                <Image source={logo} style={styles.brand} />
                <Text >Sign in with Google</Text>
            </TouchableOpacity>
        </View>
    )


}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
    },
    brand: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
});
