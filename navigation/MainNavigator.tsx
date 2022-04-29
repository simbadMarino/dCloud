import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';

import Web from '../screens/Web';

import Terminal from '../screens/Terminal';

import FileTransfer from '../screens/FileTransfer';

import { useAppSelector } from '../hooks/reduxHooks';

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  return (
    <Tab.Navigator
      initialRouteName="dBrowse"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6495ed',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'dBrowse') {
            iconName = focused ? 'folder-open' : 'folder';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog-outline' : 'cog';
          } else if (route.name === 'Terminal') {
            iconName = 'terminal';
          } else if (route.name === 'dWeb') {
            iconName = 'globe';
          } else if (route.name === 'Wallet') {
            iconName = 'wallet';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveBackgroundColor: colors.background,
        tabBarInactiveBackgroundColor: colors.background,
      })}
    >
      <Tab.Screen name="dBrowse" component={HomeStackNavigator} />
      <Tab.Screen name="dWeb" component={Web} />
      <Tab.Screen name="Wallet" component={FileTransfer} />
      <Tab.Screen name="Terminal" component={Terminal} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
};
