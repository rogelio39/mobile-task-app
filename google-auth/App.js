import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import logo from './assets/favicon.png'; // Importa correctamente la imagen

WebBrowser.maybeCompleteAuthSession();

const androidClientId = "521799423975-rtcrdsgqjci2sqb2op1uk0kia753i3gh.apps.googleusercontent.com";

export default function App() {
  const config = {
    androidClientId,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const handleToken = () => {
    if (response?.type === "success") { // Corrige "sucess" a "success"
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log("Access token:", token);
    }
  };

  useEffect(() => {
    handleToken();
  }, [response]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.wrapper} onPress={() => promptAsync()}>
        <Image source={logo} style={styles.brand} />
        <Text>Sign in with Google</Text>
        <StatusBar style="auto" />
      </TouchableOpacity>
    </View>
  );
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
