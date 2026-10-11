import * as React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Loading from './Loading';
import Touchable, { TouchableProps } from './Touchable';

export interface ButtonImageProps extends TouchableProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  imageSource?: ImageSourcePropType;
  loadingColor?: string;
  imageStyle?: StyleProp<ImageStyle>;
}

export interface ButtonImageState { }

export default class ButtonImage extends React.Component<
  ButtonImageProps,
  ButtonImageState
> {
  buttonRef!: TouchableOpacity | null;

  onPress = (event: GestureResponderEvent) => {
    const { onPress, isLoading, isDisabled } = this.props;
    if (isDisabled || isLoading) {
      return;
    }
    if (typeof onPress === 'function') {
      onPress(event);
    }
  };

  getButtonRef() {
    return this.buttonRef;
  }

  render() {
    const {
      imageSource,
      loadingColor,
      imageStyle,
      onPress,
      isLoading,
      accessibilityLabel,
      analyticsParams,
      ...props
    } = this.props;
    const color = loadingColor || Colors.primary;
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'buttonimage'}
        ref={ref => {
          this.buttonRef = ref;
        }}
        {...props}
        onPress={onPress ? this.onPress : undefined}
        analyticsParams={analyticsParams}
      >
        {!isLoading && imageSource && (
          <Image
            accessibilityLabel={'buttonimage_image'}
            style={imageStyle}
            source={imageSource}
          />
        )}
        {isLoading && (
          <Loading
            accessibilityLabel={'buttonimage_loading'}
            size={'small'}
            color={color}
          />
        )}
      </Touchable>
    );
  }
}
