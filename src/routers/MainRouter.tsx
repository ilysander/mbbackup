import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppRouter from './AppRouter';
import AuthRouter from './AuthRouter';
import RootedRouter from './RootedRouter';
// import SamplingTab from '../scenes/demo/SamplingTab';

const Stack = createNativeStackNavigator();

function MainRouter() {
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Auth" component={AuthRouter} />
            <Stack.Screen name="App" component={AppRouter} />
            <Stack.Screen name="Rooted" component={RootedRouter} />
        </Stack.Navigator>
    );
}

export default MainRouter;
