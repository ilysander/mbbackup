import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationOptions } from '../resources/constants';
import { L } from '../resources/language';
import ContactScreen from '../scenes/auth/ContactScreen';
import RootedScreen from '../scenes/RootedScreen';

const Stack = createNativeStackNavigator();
function RootedRouter() {
    return (
        <Stack.Navigator
            screenOptions={NavigationOptions.header}
        >
            <Stack.Screen name="RootedHome" component={RootedScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Contact" component={ContactScreen} options={{ title: L.contactscreen_title }} />
        </Stack.Navigator>
    );
}

export default RootedRouter;