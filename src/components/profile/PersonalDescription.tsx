import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { CardView } from '../ui';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    paddingTop: 30,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  } as ViewStyle,
  title: {
    fontSize: 26,
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  subtitle: {
    fontSize: 22,
    color: Colors.grey6,
    ...Font(),
    marginTop: -4,
  } as TextStyle,
});

export interface PersonalDescriptionProps extends ViewProps {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  accessibilityLabel?: string;
}

export interface PersonalDescriptionState { }

export default class PersonalDescription extends React.Component<
  PersonalDescriptionProps,
  PersonalDescriptionState
> {
  render() {
    const {
      title,
      subtitle,
      accessibilityLabel,
    } = this.props;
    return (
      <CardView style={styles.header}>
        <View accessibilityLabel={accessibilityLabel}>
          <Text
            accessibilityLabel={'personaldescription_header_title'}
            style={styles.title}
          >
            {title}
          </Text>
          <Text
            accessibilityLabel={'personaldescription_header_subtitle'}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        </View>
      </CardView>
    );
  }
}
