import * as React from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Platform,
  ImageStyle,
  StyleProp,
} from 'react-native';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import Config from '../../Config';
import { Colors } from '../../resources/constants';
import { Font, Validate } from '../../resources/functions';
import { Log } from '../../resources/log';
import { CardView } from '../ui';
import ShareRow from './ShareRow';
import { L } from '../../resources/language/index';

const styles = StyleSheet.create({
  captureContainer: {
    top: -10000,
    position: 'absolute',
    borderColor: Colors.grey6,
    borderWidth: 2,
  } as ViewStyle,
  container: {
    backgroundColor: 'white',
    width: Config.settings.widthReceipt,
    paddingBottom: 20,
  } as ViewStyle,
  header: {
    alignContent: 'center',
    justifyContent: 'center',
    height: 170,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  } as ViewStyle,
  formRowContainer: {
    paddingTop: 5,
    paddingBottom: 5,
  } as ViewStyle,
  textTitle: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 22,
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 20,
    marginTop: 10,
  } as TextStyle,
  buttonPreview: {
    backgroundColor: Colors.grey3,
  } as ViewStyle,
  cardView: {
    padding: 20,
    paddingTop: 0,
    marginHorizontal: 20,
    marginTop: 30,
  } as ViewStyle,
  cardBorderAndroid: {
    borderWidth: 1,
    borderColor: Colors.grey2,
    elevation: 0,
  } as ViewStyle,
  logoContainer: {
    paddingVertical: 20,
  } as ViewStyle,
  headerFlags: {
    height: 38,
    width: '100%',
    alignSelf: 'center',
  } as ImageStyle,
  flags: {
    alignSelf: 'center',
    width: 250,
    height: 32,
  } as ImageStyle,
  logo: {
    height: 80,
    alignSelf: 'center',
  } as ImageStyle,
  watermarkContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  } as ViewStyle,
  watermarkContain: {
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  watermarkText: {
    ...Font({ weight: 'Bold' }),
    transform: [{ rotate: '45deg' }],
    fontSize: 32,
    color: Colors.shadow,
    textAlign: 'center',
  } as TextStyle,
});
const isAndroid = Platform.OS === 'android';
const TAG = '[ShareReceipt]';
export type ShareReceiptItem = ShareReceiptItemInterface | undefined;

export interface ShareReceiptItemInterface {
  title: string;
  details: string[];
}

export interface ShareReceiptProps {
  content: ShareReceiptItem[];
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  extraInfo?: React.ReactNode[] | React.ReactChild;
}

export interface ShareReceiptState {
  isVisible: boolean;
}

export default class ShareReceipt extends React.Component<
  ShareReceiptProps,
  ShareReceiptState
> {
  state: ShareReceiptState = {
    isVisible: false,
  };

  viewRef!: View | null;
  /**
   * Comparte la constancia, con el titulo y los datos enviados como props
   */
  shareConstance = async (title: string) => {
    if (Config.debug.showRecordTransfer) {
      this.showRecordTransfer();
      return;
    }
    if (!this.viewRef) {
      return;
    }
    try {
      const uri = await captureRef(this.viewRef, {
        format: 'png',
        result: 'base64',
      });
      const options = {
        title,
        url: 'data:image/png;base64,' + uri,
        subject: title, //  para el correo
      };
      await Share.open(options);
    } catch (e) {
      Log.exception(TAG, 'onPress', e);
    }
  };

  /**
   * Muestra la previsualizacion de la constancia que se formara
   */
  showRecordTransfer = () => {
    this.setState({ isVisible: true });
  };
  closeConstance = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible } = this.state;
    const { title, titleStyle, content, extraInfo } = this.props;
    return (
      <View style={[styles.captureContainer, isVisible && { top: 40 }]}>
        <View style={styles.buttonPreview}>
          <Button
            title={'Cerrar previsualización'}
            onPress={this.closeConstance}
          />
        </View>
        <View
          style={[styles.container]}
          ref={ref => {
            this.viewRef = ref;
          }}
        >
          <View style={styles.header}>
            <Image
              style={styles.headerFlags}
              resizeMode={'contain'}
              source={require('../../assets/images/header-bar-alter.png')}
            />
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require('../../assets/images/logo.png')}
                resizeMode={'contain'}
              />
            </View>
          </View>

          <CardView
            style={[styles.cardView, isAndroid && styles.cardBorderAndroid]}
          >
            <Image
              resizeMode={'stretch'}
              style={styles.flags}
              source={require('../../assets/images/flags-large.png')}
            />
            <Text style={[styles.textTitle, titleStyle]}>{title}</Text>
            <View>
              {content.map((row: ShareReceiptItem, key: any) => {
                let rowStyle;
                switch (key) {
                  case 0:
                    rowStyle = { paddingBottom: 10 };
                    break;
                  case content.length - 1:
                    rowStyle = { paddingTop: 10 };
                    break;
                  default:
                    rowStyle = styles.formRowContainer;
                    break;
                }
                if (!row) return null;
                return (
                  <ShareRow
                    title={row.title}
                    details={row.details}
                    style={rowStyle}
                    key={key.toString()}
                  />
                );
              })}
              {!!extraInfo && extraInfo}
              {Validate.isDemo() && (
                <View style={styles.watermarkContainer}>
                  <View style={styles.watermarkContain}>
                    <Text style={styles.watermarkText}>
                      {L.sharereceipt_demo}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </CardView>
        </View>
      </View>
    );
  }
}
