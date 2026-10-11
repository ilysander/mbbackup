import * as React from 'react';
import {
  Text,
  TextStyle,
  View,
  ViewStyle,
  Image,
  ImageStyle,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Linking } from '../../resources/functions';
import { L } from '../../resources/language';
import TypesItem from '../types/TypesItem';
import { CardView, Loading, Button } from '../ui';
import Session from '../../api/Session';
import { Emitter } from '../../resources/listeners';
import { AlertEvent } from '../alert/AlertManager';
import Features from '../../resources/remote/Features';
import Config from '../../Config';
import Log from '../../resources/log/Log';
import { NavigationProp } from '@react-navigation/native';

const styles = StyleSheet.create({
  highlightLine: {
    tintColor: Colors.accent,
    marginHorizontal: 3,
    width: 9,
    height: 16,
  } as ImageStyle,
  adContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  adTitle: {
    ...Font({ weight: 'Bold' }),
    color: Colors.accentDark,
    textAlign: 'center',
    fontSize: 14,
  } as TextStyle,
});
export interface TransfersTypesProps {
  accessibilityLabel: string;
  navigation: NavigationProp<any, any>;
  frequentContacts?: any[];
  accounts: any[];
  accountsWithCts: any[];
  serviceAvailability: () => Promise<boolean | undefined>;
}

export interface TransfersTypesState {
  isLoading: boolean;
}
const TAG = '[TransfersTypes]';
export default class TransfersTypes extends React.Component<
  TransfersTypesProps,
  TransfersTypesState
> {
  state: TransfersTypesState = {
    isLoading: false,
  };

  onPressMyAccounts = () => {
    const { accounts, navigation, accountsWithCts } = this.props;
    navigation.navigate('TransfersMyAccountsChoose', {
      accounts,
      accountsWithCts,
    });
  };

  onPressOtherAccounts = () => {
    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'onPressOtherAccounts',
        e: '',
      });
      return;
    }

    const { accounts, navigation } = this.props;
    navigation.navigate('TransfersOtherAccountsChoose', {
      accounts,
    });
  };

  onPressOtherBanksWeb = async () => {
    try {
      await Linking.openURL(Config.settings.transfersUrl);
    } catch (e) {
      Log.debug(TAG, 'onPressOtherBanksWeb', e);
    }
  };

  onPressOtherBanks = async () => {
    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'onPressOtherBanks',
        e: '',
      });
      return;
    }
    const {
      accounts,
      serviceAvailability,
      frequentContacts,
      navigation,
    } = this.props;
    const serviceAvailable = await serviceAvailability();
    if (serviceAvailable) {
      navigation.navigate('TransfersOtherBanksChoose', {
        accounts,
        frequentContacts,
      });
    }
  };
  adOtherBanks() {
    return (
      <View style={[styles.adContainer, { marginLeft: 8 }]}>
        <Image
          style={styles.highlightLine}
          source={require('../../assets/images/highlight-linear-left.png')}
        />
        <Text style={styles.adTitle}>
          {L.transferstypes_typesitem_ad_to_other_banks}
        </Text>
        <Image
          style={styles.highlightLine}
          source={require('../../assets/images/highlight-linear-right.png')}
        />
      </View>
    );
  }

  adOtherBanksWeb() {
    return (
      <View style={styles.adContainer}>
        <Image
          style={styles.highlightLine}
          source={require('../../assets/images/highlight-linear-left.png')}
        />
        <Text style={styles.adTitle}>
          {L.transferstypes_typesitem_ad_to_other_banks_web}
        </Text>
        <Image
          style={styles.highlightLine}
          source={require('../../assets/images/highlight-linear-right.png')}
        />
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;
    const { accounts, accessibilityLabel, accountsWithCts } = this.props;
    const hasAccounts = accounts && accounts.length > 0;
    const isAllowedToTransfersOtherBanks = Features.isAllowedTo(
      'TransfersOtherBanks'
    );
    const isAllowedToTransfersOtherBanksWeb = Features.isAllowedTo(
      'TransfersOtherBanksWeb'
    );
    return (
      <CardView
        style={{ paddingHorizontal: 20 }}
        accessibilityLabel={accessibilityLabel || 'transferstypes'}
      >
        {isLoading && !hasAccounts && (
          <Loading margin={'large'} size={'large'} color={Colors.primary} />
        )}
        <View>
          {(!hasAccounts || Config.features.EnableTransferCTS
            ? hasAccounts && accountsWithCts.length > 1
            : hasAccounts && accounts.length > 1) &&
            Features.isAllowedTo('TransfersMyAccounts') && (
              <TypesItem
                accessibilityLabel={'transferstypes_item_between_my_accounts'}
                active
                enabled={hasAccounts}
                title={
                  <Text>
                    {L.transferstypes_typesitem_title_between_my_accounts}
                    <Text>{L.transferstypes_typesitem_title_in_bold}</Text>
                  </Text>
                }
                onPress={this.onPressMyAccounts}
              />
            )}
          {Features.isAllowedTo('TransfersOtherAccounts') && (
            <TypesItem
              accessibilityLabel={'transferstypes_item_to_other_accounts'}
              active
              enabled={hasAccounts}
              title={
                <Text>
                  {L.transferstypes_typesitem_title_to_other_accounts}
                  <Text>{L.transferstypes_typesitem_title_in_bold}</Text>
                </Text>
              }
              onPress={this.onPressOtherAccounts}
            />
          )}
          {isAllowedToTransfersOtherBanks && (
            <TypesItem
              accessibilityLabel={'transferstypes_item_to_other_banks'}
              active
              enabled={hasAccounts}
              last={!isAllowedToTransfersOtherBanksWeb}
              title={L.transferstypes_typesitem_title_to_other_banks}
              onPress={this.onPressOtherBanks}
              ad={this.adOtherBanks()}
            />
          )}
          {isAllowedToTransfersOtherBanksWeb && (
            <TypesItem
              accessibilityLabel={'transferstypes_item_to_other_banks_web'}
              last
              enabled={hasAccounts}
              title={L.transferstypes_typesitem_title_to_other_banks_web}
              onPress={this.onPressOtherBanksWeb}
              ad={this.adOtherBanksWeb()}
            >
              <Button
                small
                accessibilityLabel={
                  'transferstypes_item_to_other_banks_web_go_to_web'
                }
                typeColor={'primaryLight'}
                disabled={!hasAccounts}
                title={L.paymentstypes_button_go_to_web}
              />
            </TypesItem>
          )}
        </View>
      </CardView>
    );
  }
}
