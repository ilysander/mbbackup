import * as React from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '../../resources/constants/Colors';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 90,
  } as ImageStyle,
  container: {
    backgroundColor: Colors.grey1,
    alignItems: 'center',
  } as ViewStyle,
  logoContainer: {
    position: 'absolute',
    justifyContent: 'center',
    height: 87,
  } as ViewStyle,
  logo: {
    height: 45,
    bottom: 5,
    width: 96,
    alignSelf: 'flex-start',
  } as ImageStyle,
});

export interface HeaderLandingProps {}

export interface HeaderLandingState {}

export default class HeaderLanding extends React.Component<
  HeaderLandingProps,
  HeaderLandingState
> {
  render() {
    return (
      <View accessibilityLabel={'headerlanding'} style={styles.container}>
        <Image
          accessibilityLabel={'headerlanding_cover'}
          style={styles.image}
          fadeDuration={400}
          resizeMode={'cover'}
          source={require('../../assets/images/header-background-gradient-shadow.png')}
        />
        <View style={styles.logoContainer}>
          <Image
            accessibilityLabel={'headerlanding_logo'}
            style={styles.logo}
            resizeMode={'cover'}
            fadeDuration={200}
            source={require('../../assets/images/logo-colorful.png')}
          />
        </View>
      </View>
    );
  }
}
