import * as React from 'react';
import {
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  ImageStyle,
  Image,
} from 'react-native';
import CardView from './CardView';
import SectionHeader from './SectionHeader';
import TextInput from './TextInput';
import Colors from '../../resources/constants/Colors';
import Formats from '../../resources/constants/Formats';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  containerRow: {
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
  } as ViewStyle,
  cardView: {
    marginBottom: 20,
    borderRadius: 8,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 15,
  } as ViewStyle,
  titlePanelText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  documentTitle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 0,
  } as TextStyle,
  title: {
    fontSize: 28,
    lineHeight: 38,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  icon: {
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.grey4,
    width: 6,
    marginLeft: 16,
  } as ImageStyle,
  iconCheck: {
    height: 18,
    resizeMode: 'contain',
    tintColor: Colors.primaryLight,
    width: 18,
    marginLeft: 18,
  } as ImageStyle,
  labelDniError: {
    fontSize: 13,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  mainSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  } as ViewStyle,
  textSeparator: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flex: 0.89,
  } as ViewStyle,
  textInput: {
    flex: 1,
  } as TextStyle,
  correctSeparator: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.11,
  } as ViewStyle,
});

export interface TextInputDniProps extends ViewProps {
  onDniCompleted: (dniCompleted: boolean) => void;
  accessibilityErrorInput?: string;
}

export interface TextInputDniState {
  dniCompleted: boolean;
}

export default class TextInputDni extends React.Component<
  TextInputDniProps,
  TextInputDniState
> {
  state: TextInputDniState = {
    dniCompleted: false,
  };
  document!: TextInput | null;

  onDniCompleted = () => {
    const { onDniCompleted } = this.props;
    const cantidad = this.document && this.document.getValue();
    let dniCompleted = false;
    if (cantidad?.length == 8) {
      dniCompleted = true;
      this.setState({ dniCompleted });
    } else {
      dniCompleted = false;
      this.setState({ dniCompleted });
    }
    typeof onDniCompleted === 'function' && onDniCompleted(dniCompleted);
  };

  focus = () => {
    this.document && this.document.focus();
  };
  getValue = () => {
    if (!this.document) {
      return '';
    }
    return this.document.getValue();
  };

  setValue = (value: string) => {
    this.document && this.document.setValue(value);
  };

  render() {
    const { dniCompleted } = this.state;
    const { accessibilityErrorInput } = this.props;

    return (
      <CardView style={styles.cardView}>
        <SectionHeader
          title={L.textinputdni_sectionheader_title}
          textStyle={styles.documentTitle}
          accessibilityLabel={'textinputdni_sectionheader_title'}
        />
        <View style={styles.mainSection}>
          <View style={styles.textSeparator}>
            <TextInput
              textContentType={'none'}
              accessibilityLabel={'textinputdni_textinput_documentnumber'}
              accessibilityErrorInput={accessibilityErrorInput}
              labelStyle={styles.titlePanelText}
              autoCapitalize={'none'}
              style={styles.textInput}
              keyboardType={'number-pad'}
              autoCorrect={false}
              maxLength={8}
              formatText={Formats.DNI}
              ref={ref => {
                this.document = ref;
              }}
              blurOnSubmit
              placeholder={L.textinputdni_textinput_placeholder}
              onChangeText={this.onDniCompleted}
              containerStyle={styles.containerRow}
              textErrorStyle={styles.labelDniError}
            />
          </View>
          <View style={styles.correctSeparator}>
            {dniCompleted && (
              <Image
                accessibilityLabel={'textinputdni_image_correct'}
                style={styles.iconCheck}
                source={require('../../assets/images/item-checked-icon.png')}
              />
            )}
          </View>
        </View>
      </CardView>
    );
  }
}
