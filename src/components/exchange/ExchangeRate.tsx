import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import API from '../../api';
import Colors from '../../resources/constants/Colors';
import Currencies from '../../resources/constants/Currencies';
import Font from '../../resources/functions/Font';
import Validate from '../../resources/functions/Validate';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import { Amount } from '../../resources/money';
import { AlertEvent } from '../alert/AlertManager';
import Features from '../../resources/remote/Features';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  } as ViewStyle,
  containerCentered: {
    alignSelf: 'center',
  } as ViewStyle,
  actionText: {
    ...Font(),
    fontSize: 13,
    lineHeight: 16,
    color: Colors.grey5,
  } as TextStyle,
  accentText: {
    color: Colors.accentDark,
  } as TextStyle,
  actionTextBold: {
    ...Font({ weight: 'Bold' }),
    fontSize: 13,
  } as TextStyle,
});

const TAG = '[ExchangeRate]';

export interface ExchangeRateProps extends ViewProps {
  label?: string;
  centered?: boolean;
  style?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel: string;
  accent?: boolean;
}

export interface ExchangeRateState {
  isLoading: boolean;
  rate: any;
}

export default class ExchangeRate extends React.Component<
  ExchangeRateProps,
  ExchangeRateState
> {
  static defaultProps = {
    accent: false,
  };

  state: ExchangeRateState = {
    isLoading: true,
    rate: {},
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      const response = await API.Execute.widgetsExchangeRates();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const rates = response.body.data.rates || [];
      const rate = rates[0] || {};
      this.setState({ rate });
    } catch (e) {
      Log.exception(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  getSale = () => {
    if (!Features.isAllowedTo('ExchangeRate')) {
      return 1;
    }
    const { rate } = this.state;
    return rate.sale;
  };

  getPurchase = () => {
    if (!Features.isAllowedTo('ExchangeRate')) {
      return 1;
    }
    const { rate } = this.state;
    return rate.purchase;
  };

  render() {
    const { rate } = this.state;
    const {
      label,
      accent,
      style,
      centered,
      textStyle,
      accessibilityLabel,
      ...props
    } = this.props;
    const options = {
      precision: 3,
      format: '%s%v',
    };

    if (!Features.isAllowedTo('ExchangeRate')) {
      return null;
    }
    return (
      <View
        accessibilityLabel={accessibilityLabel || 'exchangerate'}
        style={[styles.container, centered && styles.containerCentered, style]}
        {...props}
      >
        {rate && rate.sale && (
          <View>
            <Text
              style={[
                styles.actionText,
                accent && styles.accentText,
                textStyle,
              ]}
              accessibilityLabel={'exchangerate_label'}
            >
              {typeof label !== 'undefined' ? label : L.exchangerate_label}
            </Text>
            <Text
              style={[
                styles.actionText,
                accent && styles.accentText,
                textStyle,
              ]}
              accessibilityLabel={'exchangerate_text'}
            >
              <Text accessibilityLabel={'exchangerate_purchase_label'}>
                {L.exchangerate_purchase_label}
              </Text>{' '}
              <Text
                accessibilityLabel={'exchangerate_purchase_value'}
                style={styles.actionTextBold}
              >
                {Amount.format(rate.purchase, Currencies.PEN.label, options)}
              </Text>
              <Text accessibilityLabel={'exchangerate_purchase_value'}>
                {' - '}
              </Text>
              <Text accessibilityLabel={'exchangerate_sale_label'}>
                {L.exchangerate_sale_label}
              </Text>{' '}
              <Text
                accessibilityLabel={'exchangerate_sale_value'}
                style={styles.actionTextBold}
              >
                {Amount.format(rate.sale, Currencies.PEN.label, options)}
              </Text>
            </Text>
          </View>
        )}
      </View>
    );
  }
}
