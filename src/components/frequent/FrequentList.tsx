import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import TransferType from '../../resources/constants/TransferType';
import { FlatList, Separator } from '../ui';
import FrequentItem from './FrequentItem';
import Session from '../../api/Session';
import { Emitter } from '../../resources/listeners';
import { AlertEvent } from '../alert/AlertManager';
import Features from '../../resources/remote/Features';
import { NavigationProp } from '@react-navigation/native';

const styles = StyleSheet.create({
  content: {
    padding: 0,
  } as ViewStyle,
});

export interface ListHeaderProps {
  list: any[];
  isLoading: boolean;
  accessibilityLabel: string;
}

export interface FrequentListProps {
  navigation: NavigationProp<any, any>;
  accounts: any[];
  serviceAvailability: () => Promise<boolean | undefined>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListHeaderComponent?: (props: ListHeaderProps) => any;
  list: any[];
  accessibilityLabel: string;
}

export interface FrequentListState {
  isLoading: boolean;
}
const TAG = '[FrequentList]';
export default class FrequentList extends React.Component<
  FrequentListProps,
  FrequentListState
> {
  state: FrequentListState = {
    isLoading: false,
  };

  goToFrequent = async (contact: any) => {
    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'goToFrequent',
        e: '',
      });
      return;
    }
    const { navigation, accounts, serviceAvailability } = this.props;
    if (
      (contact.type === TransferType.IMMEDIATE ||
        contact.type === TransferType.LOCAL) &&
      Features.isAllowedTo('TransfersOtherBanks')
    ) {
      const serviceAvailable = await serviceAvailability();
      if (serviceAvailable) {
        navigation.navigate('TransfersOtherBanksChoose', {
          accounts,
          contact,
        });
      }
      return;
    }
    if (
      contact.type === TransferType.INTER &&
      Features.isAllowedTo('TransfersOtherAccounts')
    ) {
      navigation.navigate('TransfersOtherAccountsChoose', {
        accounts,
        contact,
      });
      return;
    }
  };

  renderSeparator = () => {
    return (
      <View style={{ marginHorizontal: 20 }}>
        <Separator />
      </View>
    );
  };

  render() {
    const isLoading = false;
    const {
      contentContainerStyle,
      navigation,
      ListHeaderComponent,
      list,
      ...props
    } = this.props;
    return (
      <FlatList
        {...props}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        ItemSeparatorComponent={this.renderSeparator}
        data={list}
        extraData={{ isLoading, total: list ? list.length : 0 }}
        renderItem={({ item }) => (
          <FrequentItem
            accessibilityLabel={'frequentlist_item'}
            item={item}
            navigation={navigation}
            onPress={() => {
              this.goToFrequent(item);
            }}
          />
        )}
        keyExtractor={item => item.idFrequentContact.toString()}
      />
    );
  }
}
