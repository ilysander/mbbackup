import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
// import AlertManager from './components/alert/AlertManager';
// import DebugManager from './components/debug/DebugManager';
// import HandleError from './components/error/HandleError';
import FeedbackManager from './components/feedback/FeedbackManager';
import KeyboardManager from './components/keyboard/KeyboardManager';
import NetworkManager from './components/network/NetworkManager';
// import NotificationManager from './components/notification/NotificationManager';
// import { AnalyticsEvent, ScreensLabelsType } from './resources/analytics';
import { Colors } from './resources/constants';
import './resources/init';
import './components/keyboard/Keyboards';
// import { KeyboardUtil } from './resources/util';
// import MainRouter from './routers';
import MainRouter from './routers/MainRouter';
// import UpdateManager from './components/updates/UpdateManager';
// import RootManager from './components/root/RootManager';
import RemoteConfig from './resources/remote/RemoteConfig';
import { Validate } from './resources/functions';
import TourManager from './components/tour/TourManager';
import AlertManager from './components/alert/AlertManager';
import RootManager from './components/root/RootManager';
import UpdateManager from './components/updates/UpdateManager';
import SessionManager from './components/session/SessionManager';
import NotificationManager from './components/notification/NotificationManager';
import DebugManager from './components/debug/DebugManager';
import MobileServiceManager from './components/mobile-service/MobileServiceManager';
// import MobileServiceManager from './components/mobile-service/MobileServiceManager';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(false);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey1,
  } as ViewStyle,
});

export interface AppProps { }

export interface AppState { }

export default class App extends React.Component<AppProps, AppState> {
  state: AppState = {};

  // navigation!: NavigationContainerComponent | null;
  navigation!: NavigationContainerRef<any> | null;

  getNavigation = () => {
    return this.navigation;
  };

  // onNavigationStateChange = ( //FIXME
  //   prevState: NavigationState,
  //   currentState: NavigationState
  // ) => {
  //   const currentScreen = this.getActiveRoute(currentState);
  //   const prevScreen = this.getActiveRoute(prevState);
  //   const code = currentScreen?.params;
  //   let param;
  //   if (code?.statusCode !== undefined) {
  //     param = code?.statusCode;
  //   } else {
  //     param = '';
  //   }

  //   if (
  //     prevScreen &&
  //     currentScreen &&
  //     prevScreen.routeName !== currentScreen.routeName
  //   ) {
  //     KeyboardUtil.hide();
  //     AnalyticsEvent.trackScreen(
  //       currentScreen.routeName as ScreensLabelsType,
  //       param
  //     );
  //   }
  // };


  // getActiveRoute = (
  //   navigationState: NavigationState
  // ): NavigationRoute | null => {
  //   if (!navigationState) {
  //     return null;
  //   }
  //   const route = navigationState.routes[navigationState.index];
  //   if (route.routes) {
  //     return this.getActiveRoute(route as NavigationState);
  //   }
  //   return route;
  // };

  // componentDidMount() {
  //   Validate.allowRemoteConfig() && RemoteConfig.update();
  //   BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  // }

  // handleBackPress = () => {
  //   const navigation = this.getNavigation();
  //   if (!navigation) {
  //     return false;
  //   }
  //   const currentState = (navigation.state as any).nav;
  //   const currentScreen = this.getActiveRoute(currentState);

  //   if (!currentScreen) {
  //     return false;
  //   }
  //   const params = currentScreen.params || {};
  //   const prevScreen = params.prevScreen || '';
  //   if (prevScreen) {
  //     const navigateAction = NavigationActions.navigate({
  //       routeName: prevScreen,
  //     });

  //     navigation.dispatch(navigateAction);
  //     return true;
  //   }
  //   return false;
  // };


  // onNavigationStateChange = async () => {
  //   const routeNameRef = React.useRef();

  //   if (!!this.navigation) {
  //     const previousRouteName = routeNameRef.current;

  //     const route = this.navigation.getCurrentRoute();
  //     if (route) {
  //       const currentRouteName = route.name;
  //       const trackScreenView = () => {
  //         // Your implementation of analytics goes here!
  //       };

  //       if (previousRouteName !== currentRouteName) {
  //         // Save the current route name for later comparison
  //         routeNameRef.current = currentRouteName;

  //         // Replace the line below to add the tracker from a mobile analytics SDK
  //         await trackScreenView(currentRouteName);
  //       }

  //     }

  //   }

  // }

  render() {
    const statusBarColor = Colors.white;

    let main;

    if (__DEV__) {
      main = (
        <NavigationContainer
          ref={ref => {
            this.navigation = ref;
          }}
          onStateChange={(state) => {
            // const {key} =  state;
            if (state) {
              // state.history?.length;
              console.log('====STATE=====')
              if (state.history) {
                console.log('NRO:==>', state.history.length)
              }

              console.log('key:', state.key)

            } else {
              console.log('=======NO HAY STATE')
            }

            // return 
          }}
        >
          <MainRouter
          // onNavigationStateChange={this.onNavigationStateChange}
          // ref={ref => {
          //   this.navigation = ref;
          // }}
          />
        </NavigationContainer>
      );
    } else {
      main = (
        <NavigationContainer
          ref={ref => {
            this.navigation = ref;
          }}
        >
          {/* <HandleError accessibilityLabel={'app_handleerror'}> */}
          <MainRouter
          // onNavigationStateChange={this.onNavigationStateChange}
          // ref={ref => {
          //   this.navigation = ref;
          // }}
          />
          {/* </HandleError> */}
        </NavigationContainer>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle={'dark-content'}
          animated
        />
        {main}
        <TourManager
          accessibilityLabel={'app_tourmanager'}
          navigation={this.getNavigation}
        />
        <KeyboardManager
          accessibilityLabel={'app_keyboardmanager'}
          navigation={this.getNavigation}
        />
        <AlertManager
          accessibilityLabel={'app_alertmanager'}
          navigation={this.getNavigation}
        />
        <RootManager
          accessibilityLabel={'app_rootmanager'}
          navigation={this.getNavigation}
        />
        <UpdateManager
          accessibilityLabel={'app_updatemanager'}
          navigation={this.getNavigation}
        />
        <SessionManager
          accessibilityLabel={'app_sessionmanager'}
          navigation={this.getNavigation}
        />
        <FeedbackManager
          accessibilityLabel={'app_feedbackmanager'}
        // navigation={this.getNavigation}
        />
        <NetworkManager
          accessibilityLabel={'app_networkmanager'}
          navigation={this.getNavigation}
        />
        <NotificationManager
          accessibilityLabel={'app_notificationmanager'}
          navigation={this.getNavigation}
        />
        <DebugManager
          accessibilityLabel={'app_debugmanager'}
          navigation={this.getNavigation}
        />
        <MobileServiceManager
          accessibilityLabel={'app_mobileservicemanager'}
          navigation={this.getNavigation}
        />
      </View>
    );
  }
}
