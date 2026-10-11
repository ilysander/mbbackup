import * as React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Image,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';

export interface ItemEnrollErrorProps extends ViewProps {
  description: string;
  descriptionStyle: StyleProp<TextStyle>;
  imageStyle: StyleProp<ImageStyle>;
  itemEnrollErrorStyle: StyleProp<ViewStyle>;
  imageSource: ImageSourcePropType;
}

export interface ItemEnrollErrorState {}

export default class ItemEnrollError extends React.PureComponent<
  ItemEnrollErrorProps,
  ItemEnrollErrorState
> {
  render() {
    const {
      description,
      descriptionStyle,
      imageStyle,
      itemEnrollErrorStyle,
      imageSource,
    } = this.props;
    return (
      <View style={itemEnrollErrorStyle}>
        <Image style={imageStyle} source={imageSource} />
        <Text
          accessibilityLabel={`itemennrollerror_text_item`}
          style={descriptionStyle}
        >
          {description}
        </Text>
      </View>
    );
  }
}
