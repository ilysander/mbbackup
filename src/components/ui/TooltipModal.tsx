import * as React from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  Insets,
  StyleProp,
} from 'react-native';
import { AnalyticsLabelsType } from '../../resources/analytics';
import Alert, { AlertProps } from './Alert';
import ButtonImage from './ButtonImage';

type AlertSingleProps = Exclude<AlertProps, 'accessibilityLabel'>;

export interface TooltipModalProps extends AlertSingleProps {
  onChange?: () => void;
  imageStyle?: StyleProp<ImageStyle>;
  hitSlop?: Insets;
  imageSource?: ImageSourcePropType;
  /**
   * es obligatorio que `accessibilityLabel` este agregado en `AnalyticsLabels`
   */
  accessibilityLabel: AnalyticsLabelsType;
}

export interface TooltipModalState {
  isVisible: boolean;
}

export default class TooltipModal extends React.Component<
  TooltipModalProps,
  TooltipModalState
> {
  static defaultProps = {
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  };

  state: TooltipModalState = {
    isVisible: false,
  };

  buttonRef!: ButtonImage | null;

  toggle = () => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange();
    }
    this.setState({ isVisible: true });
  };

  close = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const {
      imageStyle,
      hitSlop,
      imageSource,
      accessibilityLabel,
      style,
      ...props
    } = this.props;
    const { isVisible } = this.state;
    return [
      <Alert
        key={'modal'}
        accessibilityLabel={'tooltipmodal'}
        visible={isVisible}
        onClose={this.close}
        {...props}
      />,
      <ButtonImage
        accessibilityLabel={accessibilityLabel}
        key={'button'}
        hitSlop={hitSlop}
        ref={ref => {
          this.buttonRef = ref;
        }}
        onPress={this.toggle}
        imageStyle={imageStyle}
        style={style}
        imageSource={imageSource}
      />,
    ];
  }
}
