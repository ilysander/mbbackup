import * as React from 'react';
import {
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  ImageStyle,
  StyleSheet,
} from 'react-native';
import ItemChannel from '../ui/ItemChannel';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  rowTotemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  itemChannel: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    marginTop: 4,
    paddingBottom: 12,
  } as ViewStyle,
  itemChannelImage: {
    width: 31,
    height: 31,
    resizeMode: 'contain',
    tintColor: Colors.accentDark,
  } as ImageStyle,
  channelType: {
    ...Font(),
    marginTop: 5,
    textAlign: 'center',
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  channelItem: {
    ...Font(),
    marginTop: -3,
    textAlign: 'center',
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
});

export interface ChannelRowProps extends ViewProps {
  allChannelsReady: boolean;
}

export interface ChannelRowState {}

export default class ChannelRow extends React.PureComponent<
  ChannelRowProps,
  ChannelRowState
> {
  render() {
    const { accessibilityLabel, allChannelsReady } = this.props;
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        style={styles.rowTotemContainer}
      >
        <ItemChannel
          channelType={L.channelrow_itemchannel_itemtypecajero}
          channelName={L.channelrow_itemchannel_namebcp}
          accessibilityLabel={'channelrow_itemchannel_itemcajerobcp'}
          imageSource={require('../../assets/images/icon-atm.png')}
          itemChannelImage={styles.itemChannelImage}
          itemChannel={styles.itemChannel}
          channelTypeLabel={styles.channelType}
          channelNameLabel={styles.channelItem}
        />
        {!!allChannelsReady && (
          <ItemChannel
            channelType={L.channelrow_itemchannel_itemtypeagente}
            channelName={L.channelrow_itemchannel_namebcp}
            accessibilityLabel={'channelrow_itemchannel_itemtypeagentebcp'}
            imageSource={require('../../assets/images/icon-agente.png')}
            itemChannelImage={styles.itemChannelImage}
            itemChannel={styles.itemChannel}
            channelTypeLabel={styles.channelType}
            channelNameLabel={styles.channelItem}
          />
        )}
        <ItemChannel
          channelType={L.channelrow_itemchannel_itemtypeagente}
          channelName={L.channelrow_itemchannel_namekasnet}
          accessibilityLabel={'channelrow_itemchannel_itemtypeagentekasnet'}
          imageSource={require('../../assets/images/icon-agente.png')}
          itemChannelImage={styles.itemChannelImage}
          itemChannel={styles.itemChannel}
          channelTypeLabel={styles.channelType}
          channelNameLabel={styles.channelItem}
        />
      </View>
    );
  }
}
