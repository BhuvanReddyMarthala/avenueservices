import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import RestaurantScreen from './RestaurantScreen';
import GymScreen from './GymScreen';
import VegetablesScreen from './GroceryScreen';
import SaloonScreen from './SaloonScreen';
import MedicalScreen from './MedicalScreen';
import GatePassScreen from './GatePassScreen';
import ClubHouseScreen from './ClubHouseScreen';
import LaundryScreen from './LaundryScreen';
import MaintenanceScreen from './MaintenanceScreen';
// ✅ Define types for stack navigation
export type RootStackParamList = {
  Home: undefined;
  Restaurant: undefined;
  Gym: undefined;
  Grocery: undefined;
  Saloon: undefined;
  Medical: undefined;
  GatePass: undefined;
  ClubHouse: undefined;
  LaundryScreen: undefined;
  MedicalScreen: undefined;
  MaintenanceScreen: undefined;
};

// ✅ Pass `RootStackParamList` to `createNativeStackNavigator()`
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
       
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} // Hide header
        />
         <Stack.Screen 
          name="Restaurant" 
          component={RestaurantScreen} 
          options={{ headerShown: false }} // Hide header
        />
         <Stack.Screen 
          name="Gym" 
          component={GymScreen} 
          options={{ headerShown: false }} // Hide header
        />
          <Stack.Screen 
          name="Grocery" 
          component={VegetablesScreen} 
          options={{ headerShown: false }} // Hide header
        />
          <Stack.Screen 
          name="Saloon" 
          component={SaloonScreen} 
          options={{ headerShown: false }} // Hide header
        />
           <Stack.Screen 
          name="Medical" 
          component={MedicalScreen} 
          options={{ headerShown: false }} // Hide header
        />
          <Stack.Screen 
          name="MaintenanceScreen" 
          component={MaintenanceScreen} 
          options={{ headerShown: false }} // Hide header
        />
         <Stack.Screen 
          name="GatePass" 
          component={GatePassScreen} 
          options={{ headerShown: false }} // Hide header
        />
         <Stack.Screen 
          name="ClubHouse" 
          component={ClubHouseScreen} 
          options={{ headerShown: false }} // Hide header
        />
        <Stack.Screen 
          name="LaundryScreen" 
          component={LaundryScreen} 
          options={{ headerShown: false }} // Hide header
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}










