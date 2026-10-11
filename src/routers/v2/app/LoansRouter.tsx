import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import Header from '../../../components/navigation/Header';
import {
  Colors,
  NavigationOptions,
  TypeInitialStart,
} from '../../../resources/constants';
import {L} from '../../../resources/language';
import LoansScreen from '../../../scenes/app/loans/LoansScreen';

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
import {InitialAppScreen} from '../../../resources/initialAppScreen';
import NewAccountLoanScreen from '../../../scenes/app/loans/NewAccountLoanScreen';
import LoanScreen from '../../../scenes/app/queries/LoanScreen';
import EmptyLoansScreen from '../../../scenes/app/payments/payments-own-loans/EmptyLoansScreen';
import InstantCashStartScreen from '../../../scenes/app/instant-cash/InstantCashStartScreen';
import InstantCashSelectInsuranceScreen from '../../../scenes/app/instant-cash/InstantCashSelectInsuranceScreen';
import InstantCashChooseScreen from '../../../scenes/app/instant-cash/InstantCashChooseScreen';
import InstantCashSuccessScreen from '../../../scenes/app/instant-cash/InstantCashSuccessScreen';
import InstantCashConfirmScreen from '../../../scenes/app/instant-cash/InstantCashConfirmScreen';
import InstantCashShortStartScreen from '../../../scenes/app/instant-cash-short/InstantCashShortStartScreen';
import InstantCashShortSuccessScreen from '../../../scenes/app/instant-cash-short/InstantCashShortSuccessScreen';
import InstantCashShortConfirmScreen from '../../../scenes/app/instant-cash-short/InstantCashShortConfirmScreen';

import PaymentsOwnLoansChooseScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansChooseScreen';
import PaymentsOwnLoansSuccessScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansSuccessScreen';
import PaymentsOwnLoansListScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansListScreen';
import PaymentsOwnLoansConfirmScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansConfirmScreen';
import PaymentsOwnLoansUpToDateScreen from '../../../scenes/app/payments/payments-own-loans/PaymentsOwnLoansUpToDateScreen';

import PaymentsThirdPartiesChooseScreen from '../../../scenes/app/payments/payments-third-parties/PaymentsThirdPartiesChooseScreen';
import PaymentsThirdPartiesConfirmScreen from '../../../scenes/app/payments/payments-third-parties/PaymentsThirdPartiesConfirmScreen';
import PaymentsThirdPartiesSuccessScreen from '../../../scenes/app/payments/payments-third-parties/PaymentsThirdPartiesSuccessScreen';
import LoansPostponementMessageScreen from '../../../scenes/app/loans-postponement/LoansPostponementMessageScreen';
import LoansPostponementChooseScreen from '../../../scenes/app/loans-postponement/LoansPostponementChooseScreen';
import LoansPostponementOptionScreen from '../../../scenes/app/loans-postponement/LoansPostponementOptionScreen';
import LoansPostponementMessageNotAllowedScreen from '../../../scenes/app/loans-postponement/LoansPostponementMessageNotAllowedScreen';
import LoansRescheduleConfirmScreen from '../../../scenes/app/loans-postponement/loans-reschedule/LoansRescheduleConfirmScreen';
import LoansRescheduleVerifyScreen from '../../../scenes/app/loans-postponement/loans-reschedule/LoansRescheduleVerifyScreen';
import LoansRescheduleSuccessScreen from '../../../scenes/app/loans-postponement/loans-reschedule/LoansRescheduleSuccessScreen';
import LoansFreezingConfirmScreen from '../../../scenes/app/loans-postponement/loans-freezing/LoansFreezingConfirmScreen';
import LoansFreezingCodeVerifyScreen from '../../../scenes/app/loans-postponement/loans-freezing/LoansFreezingCodeVerifyScreen';
import LoansFreezingSuccessScreen from '../../../scenes/app/loans-postponement/loans-freezing/LoansFreezingSuccessScreen';

const Stack = createNativeStackNavigator();

const getRouterTitle = ({route}: any, defaultTitle: string) => {
  let title = defaultTitle;
  if (!!route && !!route.params && !!route.params.title) {
    title = route.params.title;
  }
  return {
    title,
  };
};

function LoansRouter() {
  return (
    <Stack.Navigator
      initialRouteName="LoansHome"
      screenOptions={NavigationOptions.header}>
      <Stack.Screen
        name="LoansHome"
        component={LoansScreen}
        options={{
          title: L.loansscreen_title,
          headerLeft: undefined,
          header: (props: any) => {
            let isActive = false;
            if (props.route.params && props.route.params.isLoanPostponement) {
              isActive = true;
            }

            return (
              <Header
                styleGlobalContainer={[
                  isActive
                    ? {
                        backgroundColor: Colors.secondary,
                      }
                    : {
                        backgroundColor: Colors.grey1,
                      },
                ]}
                {...props}
              />
            );
          },
        }}
      />

      <Stack.Screen
        name="NewAccountLoan"
        component={NewAccountLoanScreen}
        options={({navigation}) => ({
          title: L.newaccountloanscreen_title,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Loan"
        component={LoanScreen}
        options={p => getRouterTitle(p, L.loanscreen_title)}
      />
      <Stack.Screen
        name="EmptyLoans"
        component={EmptyLoansScreen}
        options={{title: L.emptyloansscreen_title, headerLeft: undefined}}
      />

      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={({navigation}) => ({
          title: L.locationscreen_title,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                if (
                  InitialAppScreen.InitialAppScreen ==
                  TypeInitialStart.Onboarding
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

      <Stack.Screen
        name="InstantCashStart"
        component={InstantCashStartScreen}
        options={{title: L.instantcashstartscreen_title}}
      />
      <Stack.Screen
        name="InstantCashSelectInsurance"
        component={InstantCashSelectInsuranceScreen}
        options={{title: L.instantcashchoosescreen_title}}
      />
      <Stack.Screen
        name="InstantCashChoose"
        component={InstantCashChooseScreen}
        options={{title: L.instantcashchoosescreen_title}}
      />
      <Stack.Screen
        name="InstantCashConfirm"
        component={InstantCashConfirmScreen}
        options={{title: L.instantcashconfirmscreen_title}}
      />
      <Stack.Screen
        name="InstantCashSuccess"
        component={InstantCashSuccessScreen}
        options={{
          title: L.instantcashsuccessscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />

      <Stack.Screen
        name="InstantCashShortStart"
        component={InstantCashShortStartScreen}
        options={{title: L.instantcashshortstartscreen_title}}
      />
      <Stack.Screen
        name="InstantCashShortConfirm"
        component={InstantCashShortConfirmScreen}
        options={{title: L.instantcashshortconfirmscreen_title}}
      />
      <Stack.Screen
        name="InstantCashShortSuccess"
        component={(props: any) => <InstantCashShortSuccessScreen {...props} />}
        options={{
          title: L.instantcashshortsuccessscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />

      <Stack.Screen
        name="LoansPostponementMessage"
        component={LoansPostponementMessageScreen}
        options={{title: L.loanspostponementmessagescreen_title}}
      />
      <Stack.Screen
        name="LoansPostponementChoose"
        component={LoansPostponementChooseScreen}
        options={{title: L.loanspostponementchoosescreen_title}}
      />
      <Stack.Screen
        name="LoansPostponementOption"
        component={LoansPostponementOptionScreen}
        options={{title: L.loanspostoptionscreen_title}}
      />
      <Stack.Screen
        name="LoansPostponementMessageNotAllowed"
        component={LoansPostponementMessageNotAllowedScreen}
        options={{title: L.loanspostponementnotallowscreen_title}}
      />

      <Stack.Screen
        name="LoansRescheduleConfirm"
        component={LoansRescheduleConfirmScreen}
        options={{title: L.loansrescheduleconfirmscreen_title}}
      />
      <Stack.Screen
        name="LoansRescheduleVerify"
        component={LoansRescheduleVerifyScreen}
        options={{title: L.loansrescheduleverifyscreen_title}}
      />
      <Stack.Screen
        name="LoansRescheduleSuccess"
        component={LoansRescheduleSuccessScreen}
        options={{
          title: L.loansreschedulesuccessscreen_title,
          headerLeft: undefined,
          gestureEnabled: false,
          header: (props: any) => {
            return <Header styleTitle={{fontSize: 16}} {...props} />;
          },
        }}
      />

      <Stack.Screen
        name="LoansFreezingConfirm"
        component={LoansFreezingConfirmScreen}
        options={{
          title: L.loansfreezingconfirmscreen_title,
          header: (props: any) => {
            return <Header styleTitle={{fontSize: 16}} {...props} />;
          },
        }}
      />
      <Stack.Screen
        name="LoansFreezingCodeVerify"
        component={LoansFreezingCodeVerifyScreen}
        options={{
          title: L.loansfreezingcodeverifyscreen_title,
          header: (props: any) => {
            return <Header styleTitle={{fontSize: 16}} {...props} />;
          },
        }}
      />
      <Stack.Screen
        name="LoansFreezingSuccess"
        component={LoansFreezingSuccessScreen}
        options={{
          title: L.loansfreezingsuccessscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />

      <Stack.Group>
        <Stack.Screen
          name="PaymentsOwnLoansChoose"
          component={PaymentsOwnLoansChooseScreen}
          options={{title: L.paymentsscreen_title}}
        />
        <Stack.Screen
          name="PaymentsOwnLoansUpToDate"
          component={PaymentsOwnLoansUpToDateScreen}
          options={{title: L.paymentsscreen_title}}
        />
        <Stack.Screen
          name="PaymentsOwnLoansConfirm"
          component={PaymentsOwnLoansConfirmScreen}
          options={{title: L.paymentsscreen_title}}
        />
        <Stack.Screen
          name="PaymentsOwnLoansList"
          component={PaymentsOwnLoansListScreen}
          options={{title: L.paymentsscreen_title}}
        />
        <Stack.Screen
          name="PaymentsOwnLoansSuccess"
          component={PaymentsOwnLoansSuccessScreen}
          options={{
            title: L.paymentsownloanssuccessscreen_title,
            gestureEnabled: false,
            headerLeft: undefined,
          }}
        />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen
          name="PaymentsThirdPartiesChoose"
          component={PaymentsThirdPartiesChooseScreen}
          options={{title: L.paymentsthirdpartiesscreen_title}}
        />
        <Stack.Screen
          name="PaymentsThirdPartiesConfirm"
          component={PaymentsThirdPartiesConfirmScreen}
          options={{title: L.paymentsthirdpartiesscreen_title}}
        />
        <Stack.Screen
          name="PaymentsThirdPartiesSuccess"
          component={PaymentsThirdPartiesSuccessScreen}
          options={{
            title: L.paymentsthirdpartiessuccessscreen_title,
            gestureEnabled: false,
            headerLeft: undefined,
          }}
        />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{title: L.profilescreen_title}}
        />
        <Stack.Screen
          name="ChangeProfileSuccess"
          component={ChangeProfileSuccessScreen}
          options={{title: L.changeprofilesucessscreen_title}}
        />
        <Stack.Screen
          name="ChangePhone"
          component={ChangePhoneScreen}
          options={{title: L.changephonescreen_title}}
        />
        <Stack.Screen
          name="ChangeEmailStart"
          component={ChangeEmailStartScreen}
          options={{title: L.changeemailstartscreen_title}}
        />
        <Stack.Screen
          name="ChangeEmailConfirm"
          component={ChangeEmailConfirmScreen}
          options={{title: L.changeemailconfirmscreen_title}}
        />
        <Stack.Screen
          name="ChangeEmailSuccess"
          component={ChangeEmailSuccessScreen}
          options={{
            title: L.changeemailsuccessscreen_title,
            gestureEnabled: false,
            headerLeft: undefined,
          }}
        />
        <Stack.Screen
          name="UpdateEmailStart"
          component={UpdateEmailStartScreen}
          options={{title: L.updateemailstartscreen_title}}
        />
        <Stack.Screen
          name="UpdateEmailConfirm"
          component={UpdateEmailConfirmScreen}
          options={{title: L.updateemailconfirmscreen_title}}
        />
        <Stack.Screen
          name="UpdateEmailSuccess"
          component={UpdateEmailSuccessScreen}
          options={{
            title: L.updateemailsuccessscreen_title,
            gestureEnabled: false,
            headerLeft: undefined,
          }}
        />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen
          name="NewAccount"
          component={NewAccountScreen}
          options={{title: L.newaccountscreen_title}}
        />
        <Stack.Screen
          name="NewAccountConfirm"
          component={NewAccountConfirmScreen}
          options={{title: L.newaccountscreen_title}}
        />
        <Stack.Screen
          name="NewAccountSuccess"
          component={NewAccountSuccessScreen}
          options={{
            title: L.newaccountsuccessscreen_title,
            gestureEnabled: false,
            headerLeft: undefined,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
export default LoansRouter;
