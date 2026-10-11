import * as React from 'react';
import {
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  ImageStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import CardView from './CardView';
import SectionHeader from './SectionHeader';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable from '../ui/Touchable';
import { AnalyticsLabelsType } from '../../resources/analytics';

const styles = StyleSheet.create({
  activeIcon: {
    resizeMode: 'contain',
    width: 48,
    height: 36,
    tintColor: Colors.primaryLight,
  } as ImageStyle,
  iconInputCorrect: {
    resizeMode: 'contain',
    width: 48,
    height: 36,
  } as ImageStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  cardView: {
    marginBottom: 20,
    borderRadius: 8,
  } as ViewStyle,
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  activeSubtitle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    textAlign: 'left',
    fontSize: 14,
  } as TextStyle,
  inactiveSubtitle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey3,
    textAlign: 'left',
    fontSize: 14,
  } as TextStyle,
  activeTitle: {
    ...Font(),
    color: Colors.grey6,
    textAlign: 'left',
    fontSize: 14,
  } as TextStyle,
  inactiveTitle: {
    ...Font(),
    color: Colors.grey3,
    textAlign: 'left',
    fontSize: 14,
  } as TextStyle,
  title: {
    fontSize: 28,
    lineHeight: 38,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  arrow: {
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.grey4,
    width: 6,
    marginLeft: 16,
  } as ImageStyle,
  sectionHeader: {
    flex: 0.7,
  } as ViewStyle,
  sectionGraph: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 0.19,
  } as ViewStyle,
  sectionArrow: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.11,
  } as ViewStyle,
  inactiveIcon: {
    resizeMode: 'contain',
    width: 48,
    height: 36,
    tintColor: Colors.grey3,
  } as ImageStyle,
  iconCheck: {
    height: 18,
    resizeMode: 'contain',
    tintColor: Colors.primaryLight,
    width: 18,
    marginLeft: 18,
  } as ImageStyle,
});

export interface FacephiButtonProps extends ViewProps {
  onValidationStart: (typeOfValidation: string) => void;
  typeOfValidation: string;
  capturedImage: string;
  title: string;
  subtitle: string;
  iconFrontImage: ImageSourcePropType;
  active: boolean;
  accessibilityLabel: AnalyticsLabelsType;
}

export interface FacephiButtonState { }

export default class TextInputDni extends React.Component<
  FacephiButtonProps,
  FacephiButtonState
> {
  onValidationStart = () => {
    const { onValidationStart, typeOfValidation } = this.props;
    typeof onValidationStart === 'function' &&
      onValidationStart(typeOfValidation);
  };

  render() {
    const {
      capturedImage,
      title,
      subtitle,
      iconFrontImage,
      active,
      accessibilityLabel
    } = this.props;

    return (
      <CardView padding style={styles.cardView}>
        <Touchable
          accessibilityLabel={accessibilityLabel || 'button'}
          analyticsParams={title + ' ' + subtitle}
          onPress={() => active && this.onValidationStart()}
          style={styles.button}
        >
          <SectionHeader
            title={title}
            textStyle={active ? styles.activeTitle : styles.inactiveTitle}
            subtitleTextStyle={
              active ? styles.activeSubtitle : styles.inactiveSubtitle
            }
            subtitle={subtitle}
            style={styles.sectionHeader}
            accessibilityLabel={'facephibutton_sectionheader_title'}
          />
          <View style={styles.sectionGraph}>
            {!!capturedImage ? (
              <View>
                <Image
                  source={{
                    uri: `data:image/png;base64,${capturedImage}`,
                  }}
                  style={styles.iconInputCorrect}
                  resizeMode={'contain'}
                />
              </View>
            ) : (
              <Image
                source={iconFrontImage}
                style={active ? styles.activeIcon : styles.inactiveIcon}
                resizeMode={'contain'}
              />
            )}
          </View>
          <View style={styles.sectionArrow}>
            {!capturedImage ? (
              <View>
                <Image
                  accessibilityLabel={'facephibutton_image_arrow'}
                  style={[styles.arrow]}
                  source={require('../../assets/images/arrow-icon.png')}
                />
              </View>
            ) : (
              <Image
                accessibilityLabel={'textinputdni_image_correct'}
                style={styles.iconCheck}
                source={require('../../assets/images/item-checked-icon.png')}
              />
            )}
          </View>
        </Touchable>
      </CardView>
    );
  }
}
