import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Image,
  ImageStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  left: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  titleText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 20,
  } as TextStyle,
  securityIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 8,
  } as ImageStyle,
});

export interface QueriesHeaderProps extends ViewProps {
  name?: string;
  securitySealImage?: string;
  accessibilityLabel: string;
}

export interface QueriesHeaderState {}

export default class QueriesHeader extends React.Component<
  QueriesHeaderProps,
  QueriesHeaderState
> {
  render() {
    const { name, securitySealImage, ...props } = this.props;

    return (
      <View {...props}>
        <View style={styles.left}>
          {securitySealImage && (
            <Image
              accessibilityLabel={'queriesheader_security_seal_image'}
              source={{ uri: securitySealImage }}
              style={styles.securityIcon}
            />
          )}
          {name && (
            <Text
              accessibilityLabel={'queriesheader_hello'}
              allowFontScaling={false}
              style={styles.titleText}
            >
              ¡{L.queriesheader_hello}{' '}
              <Text accessibilityLabel={'queriesheader_hello_name'}>
                {Sanitizer.titleCase(name)}
              </Text>
              !
            </Text>
          )}
        </View>
      </View>
    );
  }
}
