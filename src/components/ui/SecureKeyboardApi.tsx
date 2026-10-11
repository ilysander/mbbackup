import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Size } from '../../resources/dimensions';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import Loading from './Loading';
import Touchable from './Touchable';
import { Emitter } from '../../resources/listeners';
import ApiKeyboard from '../../api/backend/ApiKeyboard';
import { KeyboardUtil } from '../../resources/util';
import { Log } from '../../resources/log';

const styles = StyleSheet.create({
  keyOptionRemove: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  } as ViewStyle,
  keyOptionDecimalSeparator: {
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  keyOptionNext: {
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    flex: 1,
    padding: 0,
  } as ViewStyle,
  keyOptionHide: {
    backgroundColor: Colors.accentDark,
    justifyContent: 'center',
    flex: 1,
    padding: 0,
  } as ViewStyle,
  loading: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    height: '100%',
  } as ViewStyle,
  container: {
    backgroundColor: Colors.grey3,
    elevation: 3,
    paddingTop: 5,
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Size.getBottomOffset() + 5,
  } as ViewStyle,
  content: {
    margin: 10,
    marginTop: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 400,
  } as ViewStyle,
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowColor: Colors.shadow,
    shadowRadius: 2,
    shadowOpacity: 1.0,
    elevation: 2,
  } as ViewStyle,
  keyContainer: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  optionIcon: {
    width: 30,
    height: 30,
  } as ImageStyle,
  key: {
    flex: 1,
    padding: 10,
    margin: 6,
    backgroundColor: Colors.grey1,
    borderRadius: 6,
  } as ViewStyle,
  lastKey: {
    width: '96%',
  } as ViewStyle,
  containerOptionsKeys: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,
  containerLastLine: {
    flexDirection: 'row',
    width: '100%',
    height: 68,
  } as ViewStyle,
  keyText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey5,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 34,
  } as TextStyle,
  loadingText: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey5,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14,
  } as TextStyle,
  keyTextOption: {
    ...Font({ weight: 'Medium' }),
    color: Colors.white,
    fontSize: 16,
  } as TextStyle,
});

export interface SecureKeyboardApiProps extends ViewProps {
  onNext?: () => void;
  onBlur?: () => void;
  onKeyPressed: (key: string) => void;
  onRemoveKey?: () => void;
  onRemoveAll?: () => void;
  onDecimalSeparatorPressed?: () => void;
  type?: 'random' | 'amount' | 'api';

  onFocus?: () => void;
}

export interface SecureKeyboardApiState {
  isLoading: boolean;
  dictionary: string[];
}
const TAG = '[SecureKeyboardApi]';
export default class SecureKeyboardApi extends React.Component<
  SecureKeyboardApiProps,
  SecureKeyboardApiState
> {
  state: SecureKeyboardApiState = {
    isLoading: true,
    dictionary: [],
  };

  componentDidMount() {
    Emitter.on('onSecureKeyboardApi', this.setData);
    Emitter.on('onSecureKeyboardApiLoading', this.setLoading);
  }

  componentWillUnmount() {
    Emitter.off('onSecureKeyboardApiLoading', this.setLoading);
    Emitter.off('onSecureKeyboardApi', this.setData);
  }

  setLoading = () => {
    this.setState({isLoading:true})
  }

  setData = (dictionary:any[]) => {
    this.setState({ isLoading: false, dictionary });
  }

  static callApiKb = async(activity:string) => {
    try {
      const res = await ApiKeyboard.keyboardGenerateToken(activity);
      if (
        !res ||
        !res.body ||
        !res.body.data ||
        !res.body.data._keyboardToken
      ) {
        throw new Error('No se puede comunicar al servicio');
      }
      let keyboardToken = res.body.data._keyboardToken;
      const listDatas = keyboardToken.split('.');
      const tokenSecure = listDatas[1];
      const base64 = require('base-64');
      const tokenData = JSON.parse(base64.decode(tokenSecure));
      const positions = [...tokenData.positions];

      return {payload:res.body.data._keyboardToken,dictionary: positions};
    } catch (error) {
      Log.warn(TAG, 'callApiKb', error);
      KeyboardUtil.hide();
    }
    return ;
  }

  render() {
    const { dictionary, isLoading } = this.state;
    const {
      onNext,
      onBlur,
      style,
      onKeyPressed,
      onRemoveKey,
      onRemoveAll,
      onDecimalSeparatorPressed,
      type,
      ...props
    } = this.props;

    return (
      <View
        accessibilityLabel={'securekeyboard'}
        style={[styles.container, style]}
        {...props}
      >
        <View style={styles.content}>
          {isLoading && (
            <View
              style={styles.loading}
              accessibilityLabel={'securekeyboard_loading'}
            >
              <Loading size={'large'} color={Colors.primary} />
              <Text
                accessibilityLabel={'securekeyboard_loading_text'}
                style={styles.loadingText}
              >
                {L.securekeyboard_loading_text}
              </Text>
            </View>
          )}
          {!isLoading &&
            dictionary.map((key, index) => {
              return (
                <View key={'key_' + index} style={styles.keyContainer}>
                  <Touchable
                    onPress={() => {
                      onKeyPressed(key);
                    }}
                    style={[styles.key, styles.shadow]}
                    accessibilityLabel={('securekeyboard_key_' + key) as any}
                  >
                    <Text
                      style={styles.keyText}
                      allowFontScaling={false}
                      accessibilityLabel={'securekeyboard_key_text'}
                    >
                      {key}
                    </Text>
                  </Touchable>
                </View>
              );
            })}
          {!isLoading && (
            <View style={styles.containerLastLine}>
              <View
                style={{
                  width: type === 'amount' ? '40%' : '20%',
                  flexDirection: 'row',
                }}
              >
                <Touchable
                  onPress={onRemoveKey}
                  onLongPress={onRemoveAll}
                  style={[styles.key, styles.shadow, styles.keyOptionRemove]}
                  accessibilityLabel={'securekeyboard_removekey'}
                >
                  <Image
                    style={styles.optionIcon}
                    source={require('../../assets/images/backspace-icon.png')}
                  />
                </Touchable>
                {type === 'amount' && (
                  <Touchable
                    onPress={onDecimalSeparatorPressed}
                    style={[
                      styles.key,
                      styles.shadow,
                      styles.keyOptionDecimalSeparator,
                    ]}
                    accessibilityLabel={'securekeyboard_decimalseparator_key'}
                  >
                    <Text
                      accessibilityLabel={
                        'securekeyboard_key_text_decimalseparator'
                      }
                      allowFontScaling={false}
                      style={styles.keyText}
                    >
                      {L.securekeyboard_decimal_separator}
                    </Text>
                  </Touchable>
                )}
              </View>
              <View style={styles.containerOptionsKeys}>
                <Touchable
                  onPress={onBlur}
                  style={[
                    styles.key,
                    styles.lastKey,
                    styles.shadow,
                    styles.keyOptionHide,
                  ]}
                  accessibilityLabel={'securekeyboard_hide'}
                >
                  <Text
                    accessibilityLabel={'securekeyboard_hide_text'}
                    allowFontScaling={false}
                    style={[styles.keyText, styles.keyTextOption]}
                  >
                    {L.securekeyboard_hide.toUpperCase()}
                  </Text>
                </Touchable>
                <Touchable
                  onPress={onNext}
                  style={[
                    styles.key,
                    styles.lastKey,
                    styles.shadow,
                    styles.keyOptionNext,
                  ]}
                  accessibilityLabel={'securekeyboard_next'}
                >
                  <Text
                    accessibilityLabel={'securekeyboard_next_text'}
                    allowFontScaling={false}
                    style={[styles.keyText, styles.keyTextOption]}
                  >
                    {L.securekeyboard_next.toUpperCase()}
                  </Text>
                </Touchable>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
