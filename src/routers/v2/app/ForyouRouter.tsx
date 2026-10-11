import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Colors,
  NavigationOptions,
  TypeInitialStart,
} from '../../../resources/constants';
import {L} from '../../../resources/language';
import ForyouMenuScreen from '../../../scenes/app/foryou/ForyouMenuScreen';

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
import SoatScreen from '../../../scenes/app/foryou/SoatScreen';
import FlexHomeScreen from '../../../scenes/app/foryou/FlexHomeScreen';
import OncologicalScreen from '../../../scenes/app/foryou/OncologicalScreen';
import ProtectedSaleScreen from '../../../scenes/app/foryou/ProtectedSaleScreen';
import CulqiScreen from '../../../scenes/app/foryou/CulqiScreen';
import YapeScreen from '../../../scenes/app/foryou/YapeScreen';
import YevoScreen from '../../../scenes/app/foryou/YevoScreen';
import LifeDevolutionScreen from '../../../scenes/app/foryou/LifeDevolutionScreen';
import DPFOpenCalculatorScreen from '../../../scenes/app/dpf/dpf-open/DPFOpenCalculatorScreen';
import DPFOpenChooseScreen from '../../../scenes/app/dpf/dpf-open/DPFOpenChooseScreen';
import DPFOpenConfirmScreen from '../../../scenes/app/dpf/dpf-open/DPFOpenConfirmScreen';
import DPFOpenInvalidScreen from '../../../scenes/app/dpf/dpf-open/DPFOpenInvalidScreen';
import DPFOpenSuccessScreen from '../../../scenes/app/dpf/dpf-open/DPFOpenSuccessScreen';
import DPFOpenInfoScreen from '../../../scenes/app/dpf/dpf-open/DPFOpenInfoScreen';
import NewAccountDPFScreen from '../../../scenes/app/dpf/NewAccountDPFScreen';
import {Header} from '../../../components/ui';

const Stack = createNativeStackNavigator();

function ForyouRouter() {
  return (
    <Stack.Navigator
      initialRouteName="ForyouMenu"
      screenOptions={NavigationOptions.header}>
      <Stack.Screen
        name="ForyouMenu"
        component={ForyouMenuScreen}
        options={{
          title: L.foryouscreen_title,
          headerLeft: undefined,
        }}
      />

      <Stack.Screen
        name="Soat"
        component={SoatScreen}
        options={{
          title: L.foryou_soat_title,
          header: (props: any) => {
            return (
              <Header
                styleGlobalContainer={{
                  backgroundColor: Colors.secondary,
                }}
                {...props}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="FlexHome"
        component={FlexHomeScreen}
        options={{
          title: L.foryou_flexhome_title,
          header: (props: any) => {
            return (
              <Header
                styleGlobalContainer={{
                  backgroundColor: Colors.secondary,
                }}
                {...props}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="Oncological"
        component={OncologicalScreen}
        options={{
          title: L.foryou_oncological_title,
          header: (props: any) => {
            return (
              <Header
                styleGlobalContainer={{
                  backgroundColor: Colors.secondary,
                }}
                {...props}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="ProtectedSale"
        component={ProtectedSaleScreen}
        options={{
          title: L.foryou_protectedsale_title,
          header: (props: any) => {
            return (
              <Header
                styleGlobalContainer={{
                  backgroundColor: Colors.secondary,
                }}
                {...props}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="Culqi"
        component={CulqiScreen}
        options={{
          title: L.foryou_culqi_title,
          header: (props: any) => {
            return (
              <Header
                styleGlobalContainer={{
                  backgroundColor: Colors.secondary,
                }}
                {...props}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="Yape"
        component={YapeScreen}
        options={{
          title: L.foryou_yape_title,
          header: (props: any) => {
            return (
              <Header
                styleGlobalContainer={{
                  backgroundColor: Colors.secondary,
                }}
                {...props}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="Yevo"
        component={YevoScreen}
        options={{
          title: L.foryou_yevo_title,
          header: (props: any) => {
            return (
              <Header
                styleGlobalContainer={{
                  backgroundColor: Colors.secondary,
                }}
                {...props}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="LifeDevolution"
        component={LifeDevolutionScreen}
        options={{
          title: L.foryou_lifedevolution_title,
          header: (props: any) => {
            return (
              <Header
                styleGlobalContainer={{
                  backgroundColor: Colors.secondary,
                }}
                {...props}
              />
            );
          },
        }}
      />

      <Stack.Screen
        name="DPFOpenCalculator"
        component={(props: any) => <DPFOpenCalculatorScreen {...props} />}
        options={{title: L.dpfopenscreen_title}}
      />
      <Stack.Screen
        name="DPFOpenChoose"
        component={DPFOpenChooseScreen}
        options={{title: L.dpfopenscreen_title}}
      />
      <Stack.Screen
        name="DPFOpenConfirm"
        component={DPFOpenConfirmScreen}
        options={{title: L.dpfopenscreen_title}}
      />
      <Stack.Screen
        name="DPFOpenInvalid"
        component={DPFOpenInvalidScreen}
        options={{
          title: L.dpfopeninvalidscreen_screen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="DPFOpenSuccess"
        component={DPFOpenSuccessScreen}
        options={{
          title: L.dpfopensuccessscreen_title,
          gestureEnabled: false,
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="DPFOpenInfo"
        component={DPFOpenInfoScreen}
        options={{title: L.dpfopeninfoscreen_title}}
      />
      <Stack.Screen
        name="NewAccountDPF"
        component={NewAccountDPFScreen}
        options={({navigation}) => ({
          title: L.dpfopenscreen_title,
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
export default ForyouRouter;
