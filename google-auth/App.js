import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavBar from './components/navBar'
import Register from './components/Register';
import CalendarTask from './components/CalendarTask'
import GoogleLogin from './components/googleLogin';
import { TasksProvider } from './Context/TasksContext';
import { AuthProvider } from './Context/AuthContext';
import Dashboard from './components/dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            {/* NavBar como pantalla principal */}
            <Stack.Screen
              name="Main"
              component={NavBar}
              options={{ headerShown: false }} // Oculta el header del stack para usar solo el NavBar
            />
            {/* Otras pantallas */}
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="calendario" component={CalendarTask} />
            <Stack.Screen name="Login" component={GoogleLogin} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
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
