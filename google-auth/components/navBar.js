import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Home from './Home.js';
import Dashboard from './dashboard.js';
import Register from './Register.js';
import GoogleLogin from './googleLogin.js';

const Tab = createBottomTabNavigator();

const NavBar = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Registro" component={Register} />
                <Tab.Screen name="Login" component={GoogleLogin} />
                <Tab.Screen name="Dashboard" component={Dashboard} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default NavBar;

