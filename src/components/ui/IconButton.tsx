import IconButtonTouchable, { TouchableProps } from './IconButtonTouchable';
import CardView from './CardView';
import {
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';
import * as React from 'react';
import Colors from '../../resources/constants/Colors';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 128,
  } as ViewStyle,
  image: {
    marginHorizontal: 20,
    height: 60,
    width: 60,
    tintColor: Colors.accent,
  } as ImageStyle,
});

export interface IconButtonProps extends TouchableProps {
  style?: ViewStyle;
  source: ImageSourcePropType;
}
export default class IconButton extends React.PureComponent<IconButtonProps> {
  render() {
    const {
      style,
      children,
      source,
      onPress,
      accessibilityLabel,
      ...props
    } = this.props;

    return (
      <IconButtonTouchable
        underlayColor={Colors.transparent}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        {...props}
      >
        <CardView
          accessibilityLabel={'iconbutton_cardview'}
          style={[styles.container, style]}
        >
          <Image
            accessibilityLabel={'iconbutton_image'}
            resizeMode={'contain'}
            resizeMethod={'scale'}
            source={source}
            style={styles.image}
          />

          {children}
        </CardView>
      </IconButtonTouchable>
    );
  }
}
