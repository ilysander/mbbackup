import * as React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { Separator, Touchable } from '../ui';
import { TouchableProps } from '../ui/Touchable';
import Config from '../../Config';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  } as ViewStyle,
  info: {
    marginVertical: 12,
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  } as ViewStyle,
  nameText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  icon: {
    tintColor: Colors.secondary,
    alignSelf: 'flex-start',
    marginRight: 10,
    width: 32,
    height: 32,
  } as ImageStyle,
  moreIcon: {
    tintColor: Colors.grey4,
    marginLeft: 5,
    width: 6,
    height: 12,
  } as ImageStyle,
  separator: {
    width: '100%',
  } as ViewStyle,
});

export interface TypesItemProps extends TouchableProps {
  iconSource?: ImageSourcePropType;
  textStyle?: StyleProp<TextStyle>;
  active?: boolean;
  last?: boolean;
  title?: string | React.ReactNode;
  ad?: React.ReactNode;
  enabled?: boolean;
}

export interface TypesItemState {}

export default class TypesItem extends React.Component<
  TypesItemProps,
  TypesItemState
> {
  render() {
    const {
      ad,
      iconSource,
      active,
      last,
      title,
      onPress,
      textStyle,
      children,
      enabled = true,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'typesitem'}
        style={styles.container}
        onPress={enabled ? onPress : undefined}
        {...props}
      >
        <View style={styles.info}>
          <View style={{ height: 32 }}>
            {iconSource && (
              <Image
                style={styles.icon}
                accessibilityLabel={'typesitem_image_icon'}
                source={iconSource}
              />
            )}
          </View>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'typesitem_text_name'}
              style={[
                styles.nameText,
                textStyle,
                !enabled && { color: Colors.grey3 },
              ]}
            >
              {title}
            </Text>
            {Config.settings.transfersAdCommission && ad}
          </View>
          {children}
          {active && (
            <Image
              accessibilityLabel={'typesitem_image_more_icon'}
              style={[styles.moreIcon, !enabled && { tintColor: Colors.grey3 }]}
              source={require('../../assets/images/arrow-icon.png')}
            />
          )}
        </View>
        {!last && <Separator style={styles.separator} />}
      </Touchable>
    );
  }
}
