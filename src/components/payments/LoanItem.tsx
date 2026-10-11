import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { CardView, TextError, Touchable } from '../ui';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {} as ViewStyle,
  info: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  } as ViewStyle,
  button: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  } as ViewStyle,
  nameText: {
    ...Font({ weight: 'Black' }),
    color: Colors.secondary,
    fontSize: 14,
  } as TextStyle,
  subtitleText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  bodyContainer: {
    flexDirection: 'row',
  } as ViewStyle,
  leftContainer: {
    flex: 1,
  } as ViewStyle,
  loanText: {
    ...Font({ weight: 'Black' }),
    color: Colors.secondary,
    fontSize: 20,
    lineHeight: 22,
  } as TextStyle,
  loanSubtitleText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
    lineHeight: 13,
  } as TextStyle,
  moreIcon: {
    tintColor: Colors.secondary,
    marginRight: 3,
    width: 9,
    height: 15.7,
  } as ImageStyle,
  headerContainer: {
    marginBottom: 2,
  } as ViewStyle,
});

export interface LoanItemProps extends TouchableProps {
  navigation: NavigationProp<any, any>;
  item: any;
  arrow?: boolean;
}

export interface LoanItemState {
  errorMessage?: string;
}

export default class LoanItem extends React.Component<
  LoanItemProps,
  LoanItemState
> {
  static defaultProps = {
    arrow: true,
  };
  state: LoanItemState = {
    errorMessage: '',
  };
  onPress = () => {
    const { item, navigation } = this.props;
    navigation.navigate('Loan', { item });
  };
  setError = (value?: string) => {
    this.setState({ errorMessage: value });
  };
  clearError = () => {
    this.setError(undefined);
  };

  shouldBreakTitle = () => {
    let result = false;
    const { item } = this.props;
    if (
      item.loanNumber.length >= 14 ||
      parseFloat(item.loanAmount).toFixed().length > 5
    ) {
      result = true;
    }

    return result;
  };

  render() {
    const { item, arrow, accessibilityLabel, ...props } = this.props;
    const { errorMessage } = this.state;
    const breakTitle = this.shouldBreakTitle();

    return (
      <View accessibilityLabel={'loanitem'} style={styles.container}>
        <Touchable
          accessibilityLabel={accessibilityLabel || 'loanitem_detail'}
          onPress={this.onPress}
          {...props}
        >
          <CardView>
            <View style={styles.button}>
              <View style={styles.info}>
                <View style={styles.headerContainer}>
                  <Text
                    accessibilityLabel={'loanitem_text_name'}
                    style={styles.nameText}
                    numberOfLines={1}
                    textBreakStrategy={'simple'}
                  >
                    {Sanitizer.cleanProductLabel(item.shortLabel, item)}
                  </Text>
                </View>
                <View style={styles.bodyContainer}>
                  <View style={styles.leftContainer}>
                    <Text
                      accessibilityLabel={'loanitem_text_amount'}
                      style={styles.loanText}
                    >
                      {Amount.format(item.loanAmount, item.currency)}
                    </Text>
                    <Text
                      accessibilityLabel={'loanitem_text_amount_description'}
                      style={styles.loanSubtitleText}
                    >
                      {L.loanitem_text_amount_description}
                    </Text>
                    <Text
                      accessibilityLabel={'loanitem_text_number'}
                      style={styles.subtitleText}
                      textBreakStrategy={'simple'}
                    >
                      {L.loanitem_text_number_label}
                      {breakTitle ? '\n' : ' '}
                      {item.loanNumber}
                    </Text>
                  </View>
                </View>
              </View>
              <Image
                accessibilityLabel={'loanitem_image_more_icon'}
                style={[styles.moreIcon, !arrow && { opacity: 0 }]}
                source={require('../../assets/images/more-icon.png')}
              />
            </View>
          </CardView>
        </Touchable>
        {!!errorMessage && <TextError>{errorMessage}</TextError>}
      </View>
    );
  }
}
