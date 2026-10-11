import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Keyboard,
  Platform,
  LayoutChangeEvent,
  ViewStyle,
  TextStyle,
  EmitterSubscription,
  View,
  SafeAreaView,
  Image,
} from 'react-native';
import { Font } from '../../resources/functions';
import { Colors } from '../../resources/constants';
import BottomTabBarIcon from './BottomTabBarIcon';
import { BottomTabBarProps, BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { CommonActions, NavigationHelpers, ParamListBase, TabRouterOptions } from '@react-navigation/native';
import AnalyticsEvent from '../../resources/analytics/AnalyticsEvent.web';
const isIos = Platform.OS === 'ios';
const Sizes = {
  Height: Platform.OS === 'ios'? 85:55,
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    position: 'relative',
    height: Sizes.Height,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowColor: Colors.grey2,
    shadowOffset: { height: 0, width: 0 },
    elevation: 16,
    overflow: 'visible',
  } as ViewStyle,
  container: {
    left: 0,
    right: 0,
    bottom: 0,
  } as ViewStyle,
  tab: {
    flex: 1,
    alignItems: isIos ? 'center' : 'stretch',
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  } as ViewStyle,
  icon: {
    alignItems: 'center',
  } as ViewStyle,
  label: {
    ...Font(),
    textAlign: 'center',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
    color: Colors.grey6,
  } as TextStyle,
  labelFocused: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
});

export interface BottomTabBarState {
  layout: { height: number; width: number };
  keyboard: boolean;
  visible: Animated.Value;
}

export interface RouteFocused {
  route: any;
  focused: boolean;
  label:string;
}

export interface Route {
  route: TabRouterOptions;
}

export default class BottomTabBar extends React.Component<
  BottomTabBarProps,
  BottomTabBarState
> {
  static defaultProps = {};

  state: BottomTabBarState = {
    layout: { height: 0, width: 0 },
    keyboard: false,
    visible: new Animated.Value(1),
  };

  keyboardWillShowListener!: EmitterSubscription;
  keyboardWillHideListener!: EmitterSubscription;

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = () => {
    this.setState({ keyboard: true }, () =>
      Animated.spring(this.state.visible, {
        toValue: 0,
        friction: 8,
        useNativeDriver: false,
      }).start()
    );
  };

  keyboardWillHide = () => {
    Animated.spring(this.state.visible, {
      toValue: 1,
      friction: 8,
      useNativeDriver: false,
    }).start(() => {
      this.setState({ keyboard: false });
    });
  };

  handleLayout = (e: LayoutChangeEvent) => {
    const { layout } = this.state;
    const { height, width } = e.nativeEvent.layout;
    if (height === layout.height && width === layout.width) {
      return;
    }

    this.setState({
      layout: {
        height,
        width,
      },
    });
  };

  renderLabel = ({ label, focused }: RouteFocused) => {

    return (
      <Animated.Text
        numberOfLines={1}
        style={[styles.label, focused && styles.labelFocused]}
        allowFontScaling={false}
      >
        {label}
      </Animated.Text>
    );
  };

  renderIcon = ({ route }: RouteFocused) => {
    const { name } = route;
    const routeName = name;
    let imageSource = require('../../assets/images/menu-more.png');
    const iconStyleTab = { width: 22, height: 22 };
    if (routeName === 'Agenda') {
      imageSource = require('../../assets/images/menu-my-day.png');
    } else if (routeName === 'Queries') {
      imageSource = require('../../assets/images/menu-queries.png');
    } else if (routeName === 'Transfers') {
      imageSource = require('../../assets/images/menu-transfers.png');
    } else if (routeName === 'Payments') {
      imageSource = require('../../assets/images/menu-payments.png');
    } else if (routeName === 'Loans') {
      imageSource = require('../../assets/images/menu-loans.png');
    } else if (routeName === 'Foryou') {
      imageSource = require('../../assets/images/menu-foryou.png');
    }


    return <View style={styles.icon}>
      <Image
        resizeMode={'contain'}
        source={imageSource}
        style={[iconStyleTab, { tintColor: Colors.grey6 }]}
      />
    </View>;
  };

  onTabPress = (route: any, navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>) => {
    console.log(`estas presionando ${route.name}`)
    console.log(`router ${JSON.stringify(route)}`)
    AnalyticsEvent.track(route.accessibilityLabel, route.label);
    // const resetAction = CommonActions.reset({ index: 0, routes: [{ name: route.name }] })
    // // const navigation = this.props.navigation();
    // if(navigation){
    //   navigation.navigate(route.name)
    //   // setTimeout(()=>{
    //   //   navigation.dispatch(resetAction);
    //   // },1000)
    // }

    // const navigateClearAction = CommonActions.navigate({name:route.name, params:{}})
    // navigation && navigation.dispatch(navigateClearAction);

    const resetAction = CommonActions.reset({ index: 0, routes: [{ name: route.name }] })
    navigation && navigation.dispatch(resetAction);
  }

  render() {
    const {
      navigation,
      // onTabPress,
      // onTabLongPress,
      // getAccessibilityLabel,
      state,
      descriptors
    } = this.props;
    const { routes } = state;
    const { visible, keyboard, layout } = this.state;
    const currentIndex = state.index;



    const transform = {
      opacity: visible.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: visible.interpolate({
            inputRange: [0, 1],
            outputRange: [layout.height, 0],
          }),
        },
      ],
      // position: keyboard ? 'absolute' : null,
    };

    return (
      <Animated.View
        style={[styles.container, transform]}
        pointerEvents={keyboard ? 'none' : 'auto'}
        onLayout={this.handleLayout}
      >

        <SafeAreaView style={styles.tabBar}>
          {routes.map((route, index: number) => {
            const focused = index === currentIndex;
            const {options} = descriptors[route.key];
            const label:string =typeof options.tabBarLabel === 'string'? options.tabBarLabel:options.title||'';
            // options.tabBarLabel !== undefined
            // ? options.tabBarLabel
            // : options.title !== undefined
            // ? options.title
            // : route.name;

            const accessibilityLabel = options.tabBarAccessibilityLabel
            const scene = { route, focused,label, accessibilityLabel };

            // const accessibilityLabel = getAccessibilityLabel({
            //   route,
            // });

            return (
              <BottomTabBarIcon
                index={index}
                key={route.key}
                onPress={() => this.onTabPress(route, navigation)}
                // onLongPress={() => onTabLongPress({ route })}
                // accessibilityLabel={accessibilityLabel}
                focused={focused}
                style={styles.tab}
              >
                {this.renderIcon(scene)}
                {this.renderLabel(scene)}
              </BottomTabBarIcon>
            );
          })}
        </SafeAreaView>
      </Animated.View>
    );
  }
}
