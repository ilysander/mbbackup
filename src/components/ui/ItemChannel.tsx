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

export interface ItemChannelProps extends ViewProps {
  channelType: string;
  channelName: string;
  itemChannel?: StyleProp<ViewStyle>;
  channelTypeLabel?: StyleProp<TextStyle>;
  channelNameLabel?: StyleProp<TextStyle>;
  accessibilityLabel: string;
  itemChannelImage?: StyleProp<ImageStyle>;
  imageSource: ImageSourcePropType;
}

export interface ItemChannelState {}

export default class ItemChannel extends React.PureComponent<
  ItemChannelProps,
  ItemChannelState
> {
  render() {
    const {
      channelName,
      channelType,
      itemChannel,
      channelTypeLabel,
      channelNameLabel,
      itemChannelImage,
      imageSource,
      accessibilityLabel,
    } = this.props;
    return (
      <View style={itemChannel} accessibilityLabel={accessibilityLabel}>
        <Image style={itemChannelImage} source={imageSource} />
        <Text
          accessibilityLabel={`ItemChannel_text_type`}
          style={channelTypeLabel}
        >
          {channelType}
        </Text>
        <Text
          accessibilityLabel={`ItemChannel_text_item`}
          style={channelNameLabel}
        >
          {channelName}
        </Text>
      </View>
    );
  }
}
