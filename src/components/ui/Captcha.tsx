import * as React from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  StatusBar,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Button from './Button';
import Config from '../../Config';
import Colors from '../../resources/constants/Colors';
import Loading from '../ui/Loading';
import Size from '../../resources/dimensions/Size';
import {L} from '../../resources/language';
import TextError from './TextError';
import {TouchableProps} from './Touchable';
import Log from '../../resources/log/Log';
import Validate from '../../resources/functions/Validate';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: Colors.white,
  } as ViewStyle,
  options: {
    margin: 20,
  } as ViewStyle,
  icon: {
    width: 250,
    height: 72,
  } as ImageStyle,
  webview: {
    backgroundColor: 'transparent',
    flex: 1,
  } as ViewStyle,
  captchaContainer: {
    alignSelf: 'center',
  } as ViewStyle,
});
export interface CaptchaProps extends TouchableProps {
  onResponse?: (response: string) => void;
  onCancel?: () => void;
  onIsValid?: (value: boolean) => void;
  onPress?: () => void;
}

export interface CaptchaState {
  invisible: boolean;
  isValid: boolean;
  isCompleted: boolean;
  showModal: boolean;
  isLoading: boolean;
  response: string;
  showError: boolean;
  errorMessage: string;
}

const TAG = '[Captcha]';
export default class Captcha extends React.Component<
  CaptchaProps,
  CaptchaState
> {
  state: CaptchaState = {
    isLoading: true,
    showModal: false,
    isValid: false,
    isCompleted: false,
    invisible: false,
    response: '',
    showError: false,
    errorMessage: '',
  };

  componentDidMount() {
    Validate.isDemo() && this.setState({isValid: true, isCompleted: true});
  }

  getValue = () => {
    return this.state.response;
  };

  reset = () => {
    const {onResponse, onIsValid} = this.props;
    typeof onResponse === 'function' && onResponse('');
    typeof onIsValid === 'function' && onIsValid(false);
    this.setState({
      isValid: false,
      isCompleted: false,
      showError: false,
      response: '',
    });
  };

  isValid = (showError = true) => {
    if (Config.debug.captchaNotRequired || Validate.isDemo()) {
      return true;
    }
    const {isValid} = this.state;
    showError && this.setState({showError: !isValid});
    return isValid;
  };

  onMessage = (e: any) => {
    const {onResponse, onIsValid} = this.props;

    const data = decodeURIComponent(
      decodeURIComponent(decodeURIComponent(e.nativeEvent.data || '')),
    );
    let payload;
    try {
      payload = JSON.parse(data || '');
    } catch (e) {
      payload = {};
    }
    Log.debug(TAG, 'onMessage', payload.action, payload.response);
    switch (payload.action) {
      case 'loaded':
        setTimeout(() => {
          this.setState({isLoading: false});
        }, 2 * 1000);
        break;
      case 'expired':
        this.reset();
        break;
      case 'response':
        const response = payload.response;
        const isValid = !!response;

        if (typeof onResponse === 'function') {
          onResponse(response);
        }
        this.setState(
          {
            showModal: false,
            isCompleted: true,
            showError: false,
            isValid,
            response,
          },
          () => {
            typeof onIsValid === 'function' && onIsValid(isValid);
          },
        );
        break;
      default:
        break;
    }
  };

  showModal = () => {
    const {isValid} = this.state;
    if (isValid) {
      return;
    }
    const {onPress} = this.props;
    if (typeof onPress === 'function') {
      onPress();
    }
    this.setState({showModal: true});
  };

  setError = (errorMessage: string) => {
    this.setState({
      errorMessage,
      isValid: false,
      showError: !!errorMessage,
    });
  };

  clearError = () => {
    this.setState({errorMessage: ''});
  };

  onCancel = () => {
    const {onCancel} = this.props;
    this.setState({showModal: false});
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  render() {
    const {
      isLoading,
      showModal,
      isCompleted,
      isValid,
      invisible,
      showError,
      errorMessage,
    } = this.state;
    const {style} = this.props;
    const isValidError = isCompleted && !isValid;
    const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, target-densityDpi=device-dpi">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        html,body{
            height:100%;
            width:100%;
        }
        html{
            background:'transparent';
            padding:0px;
            margin:0;
        }
        body{
            flex:1;
            flex-direction:column;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            padding:0;
            margin:0;
        }
        #recaptcha{
            margin: 0 auto !important;
            display: block !important;
            width: 100% !important;
            width: auto !important;
            height: auto !important;
            z-index:1 !important;
        }
        #recaptcha > div {
            margin: 0 auto;
        }
        #overlay {
            display: none;
            position:absolute;
            /*background:rgba(0,0,0,0.1);*/
            top:0;
            left:0;
            right:0;
            bottom:0;
            z-index:9999;
        }
        #title{
            visibility:hidden;
            padding:10px;
            padding-bottom:2px;
            text-align:center;
            margin:4px;
            color:#444;
            font-size:18px;
            font-weight:normal;
            font-family:"Helvetica","Arial","Verdana";
        }
      </style>
    </head>
    <body>
    <div id="overlay"></div>
    <h1 id="title">${L.captcha_title}</h1>
    <div id="recaptcha"></div>
    <script src="https://www.google.com/recaptcha/api.js?onload=captchasLoaded&render=explicit&hl=es" async defer></script>
    <script>
        var onRecaptchaExpired = function () {
          grecaptcha.reset();
          sendMessage({action:'expired'});
        };
        var sendMessage = function(message){
          window.postMessage(JSON.stringify(message));
        }
        var verifyCallback = function(response) {
          sendMessage({action:'response',response:response});
        };
        var captchasLoaded = function(){
          setTimeout(function(){
            sendMessage({action:'loaded'});
            grecaptcha.render('recaptcha', {
              'sitekey': '${Config.recaptcha.siteKey}',
              'callback' : verifyCallback,
              'theme': 'light',
              ${invisible ? '' : '//'}'size':'invisible',
              'expired-callback': onRecaptchaExpired
            });
            ${invisible ? '' : '//'}grecaptcha.execute();
            document.getElementById('title').style.visibility = "visible";

          },1*1000)


        };
        document.querySelector('#overlay').onclick = function() {
          sendMessage({action:'overlay'});
        }
    </script>
    </body>
    </html>
    `;

    const patchPostMessageFunction = () => {
      const originalPostMessage = window.postMessage;
      const patchedPostMessage = (
        message: any,
        targetOrigin: string,
        transfer?: Transferable[] | undefined,
      ) => {
        originalPostMessage(message, targetOrigin, transfer);
      };
      patchedPostMessage.toString = () => {
        return String(Object.hasOwnProperty).replace(
          'hasOwnProperty',
          'postMessage',
        );
      };
      // window.postMessage = patchedPostMessage;
    };
    const patchPostMessageJsCode =
      '(' + String(patchPostMessageFunction) + ')();';

    return [
      <View key={'button'} style={style}>
        <TouchableOpacity
          accessibilityLabel={'captcha_open'}
          style={[
            styles.captchaContainer,
            isValidError && {borderColor: Colors.danger},
          ]}
          onPress={this.showModal}>
          <Image
            resizeMode={'contain'}
            style={styles.icon}
            source={
              isValid
                ? require('../../assets/images/captcha-placeholder-valid.png')
                : require('../../assets/images/captcha-placeholder.png')
            }
          />
          {showError && (
            <TextError center>
              {errorMessage || L.captcha_error_message}
            </TextError>
          )}
        </TouchableOpacity>
      </View>,
      showModal && (
        <Modal
          key={'modal'}
          visible
          animationType={'fade'}
          transparent
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}
          onRequestClose={this.onCancel}>
          <StatusBar
            backgroundColor={Colors.grey4}
            barStyle={'light-content'}
            animated
          />
          <View style={styles.container}>
            <WebView
              source={{
                html,
                baseUrl: `${Config.recaptcha.site}/frontend/`,
              }}
              style={styles.webview}
              injectedJavaScript={patchPostMessageJsCode}
              onMessage={this.onMessage}
              javaScriptEnabled
            />
            {isLoading && <Loading margin={'large'} color={Colors.primary} />}

            <Button
              typeColor={'primary'}
              light
              style={[
                styles.options,
                {marginBottom: Size.getBottomOffset() + 20},
              ]}
              accessibilityLabel={'captcha_cancel'}
              title={L.captcha_button_cancel}
              onPress={this.onCancel}
            />
          </View>
        </Modal>
      ),
    ];
  }
}
