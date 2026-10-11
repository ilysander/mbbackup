import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ViewProps,
  TextStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6323E',
    borderRadius: 16,
    paddingHorizontal: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  labelVersion: {
    color: Colors.white,
    fontSize: 10,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  labelDemo: {
    color: Colors.white,
    fontSize: 10,
    ...Font({ weight: 'Bold' }),
    marginLeft: 2,
  } as TextStyle,
});

export interface DemoFlagProps extends ViewProps {
  accessibilityLabel: string;
}
export interface DemoFlagState {}
class DemoFlag extends React.Component<DemoFlagProps, DemoFlagState> {
  state: DemoFlagState = {};

  render() {
    const { style, ...props } = this.props;

    return (
      <View style={[styles.container, style]} {...props}>
        <Text style={styles.labelVersion}>Versión</Text>
        <Text style={styles.labelDemo}>Demo</Text>
      </View>
    );
  }
}

export default DemoFlag;
