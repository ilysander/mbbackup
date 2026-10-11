import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import AppRouter from './AppRouter';
import SignInScreen from '../scenes/auth/SignInScreen';
import HeaderMain from '../components/navigation/HeaderMain';
import Config from '../Config';
import {
  Colors,
  MaintenanceStatus,
  NavigationOptions,
  TypeInitialStart,
} from '../resources/constants';
import {HeaderProps} from '../components/navigation/Header';
import OnboardingScreen from '../scenes/auth/OnboardingScreen';
import SignUpCredentialsScreen from '../scenes/auth/signup/SignUpCredentialsScreen';
import SignUpSMSScreen from '../scenes/auth/signup/SignUpSMSScreen';
import SignUpResetScreen from '../scenes/auth/signup/SignUpResetScreen';
import SignUpSuccessScreen from '../scenes/auth/signup/SignUpSuccessScreen';
import SignUpInvalidScreen from '../scenes/auth/signup/SignUpInvalidScreen';
import {L} from '../resources/language';
import SignUpFacephiCredentialsScreen from '../scenes/auth/signup/facephi/SignUpFacephiCredentialsScreen';
import SignUpFacephiResetScreen from '../scenes/auth/signup/facephi/SignUpFacephiResetScreen';
import SignUpFacephiSuccessScreen from '../scenes/auth/signup/facephi/SignUpFacephiSuccessScreen';
import SignUpWebScreen from '../scenes/auth/SignUpWebScreen';
import ForgotPasswordCredentialsScreen from '../scenes/auth/forgot-password/ForgotPasswordCredentialsScreen';
import ForgotPasswordSMSScreen from '../scenes/auth/forgot-password/ForgotPasswordSMSScreen';
import ForgotPasswordResetScreen from '../scenes/auth/forgot-password/ForgotPasswordResetScreen';
import ForgotPasswordSuccessScreen from '../scenes/auth/forgot-password/ForgotPasswordSuccessScreen';
import ForgotPasswordInvalidScreen from '../scenes/auth/forgot-password/ForgotPasswordInvalidScreen';
import ForgotPasswordWebScreen from '../scenes/auth/ForgotPasswordWebScreen';
import SecuritySealScreen from '../scenes/auth/SecuritySealScreen';
import LocationScreen from '../scenes/auth/LocationScreen';
import ContactScreen from '../scenes/auth/ContactScreen';
import EnrollmentSMSScreen from '../scenes/auth/EnrollmentSMSScreen';
import EnrollmentBlockAdScreen from '../scenes/auth/EnrollmentBlockAdScreen';
import EnrollmentErrorScreen from '../scenes/auth/EnrollmentErrorScreen';
import IdentityCheckLoginScreen from '../scenes/auth/IdentityCheckLoginScreen';
import EnrollmentBlockValScreen from '../scenes/auth/EnrollmentBlockValScreen';
import EnrollmentBlackListScreen from '../scenes/auth/EnrollmentBlackListScreen';
import BackIcon from '../components/navigation/BackIcon';
import {InitialAppScreen} from '../resources/initialAppScreen';
import {Emitter} from '../resources/listeners';
import GenericErrorScreen from '../components/ui/GenericErrorScreen';

const Stack = createNativeStackNavigator();

function AuthRouter() {
  return (
    <Stack.Navigator screenOptions={NavigationOptions.header}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          gestureEnabled: false,
          // title: '.',
          headerLeft: undefined,
          headerRight: undefined,
          header: (props: HeaderProps) => {
            if (Config.settings.maintenanceStatus === MaintenanceStatus.Total) {
              return;
            }
            return (
              <HeaderMain
                showVersion
                showTour={false}
                showBackround={false}
                {...props}
                style={{
                  backgroundColor: Colors.white,
                  paddingBottom: 10,
                  height: undefined,
                }}
              />
            );
          },
        }}
      />

      <Stack.Screen
        name="SignUpCredentials"
        component={SignUpCredentialsScreen}
        options={{title: L.signupstack_title}}
      />
      <Stack.Screen
        name="SignUpSMS"
        component={SignUpSMSScreen}
        options={({navigation}) => ({
          title: L.signupstack_title,
          gestureEnabled: false,
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
        name="SignUpReset"
        component={SignUpResetScreen}
        options={() => ({
          title: L.signupstack_title,
          gestureEnabled: false,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                Emitter.emit('onSignUpTimeout', true);
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="SignUpSuccess"
        component={SignUpSuccessScreen}
        options={{
          title: L.signupsuccessscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="SignUpInvalid"
        component={SignUpInvalidScreen}
        options={({navigation}) => ({
          title: L.signupstack_title,
          gestureEnabled: false,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="GenericError"
        component={GenericErrorScreen}
        options={{title: L.signupstack_title}}
      />

      <Stack.Screen
        name="SignUpFacephi"
        component={SignUpFacephiCredentialsScreen}
        options={{title: L.signupstack_title, gestureEnabled: false}}
      />
      <Stack.Screen
        name="SignUpFacephiReset"
        component={SignUpFacephiResetScreen}
        options={() => ({
          title: L.signupstack_title,
          gestureEnabled: false,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                Emitter.emit('onTryBack', true);
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="SignUpFacephiSuccess"
        component={SignUpFacephiSuccessScreen}
        options={{
          title: L.signupfacephisuccessscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />

      <Stack.Screen
        name="SignUpWeb"
        component={SignUpWebScreen}
        options={({navigation}) => ({
          title: L.signupstack_title,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                navigation.getParam('shouldGoBack')
                  ? navigation.goBack()
                  : navigation.navigate('SignIn');
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="ForgotPasswordCredentials"
        component={ForgotPasswordCredentialsScreen}
        options={{title: L.forgotpasswordstack_title}}
      />
      <Stack.Screen
        name="ForgotPasswordSMS"
        component={ForgotPasswordSMSScreen}
        options={() => ({
          title: L.forgotpasswordstack_title,
          gestureEnabled: false,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                Emitter.emit('onForgotPasswordTimeout', true);
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ForgotPasswordReset"
        component={ForgotPasswordResetScreen}
        options={() => ({
          title: L.forgotpasswordstack_title,
          gestureEnabled: false,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                Emitter.emit('onForgotPasswordTimeout', true);
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ForgotPasswordSuccess"
        component={ForgotPasswordSuccessScreen}
        options={{
          title: L.forgotpasswordsuccessscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="ForgotPasswordInvalid"
        component={ForgotPasswordInvalidScreen}
        options={({navigation}) => ({
          title: L.forgotpasswordstack_title,
          gestureEnabled: false,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="ForgotPasswordWeb"
        component={ForgotPasswordWebScreen}
        options={({navigation}) => ({
          title: L.forgotpasswordstack_title,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                navigation.getParam('shouldGoBack')
                  ? navigation.goBack()
                  : navigation.navigate('SignIn');
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="SecuritySeal"
        component={SecuritySealScreen}
        options={{title: L.securitysealscreen_title}}
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
        name="Contact"
        component={ContactScreen}
        options={{title: L.contactscreen_title}}
      />

      <Stack.Screen
        name="EnrollmentSMS"
        component={EnrollmentSMSScreen}
        options={{
          title: L.enrollment_title,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="EnrollmentBlockAd"
        component={EnrollmentBlockAdScreen}
        options={({navigation}) => ({
          title: L.enrollmentblockadscreen_title,
          gesturesEnabled: false,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="EnrollmentError"
        component={EnrollmentErrorScreen}
        options={({navigation}) => ({
          title: L.enrollmenterror_title,
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
        name="IdentityCheckLogin"
        component={IdentityCheckLoginScreen}
        options={({navigation}) => ({
          title: L.identitycheckloginscreen_title,
          gesturesEnabled: false,
          headerLeft: () => (
            <BackIcon
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="EnrollmentBlockVal"
        component={EnrollmentBlockValScreen}
        options={{
          title: L.enrollmentblockvalscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="EnrollmentBlackList"
        component={EnrollmentBlackListScreen}
        options={{
          title: L.enrollmentblacklistscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthRouter;
