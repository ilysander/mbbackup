const moment = require('moment');
import * as React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Config from '../../Config';
import { Colors } from '../../resources/constants';
import { Size } from '../../resources/dimensions';
import { Font, Validate } from '../../resources/functions';
import { L } from '../../resources/language';
import { Alert } from '../ui';
import { ModalProps } from '../ui/Modal';

const styles = StyleSheet.create({
  container: {
    maxHeight: 280,
    height: 0.7 * Size.getVisibleScreenHeight(),
    flex: 1,
  } as ViewStyle,
  content: {
    overflow: 'hidden',
    flex: 1,
    backgroundColor: 'transparent',
  } as ViewStyle,
  descriptionText: {
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 20,
    color: Colors.primary,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
});

export interface TermsModalButton {
  onPress?: () => void;
  title: string;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export interface TermsModalProps extends ModalProps {
  body?: string;
  title?: string;
  closeButton?: TermsModalButton;
  actionButton?: TermsModalButton;
  accessibilityLabel?: any;
  analyticsParams?: any;
}

export interface TermsModalState { }

export default class TermsModal extends React.Component<
  TermsModalProps,
  TermsModalState
> {
  state: TermsModalState = {};

  render() {
    const {
      onClose,
      closeButton,
      actionButton,
      title,
      body,
      accessibilityLabel,
      ...props
    } = this.props;
    const baseUrlFontAssets =
      Platform.OS === 'android' ? 'android_asset' : 'src';
    const baseUrlWebView =
      Platform.OS === 'android'
        ? './src/fonts/'
        : Validate.isDemo()
          ? undefined
          : Config.server.url;
    const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, target-densityDpi=device-dpi">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
      html,body {
          height:100%;
          width:100%;
      }
      html,p,h3 {
          padding:0;
          margin:0;
      }
      @font-face {
          font-family: Brevia;
          font-weight: 500;
          font-style: normal;
          src: url("file:///${baseUrlFontAssets}/fonts/Brevia-SemiBold.otf");
      }
      strong {
        font-weight: 700;
      }
      ol {
        margin: 0;
        padding-left:0px;
        list-style-position:inside; 
      }
      body {
        padding:0;
        margin:0;
      }
      ol span::before {
        content: ' ';
        display: block;
      }
      ol li span::before {
        content: '';
        display: inline;  
      }
      ol ol li {
        padding-left: 20px;
      }
      ul {
        padding-left: 23px;
      }
      * {
        border: none!important;
        background-color: white;
        text-align: justify;
        text-justify: inter-word;
        font-family: Brevia;
        font-size: 13px;
        line-height: 1.5;
        font-weight: 500;
        color:${Colors.grey5};
      }
      </style>
    </head>
    <body>
    ${body || L.termsmodal_content}<p>Lima, ${moment().format(
      L.termsmodal_content_date_format
    )}.</p>
    </body>
    </html>
    `;
    /**
     * El view que encapsula al webview es necesario para
     * evitar un problema conocido en Android
     */
    return (
      <Alert
        accessibilityLabel={'termsmodal'}
        onClose={onClose}
        {...props}
        withCloseButton
        onReject={onClose}
        title={title ? title : L.termsmodal_title}
        titleCenter
        message={
          <View
            style={[styles.container]}
            accessibilityLabel={'termsmodal_container'}
          >
            <View style={styles.content}>
              <WebView
                accessibilityLabel={'termsmodal_content'}
                source={{ html, baseUrl: baseUrlWebView }}
              />
            </View>
          </View>
        }
        actionButton={
          actionButton && {
            accessibilityLabel: accessibilityLabel,
            ...actionButton,
            style: {
              backgroundColor: Colors.primary,
              borderColor: Colors.primary,
              height: 40,
              flex: 1,
              width: '100%',
              minHeight: 40,
            },
          }
        }
      />
    );
  }
}
