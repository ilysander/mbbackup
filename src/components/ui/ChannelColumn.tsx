import * as React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet } from 'react-native';
import Colors from '../../resources/constants/Colors';
import { L } from '../../resources/language';
import ItemDescription from './ItemDescription';
const styles = StyleSheet.create({
  columnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  itemTextContainer: {
    padding: 10,
    paddingHorizontal: 20,
  } as ViewStyle,
  itemBodyContainer: {
    borderColor: Colors.primary,
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 20,
  } as ViewStyle,
  itemBodyContainerLast: {
    paddingTop: 15,
    paddingBottom: 20,
  } as ViewStyle,
});
export interface ChannelColumnProps extends ViewProps {
  allChannelsReady: boolean;
}
export interface ChannelColumnState {}
export default class ChannelColumn extends React.PureComponent<
  ChannelColumnProps,
  ChannelColumnState
> {
  render() {
    const { accessibilityLabel, allChannelsReady } = this.props;
    return (
      <View accessibilityLabel={accessibilityLabel}>
        <ItemDescription
          headerLabelDescription={`${L.channelcolumn_itemdescription_channeltypecajero} ${L.channelcolumn_itemdescription_channelnamebcp}`}
          firstDesPartA={
            L.channelcolumn_itemdescription_descriptioncajerobcppart1
          }
          firstDesPartB={
            L.channelcolumn_itemdescription_descriptioncajerobcppart2
          }
          accessibilityLabel={
            'channelcolumn_itemdescription_descriptioncajerobcp'
          }
          secondLabelDescription={
            L.channelcolumn_itemdescription_decriptionsecond
          }
          itemTextContainer={styles.itemTextContainer}
          itemBodyContainer={styles.itemBodyContainer}
        />
        {!!allChannelsReady && (
          <ItemDescription
            headerLabelDescription={`${L.channelcolumn_itemdescription_channeltypeagent} ${L.channelcolumn_itemdescription_channelnamebcp}`}
            firstDesPartA={
              L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart1
            }
            firstDesPartB={
              L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart2
            }
            firstDesPartC={
              L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart3
            }
            firstDesPartD={
              L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart4
            }
            firstDesPartE={
              L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart5
            }
            accessibilityLabel={
              'channelcolumn_itemdescription_descriptionagentebcp'
            }
            itemTextContainer={styles.itemTextContainer}
            itemBodyContainer={styles.itemBodyContainer}
          />
        )}
        <ItemDescription
          headerLabelDescription={`${L.channelcolumn_itemdescription_channeltypeagent} ${L.channelcolumn_itemdescription_channelnamekasnet}`}
          firstDesPartA={
            L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart1
          }
          firstDesPartB={
            L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart2
          }
          firstDesPartC={
            L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart3
          }
          firstDesPartD={
            L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart4
          }
          firstDesPartE={
            L.channelcolumn_itemdescription_descriptionagentebcpykasnetpart5
          }
          accessibilityLabel={
            'channelcolumn_itemdescription_descriptionagentekasnet'
          }
          itemTextContainer={styles.itemTextContainer}
          itemBodyContainer={styles.itemBodyContainer}
        />
        <ItemDescription
          headerLabelDescription={
            L.channelcolumn_itemdescription_descriptionchanneltypemibanco
          }
          firstDesPartB={
            L.channelcolumn_itemdescription_descriptionchanneltypemibancopart2
          }
          accessibilityLabel={
            'channelcolumn_itemdescription_descriptionchanneltypemibanco'
          }
          itemTextContainer={styles.itemTextContainer}
          itemBodyContainer={styles.itemBodyContainerLast}
        />
      </View>
    );
  }
}
