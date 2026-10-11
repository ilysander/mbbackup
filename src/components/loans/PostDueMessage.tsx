import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  } as ViewStyle,
  adText: {
    color: Colors.danger,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 13,
  } as TextStyle,
  adAmount: {
    color: Colors.danger,
    ...Font({ weight: 'Bold' }),
    fontSize: 13,
  } as TextStyle,
});

export interface PostDueMessageProps extends ViewProps {
  pastDueInstallments?: number;
  pastDueAmount?: number;
}

export interface PostDueMessageState {}

export default class PostDueMessage extends React.Component<
  PostDueMessageProps,
  PostDueMessageState
> {
  state: PostDueMessageState = {};

  render() {
    const { pastDueInstallments, pastDueAmount } = this.props;
    if (!pastDueInstallments) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.adText}>
          {L.loanresumen_postDueMessage_text_startphrase} {pastDueInstallments}{' '}
          {Sanitizer.formatPhrase(
            pastDueInstallments,
            L.loanresumen_postDueMessage_text_individualphrase,
            L.loanresumen_postDueMessage_text_pluralphrase
          )}{' '}
          <Text style={styles.adAmount}>
            {L.loanresumen_postDueMessage_text_currencysymbol}
            {pastDueAmount}
          </Text>
        </Text>
      </View>
    );
  }
}
