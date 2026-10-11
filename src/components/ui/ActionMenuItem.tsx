import * as React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  } as ViewStyle,
  icon: {
    width: 15,
    height: 15,
    marginRight: 8,
    marginLeft: 5,
    tintColor: Colors.grey4,
  } as ImageStyle,
  titleText: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 12,
    flex: 1,
    color: Colors.grey6,
  } as TextStyle,
  border: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey2,
  } as ViewStyle,
  moreIcon: {
    tintColor: Colors.grey4,
    marginLeft: 5,
    width: 6,
    height: 12,
  } as ImageStyle,
});

export interface ActionMenuItemProps extends TouchableProps {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  imageSource?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  useBorder?: boolean;
  showMore?: boolean;
}

export interface ActionMenuItemState { }

export default class ActionMenuItem extends React.Component<
  ActionMenuItemProps,
  ActionMenuItemState
> {
  static defaultProps = {
    showMore: false,
  };

  render() {
    const {
      title,
      titleStyle,
      imageSource,
      imageStyle,
      useBorder,
      style,
      showMore,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'actionmenuitem'}
        analyticsParams={title ? title : undefined}
        style={[styles.container, useBorder && styles.border, style]}
        {...props}
      >
        {imageSource && (
          <Image
            accessibilityLabel={'actionmenuitem_image'}
            source={imageSource}
            resizeMode={'contain'}
            style={[styles.icon, imageStyle]}
          />
        )}
        {title && (
          <Text
            accessibilityLabel={'actionmenuitem_label'}
            style={[styles.titleText, titleStyle]}
          >
            {title}
          </Text>
        )}
        {showMore && (
          <Image
            accessibilityLabel={'actionmenuitem_more_icon'}
            source={require('../../assets/images/arrow-icon.png')}
            resizeMode={'contain'}
            style={styles.moreIcon}
          />
        )}
      </Touchable>
    );
  }
}
