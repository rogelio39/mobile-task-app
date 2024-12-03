import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import GoogleLogin from './components/googleLogin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home';
import Register from './components/Register';
import CalendarTask from './components/calendarTask';
import { TasksProvider } from './Context/TasksContext';
import { AuthProvider } from './Context/AuthContext';
// Crear el stack navigator
const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <AuthProvider>
      <TasksProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="calendario" component={CalendarTask} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={GoogleLogin} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </TasksProvider>
    </AuthProvider>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

