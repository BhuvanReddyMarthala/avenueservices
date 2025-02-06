import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import RestaurantScreen from './RestaurantScreen';
import GymScreen from './GymScreen';
import SaloonScreen from './SaloonScreen';
import MedicalScreen from './MedicalScreen';
import GatePassScreen from './GatePassScreen';
import ClubHouseScreen from './ClubHouseScreen';
import LaundryScreen from './LaundryScreen';
import GroceryScreen from './GroceryScreen';
import MaintenanceScreen from './MaintenanceScreen';
import BroadCastScreen from './BroadCastScreen';

export type RootStackParamList = {
  Home: undefined;
  Restaurant: undefined;
};


const Stack = createNativeStackNavigator();

 
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
          component={GroceryScreen} 
          options={{ headerShown: false }} // Hide header
        />
        <Stack.Screen 
          name="Maintenance" 
          component={MaintenanceScreen} 
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
          name="laundry" 
          component={LaundryScreen} 
          options={{ headerShown: false }} // Hide header
        />
        <Stack.Screen 
          name="BroadCast" 
          component={BroadCastScreen} 
          options={{ headerShown: false }} // Hide header
        />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}