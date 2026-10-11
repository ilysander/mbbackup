import * as React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';
import Touchable, { TouchableProps } from './Touchable';

export interface ToggleImageProps extends TouchableProps {
  defaultValue?: boolean;
  onChangeValue?: (active: boolean) => void;
  imageStyle?: StyleProp<ImageStyle>;
  imageSourceActive: ImageSourcePropType;
  imageSource: ImageSourcePropType;
}

export interface ToggleImageState {
  active: boolean;
}

export default class ToggleImage extends React.Component<
  ToggleImageProps,
  ToggleImageState
> {
  state: ToggleImageState = {
    active: false,
  };

  componentDidMount() {
    const { defaultValue } = this.props;
    typeof defaultValue === 'boolean' &&
      this.setState({ active: defaultValue });
  }

  getValue = () => {
    return this.state.active;
  };
  setValue = (active: boolean) => {
    this.setState({ active });
    const { onChangeValue } = this.props;
    if (typeof onChangeValue === 'function') {
      onChangeValue(active);
    }
  };

  toggle = () => {
    const { onChangeValue } = this.props;
    const newValue = !this.state.active;
    this.setState({ active: newValue });

    if (typeof onChangeValue === 'function') {
      onChangeValue(newValue);
    }
  };

  render() {
    const { active } = this.state;
    const {
      children,
      imageStyle,
      imageSourceActive,
      imageSource,
      accessibilityLabel,
      ...props
    } = this.props;

    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'toggleimage'}
        onPress={this.toggle}
        {...props}
      >
        {active && (
          <Image
            accessibilityLabel={'toggleimage_active'}
            style={imageStyle}
            resizeMode={'contain'}
            source={imageSourceActive}
          />
        )}
        {!active && (
          <Image
            accessibilityLabel={'toggleimage_inactive'}
            style={imageStyle}
            resizeMode={'contain'}
            source={imageSource}
          />
        )}
        {children}
      </Touchable>
    );
  }
}
