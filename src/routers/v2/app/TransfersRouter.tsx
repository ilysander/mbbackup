import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { NavigationOptions, TypeInitialStart } from '../../../resources/constants';
import { L } from '../../../resources/language';
import TransfersScreen from '../../../scenes/app/transfers/TransfersScreen';

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

import ChangeContactScreen from '../../../scenes/app/transfers/ChangeContactScreen';
import ChangeContactSuccessScreen from '../../../scenes/app/transfers/ChangeContactSuccessScreen';
import LocationScreen from '../../../scenes/auth/LocationScreen';
import TransfersMyAccountsChooseScreen from '../../../scenes/app/transfers/transfers-my-accounts/TransfersMyAccountsChooseScreen';
import TransfersMyAccountsConfirmScreen from '../../../scenes/app/transfers/transfers-my-accounts/TransfersMyAccountsConfirmScreen';
import TransfersMyAccountsSuccessScreen from '../../../scenes/app/transfers/transfers-my-accounts/TransfersMyAccountsSuccessScreen';
import TransfersOtherAccountsChooseScreen from '../../../scenes/app/transfers/transfers-other-accounts/TransfersOtherAccountsChooseScreen';
import TransfersOtherAccountsConfirmScreen from '../../../scenes/app/transfers/transfers-other-accounts/TransfersOtherAccountsConfirmScreen';
import TransfersOtherAccountsSuccessScreen from '../../../scenes/app/transfers/transfers-other-accounts/TransfersOtherAccountsSuccessScreen';
import TransfersOtherBanksChooseScreen from '../../../scenes/app/transfers/transfers-other-banks/TransfersOtherBanksChooseScreen';
import TransfersOtherBanksConfirmScreen from '../../../scenes/app/transfers/transfers-other-banks/TransfersOtherBanksConfirmScreen';
import TransfersOtherBanksSuccessScreen from '../../../scenes/app/transfers/transfers-other-banks/TransfersOtherBanksSuccessScreen';
import BackIcon from '../../../components/navigation/BackIcon';
import { InitialAppScreen } from '../../../resources/initialAppScreen';

const Stack = createNativeStackNavigator();

function TransfersRouter() {
  return (
    <Stack.Navigator
      initialRouteName="TransfersHome"
      screenOptions={NavigationOptions.header}
    >
      <Stack.Screen
        name="TransfersHome"
        component={TransfersScreen}
        options={{
          title: L.transfersscreen_title,
          headerLeft: undefined,
        }}
      />
      <Stack.Screen name="ChangeContact" component={ChangeContactScreen} options={{ title: L.changecontactscreen_title }} />
      <Stack.Screen name="ChangeContactSuccess" component={ChangeContactSuccessScreen} options={{ title: L.changecontactsuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />
      {/* <Stack.Screen name="Location" component={LocationScreen} options={{ title: L.profilescreen_title }} /> */}
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


      <Stack.Screen name="TransfersMyAccountsChoose" component={TransfersMyAccountsChooseScreen} options={{ title: L.transfersscreen_title }} />
      <Stack.Screen name="TransfersMyAccountsConfirm" component={TransfersMyAccountsConfirmScreen} options={{ title: L.transfersscreen_title }} />
      <Stack.Screen name="TransfersMyAccountsSuccess" component={TransfersMyAccountsSuccessScreen} options={{ title: L.transfersmyaccountssuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />

      <Stack.Screen name="TransfersOtherAccountsChoose" component={TransfersOtherAccountsChooseScreen} options={{ title: L.transfersscreen_title }} />
      <Stack.Screen name="TransfersOtherAccountsConfirm" component={TransfersOtherAccountsConfirmScreen} options={{ title: L.transfersscreen_title }} />
      <Stack.Screen name="TransfersOtherAccountsSuccess" component={TransfersOtherAccountsSuccessScreen} options={{ title: L.transfersotheraccountssuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />


      <Stack.Screen name="TransfersOtherBanksChoose" component={TransfersOtherBanksChooseScreen} options={{ title: L.transfersscreen_title }} />
      <Stack.Screen name="TransfersOtherBanksConfirm" component={TransfersOtherBanksConfirmScreen} options={{ title: L.transfersscreen_title }} />
      <Stack.Screen name="TransfersOtherBanksSuccess" component={TransfersOtherBanksSuccessScreen} options={{ title: L.transfersotheraccountssuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />


      <Stack.Group>
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
export default TransfersRouter;
