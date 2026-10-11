import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import { A, AnalyticsEvent, K } from '../../resources/analytics';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { TextError, Touchable } from '../ui';
import SelectAccountModal, {
  SelectAccountModalProps,
} from './SelectAccountModal';
import { AccountItemSavingsAll } from '../../api/backend/response/Execute';
import { setEventValue } from '../../resources/analytics/AnalyticsEvent';

const styles = StyleSheet.create({
  container: {
    minHeight: Platform.OS === 'android' ? 50 : 40,
    justifyContent: 'center',
  } as ViewStyle,
  containerTouchable: {
    marginTop: 4,
    backgroundColor: Colors.grey1,
    borderRadius: 12,
    borderColor: Colors.grey2,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    minHeight: Platform.OS === 'android' ? 50 : 40,
  } as ViewStyle,
  info: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  options: {
    alignItems: 'flex-start',
  } as ViewStyle,
  balanceText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 18,
  } as TextStyle,
  nameText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  titleText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  placeholderText: {
    ...Font(),
    color: Colors.grey4,
    fontSize: 14,
  } as TextStyle,

  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  accountContainer: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  textError: {
    marginTop: 10,
  } as TextStyle,
  moreIcon: {
    width: 18,
    height: 10,
    marginRight: 4,
    tintColor: Colors.grey3,
  } as ImageStyle,
});

export interface AccountSelectorProps extends SelectAccountModalProps {
  disabled?: boolean;
  values: AccountItemSavingsAll[];
  selectedIndex: number;
  title?: string;
  readOnly?: boolean;
  placeholder?: string;
  onPress?: (index: number) => void;
  panelStyle?: StyleProp<ViewStyle>;
  accessibilityLabel: string | any;
  onCloseModal?: () => void;
}

export interface AccountSelectorState {
  showSelector: boolean;
  errorMessage?: string;
}

export default class AccountSelector extends React.Component<
  AccountSelectorProps,
  AccountSelectorState
> {
  static defaultProps = {
    values: [],
    selectedIndex: -1,
    title: '',
    readOnly: false,
    disabled: false,
  };

  state: AccountSelectorState = {
    showSelector: false,
    errorMessage: '',
  };

  toggle = () => {
    if (!this.props.disabled) {
      this.setState({ showSelector: !this.state.showSelector });
      const { onCloseModal } = this.props;
      if (onCloseModal) {
        onCloseModal();
      }
    }
  };

  openModal = () => {
    const { title, accessibilityLabel } = this.props;
     setEventValue(accessibilityLabel, title)
    const label = K[accessibilityLabel]
    AnalyticsEvent.trackEvent('virtualEventApp', label)

    const accessibilityLabelModal = accessibilityLabel + '_modal'
     setEventValue(accessibilityLabelModal, L.selectaccountmodal_title)
    const label_modal = K[accessibilityLabelModal]
    AnalyticsEvent.trackEvent('virtualEventApp', label_modal)
    AnalyticsEvent.track(A.accountselector_touchable_modal_open);
    if (!this.props.disabled) {
      this.setState({ showSelector: !this.state.showSelector });
    }
  };

  getBalance = (item: any) => {
    const { currency, availableBalance } = item;
    return Amount.format(availableBalance, currency);
  };

  getActiveOpacity = () => {
    const { readOnly, disabled } = this.props;
    return readOnly || disabled ? 1 : 0.2;
  };

  setError = (value?: string) => {
    this.setState({ errorMessage: value });
  };
  clearError = () => {
    this.setError();
  };

  render() {
    const {
      selectedIndex,
      values,
      title,
      disabled,
      placeholder,
      onPress,
      panelStyle,
      style,
      readOnly,
      accessibilityLabel,
      ...props
    } = this.props;
    const { showSelector, errorMessage } = this.state;
    const validSelectedIndex = selectedIndex > -1;
    const value = validSelectedIndex ? values[selectedIndex] : undefined;
    const isSelected = validSelectedIndex && !!value;

    return [
      <SelectAccountModal
        key={'modal'}
        accessibilityLabel={'accountselector_modal'}
        visible={showSelector}
        onPressItem={onPress}
        values={values}
        placeholder={placeholder}
        onClose={this.toggle}
        {...props}
      />,
      <View
        key={'panel'}
        style={style}
        accessibilityLabel={accessibilityLabel || 'accountselector_container'}
      >
        <View style={styles.container}>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'accountselector_text_name'}
              style={styles.titleText}
            >
              {title}
            </Text>
          </View>

          <Touchable
            accessibilityLabel={accessibilityLabel ? accessibilityLabel : 'accountselector_open'}
            onPress={!readOnly ? this.openModal : undefined}
            style={[!readOnly && styles.containerTouchable]} //
            activeOpacity={this.getActiveOpacity()}
          >
            <View style={styles.info}>
              {isSelected && (
                <View style={styles.accountContainer}>
                  <Text
                    accessibilityLabel={'accountselector_text_name'}
                    style={styles.nameText}
                  >
                    {Sanitizer.getProductTitle(value)}
                  </Text>
                  <View style={styles.options}>
                    <Text
                      accessibilityLabel={'accountselector_text_balance'}
                      style={styles.balanceText}
                    >
                      {this.getBalance(value)}
                    </Text>
                    <Text
                      accessibilityLabel={
                        'accountselector_text_balance_description'
                      }
                      style={styles.nameText}
                    >
                      {L.accountselector_text_balance_description}
                    </Text>
                  </View>
                </View>
              )}
              {!isSelected && (
                <Text
                  accessibilityLabel={'accountselector_text_placeholder'}
                  style={styles.placeholderText}
                >
                  {L.accountselector_text_placeholder}
                </Text>
              )}
            </View>
            {!readOnly && ( //
              <Image
                style={styles.moreIcon}
                resizeMode={'contain'}
                source={require('../../assets/images/selector-dots.png')}
              />
            )}
          </Touchable>
        </View>

        {!!errorMessage && (
          <TextError style={styles.textError}>{errorMessage}</TextError>
        )}
      </View>,
    ];
  }
}
