import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { NavigationOptions, TypeInitialStart } from '../../../resources/constants';
import { L } from '../../../resources/language';
import PaymentsScreen from '../../../scenes/app/payments/PaymentsScreen';

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

import LocationScreen from '../../../scenes/auth/LocationScreen';
import BackIcon from '../../../components/navigation/BackIcon';
import { InitialAppScreen } from '../../../resources/initialAppScreen';
import LoanScreen from '../../../scenes/app/queries/LoanScreen';

import PaymentsOwnLoansChooseScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansChooseScreen';
import PaymentsOwnLoansSuccessScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansSuccessScreen';
import PaymentsOwnLoansListScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansListScreen';
import PaymentsOwnLoansConfirmScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansConfirmScreen';
import PaymentsOwnLoansUpToDateScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansUpToDateScreen';
import PaymentsServicesChooseCategoryScreen from '../../../scenes/app/payments/payments-services/PaymentsServicesChooseCategoryScreen';
import PaymentsServicesChooseProviderScreen from '../../../scenes/app/payments/payments-services/PaymentsServicesChooseProviderScreen';
import PaymentsServicesChooseBillScreen from '../../../scenes/app/payments/payments-services/PaymentsServicesChooseBillScreen';
import PaymentsServicesBillUpToDateScreen from '../../../scenes/app/payments/payments-services/PaymentsServicesBillUpToDateScreen';
import PaymentsServicesChooseAccountScreen from '../../../scenes/app/payments/payments-services/PaymentsServicesChooseAccountScreen';
import PaymentsServicesConfirmScreen from '../../../scenes/app/payments/payments-services/PaymentsServicesConfirmScreen';
import PaymentsServicesSuccessScreen from '../../../scenes/app/payments/payments-services/PaymentsServicesSuccessScreen';
import PaymentsServicesValidAccountNotFoundScreen from '../../../scenes/app/payments/payments-services/PaymentsServicesValidAccountNotFoundScreen';
import PaymentsThirdPartiesChooseScreen from '../../../scenes/app/payments/payments-third-parties/PaymentsThirdPartiesChooseScreen';
import PaymentsThirdPartiesConfirmScreen from '../../../scenes/app/payments/payments-third-parties/PaymentsThirdPartiesConfirmScreen';
import PaymentsThirdPartiesSuccessScreen from '../../../scenes/app/payments/payments-third-parties/PaymentsThirdPartiesSuccessScreen';



const Stack = createNativeStackNavigator();

const getRouterTitle = ({ route }: any, defaultTitle: string) => {
  let title = defaultTitle;
  if (!!route && !!route.params && !!route.params.title) {
    title = route.params.title;
  }
  return {
    title,
  };
};

function PaymentsRouter() {
  return (
    <Stack.Navigator
      initialRouteName="PaymentsHome"
      screenOptions={NavigationOptions.header}
    >
      <Stack.Screen
        name="PaymentsHome"
        component={PaymentsScreen}
        options={{
          title: L.paymentsscreen_title,
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="Loan"
        component={LoanScreen}
        options={p => getRouterTitle(p, L.loanscreen_title)}
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


      <Stack.Screen name="PaymentsServicesChooseCategory" component={PaymentsServicesChooseCategoryScreen} options={{ title: L.paymentsserviceschoosecategoryscreen_title }} />
      <Stack.Screen name="PaymentsServicesChooseProvider" component={PaymentsServicesChooseProviderScreen} options={{ title: L.paymentsserviceschooseproviderscreen_title }} />
      <Stack.Screen name="PaymentsServicesChooseBill" component={PaymentsServicesChooseBillScreen} options={{ title: L.paymentsservicesscreen_title }} />
      <Stack.Screen name="PaymentsServicesBillUpToDate" component={PaymentsServicesBillUpToDateScreen} options={{ title: L.paymentsservicesbilluptodatescreen_title }} />
      <Stack.Screen name="PaymentsServicesChooseAccount" component={PaymentsServicesChooseAccountScreen} options={{ title: L.paymentsservicesscreen_title }} />
      <Stack.Screen name="PaymentsServicesConfirm" component={PaymentsServicesConfirmScreen} options={{ title: L.paymentsservicesscreen_title }} />
      <Stack.Screen name="PaymentsServicesValidAccountNotFound" component={PaymentsServicesValidAccountNotFoundScreen} options={{ title: L.paymentsservicesvalidaccountnotfoundscreen_title }} />
      <Stack.Screen name="PaymentsServicesSuccess" component={PaymentsServicesSuccessScreen} options={{ title: L.paymentsservicessuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />

      <Stack.Group>
        <Stack.Screen name="PaymentsOwnLoansChoose" component={PaymentsOwnLoansChooseScreen} options={{ title: L.paymentsscreen_title }} />
        <Stack.Screen name="PaymentsOwnLoansUpToDate" component={PaymentsOwnLoansUpToDateScreen} options={{ title: L.paymentsscreen_title }} />
        <Stack.Screen name="PaymentsOwnLoansConfirm" component={PaymentsOwnLoansConfirmScreen} options={{ title: L.paymentsscreen_title }} />
        <Stack.Screen name="PaymentsOwnLoansList" component={PaymentsOwnLoansListScreen} options={{ title: L.paymentsscreen_title }} />
        <Stack.Screen name="PaymentsOwnLoansSuccess" component={PaymentsOwnLoansSuccessScreen} options={{ title: L.paymentsownloanssuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="PaymentsThirdPartiesChoose" component={PaymentsThirdPartiesChooseScreen} options={{ title: L.paymentsthirdpartiesscreen_title }} />
        <Stack.Screen name="PaymentsThirdPartiesConfirm" component={PaymentsThirdPartiesConfirmScreen} options={{ title: L.paymentsthirdpartiesscreen_title }} />
        <Stack.Screen name="PaymentsThirdPartiesSuccess" component={PaymentsThirdPartiesSuccessScreen} options={{ title: L.paymentsthirdpartiessuccessscreen_title, gestureEnabled: false, headerLeft: undefined }} />
      </Stack.Group>



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
export default PaymentsRouter;
