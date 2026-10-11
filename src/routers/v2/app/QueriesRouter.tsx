import * as React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
// import AppRouter from './AppRouter';
import QueriesScreen from '../../../scenes/app/queries/QueriesScreen';
import HeaderMain from '../../../components/navigation/HeaderMain';
import { Colors, NavigationOptions, TypeInitialStart } from '../../../resources/constants';
import SavingScreen from '../../../scenes/app/queries/SavingScreen';
import { L } from '../../../resources/language';
import { StyleSheet, ViewStyle } from 'react-native';
import MovementScreen from '../../../scenes/app/queries/MovementScreen';
import LoanScreen from '../../../scenes/app/queries/LoanScreen';
import DPFScreen from '../../../scenes/app/queries/DPFScreen';
import CTSScreen from '../../../scenes/app/queries/CTSScreen';
import MaintenanceScreen from '../../../scenes/app/queries/MaintenanceScreen';
import LocationScreen from '../../../scenes/auth/LocationScreen';
import BackIcon from '../../../components/navigation/BackIcon';
import { InitialAppScreen } from '../../../resources/initialAppScreen';
import ProfileScreen from '../../../scenes/app/profile/ProfileScreen';
import ChangePhoneScreen from '../../../scenes/app/profile/ChangePhoneScreen';
import ChangeProfileSuccessScreen from '../../../scenes/app/profile/ChangeProfileSuccessScreen';
import ChangeEmailStartScreen from '../../../scenes/app/profile/ChangeEmailStartScreen';
import ChangeEmailConfirmScreen from '../../../scenes/app/profile/ChangeEmailConfirmScreen';
import ChangeEmailSuccessScreen from '../../../scenes/app/profile/ChangeEmailSuccessScreen';
import UpdateEmailStartScreen from '../../../scenes/app/profile/UpdateEmailStartScreen';
import UpdateEmailSuccessScreen from '../../../scenes/app/profile/UpdateEmailSuccessScreen';
import UpdateEmailConfirmScreen from '../../../scenes/app/profile/UpdateEmailConfirmScreen';
import NewAccountScreen from '../../../scenes/app/accounts/NewAccountScreen';
import NewAccountConfirmScreen from '../../../scenes/app/accounts/NewAccountConfirmScreen';
import NewAccountSuccessScreen from '../../../scenes/app/accounts/NewAccountSuccessScreen';

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
    headerMainContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.transparent,
    } as ViewStyle
})

const getRouterTitle = ({ route }: any, defaultTitle: string) => {
    let title = defaultTitle;
    if (!!route && !!route.params && !!route.params.title) {
        title = route.params.title;
    }
    return {
        title,
    };
};

function QueriesRouter() {
    return (
        <Stack.Navigator
            initialRouteName="QueriesHome"
            screenOptions={NavigationOptions.header}
        >
            <Stack.Screen
                name="QueriesHome"
                component={QueriesScreen}
                options={{
                    title: '',
                    headerLeft: undefined,
                    header: props => {
                        return <HeaderMain showTour {...props} style={styles.headerMainContainer} />;
                    },
                }}
            />
            <Stack.Screen
                name="Saving"
                component={SavingScreen}
                options={p => getRouterTitle(p, L.savingscreen_title)}
            />
            <Stack.Screen
                name="Movement"
                component={MovementScreen}
                options={p => getRouterTitle(p, L.movementscreen_title)}
            />
            <Stack.Screen
                name="Loan"
                component={LoanScreen}
                options={p => getRouterTitle(p, L.loanscreen_title)}
            />
            <Stack.Screen
                name="DPF"
                component={DPFScreen}
                options={p => getRouterTitle(p, L.dpfscreen_title)}
            />
            <Stack.Screen
                name="CTS"
                component={CTSScreen}
                options={p => getRouterTitle(p, L.ctsscreen_title)}
            />
            <Stack.Screen
                name="Maintenance"
                component={MaintenanceScreen}
                options={p => getRouterTitle(p, '')}
            />
            <Stack.Screen
                name="Location"
                component={LocationScreen}
                options={({ navigation }) => ({
                    title: L.locationscreen_title,
                    headerLeft: () => (
                        <BackIcon
                            onPress={() => {
                                if (
                                    InitialAppScreen.InitialAppScreen == TypeInitialStart.Onboarding
                                ) {
                                    navigation.goBack();
                                } else {
                                    navigation.getParam('shouldGoBack')
                                        ? navigation.goBack()
                                        : navigation.navigate('SignIn');
                                }
                            }}
                        />
                    ),
                })}
            />

            <Stack.Group
            // screenOptions={{ presentation: 'modal' }}
            >
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: L.profilescreen_title }} />
                <Stack.Screen name="ChangeProfileSuccess" component={ChangeProfileSuccessScreen} options={{ title: L.changeprofilesucessscreen_title }} />
                <Stack.Screen name="ChangePhone" component={ChangePhoneScreen} options={{ title: L.changephonescreen_title }} />
                <Stack.Screen name="ChangeEmailStart" component={ChangeEmailStartScreen} options={{ title: L.changeemailstartscreen_title }} />
                <Stack.Screen name="ChangeEmailConfirm" component={ChangeEmailConfirmScreen} options={{ title: L.changeemailconfirmscreen_title }} />
                <Stack.Screen name="ChangeEmailSuccess" component={ChangeEmailSuccessScreen} options={{ title: L.changeemailsuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />
                <Stack.Screen name="UpdateEmailStart" component={UpdateEmailStartScreen} options={{ title: L.updateemailstartscreen_title }} />
                <Stack.Screen name="UpdateEmailConfirm" component={UpdateEmailConfirmScreen} options={{ title: L.updateemailconfirmscreen_title }} />
                <Stack.Screen name="UpdateEmailSuccess" component={UpdateEmailSuccessScreen} options={{ title: L.updateemailsuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen name="NewAccount" component={NewAccountScreen} options={{ title: L.newaccountscreen_title }} />
                <Stack.Screen name="NewAccountConfirm" component={NewAccountConfirmScreen} options={{ title: L.newaccountscreen_title }} />
                <Stack.Screen name="NewAccountSuccess" component={NewAccountSuccessScreen} options={{ title: L.newaccountsuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />
            </Stack.Group>


        </Stack.Navigator>
    );
}

export default QueriesRouter;
