import * as React from 'react';
import {
  StyleSheet,
  ImageStyle,
  Image,
  View,
  ViewProps,
  ViewStyle,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../resources/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  containerIOS: {
    backgroundColor: Colors.primary,
  } as ViewStyle,
  image: {
    alignSelf: 'center',
    width: 250,
    height: 126,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  } as ImageStyle,
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 40,
  } as ViewStyle,
});

export interface LoadingInitPhaseProps extends ViewProps {}

export interface LoadingInitPhaseState {}

export default class LoadingInitPhase extends React.Component<
  LoadingInitPhaseProps,
  LoadingInitPhaseState
> {
  render() {
    return (
      <View
        style={[styles.container, Platform.OS === 'ios' && styles.containerIOS]}
      >
        {Platform.OS === 'ios' && (
          <View>
            <Image
              style={styles.image}
              source={require('../../assets/images/logo.png')}
            />
          </View>
        )}
        <View style={styles.footer}>
          <ActivityIndicator color={Colors.white} size={'large'} />
        </View>
      </View>
    );
  }
}
