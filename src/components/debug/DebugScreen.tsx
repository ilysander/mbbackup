import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Emitter } from '../../resources/listeners';
import ColorsScreen from './ColorsScreen';
import InfoScreen from './InfoScreen';
import SettingsScreen from './SettingsScreen';

const styles = StyleSheet.create({
  absolute: {
    elevation: 998,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  } as ViewStyle,
});

const Tab = createBottomTabNavigator();

const DebugTabsStack = function () {
  return (
    <Tab.Navigator screenOptions={{
      headerRight: ()=>(
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => Emitter.emit('onToggleDebug', false)}
        >
          <Text style={{ color: '#5671fd', fontSize: 16 }}>Ocultar</Text>
        </TouchableOpacity>
      )
    }}>
      <Tab.Screen name="Info" options={{
        tabBarLabel: 'Utilidades',
      }}>
        {(props: any) => <InfoScreen name={'Info'} {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{
        tabBarLabel: 'Configuración',
      }}>
        {(props: any) => <SettingsScreen name={'Settings'} {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Colors" options={{
        tabBarLabel: 'Colores',
      }}>
        {(props: any) => <ColorsScreen name={'Colors'} {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}


const Stack = createNativeStackNavigator();

const DebugStack = function AppRouter() {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Debug" component={DebugTabsStack} />
    </Stack.Navigator>
  );
}

class DebugScreen extends React.Component<any, any> {
  render() {
    const { ...props } = this.props;
    return (
      <View style={styles.absolute}>
        <StatusBar
          backgroundColor={'#d4d4d4'}
          barStyle={'dark-content'}
          animated
        />
        <NavigationContainer
        >
          <DebugStack {...props} />
        </NavigationContainer>
      </View>
    );
  }
}

export default DebugScreen;
