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
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Validate } from '../../resources/functions';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import { Touchable, SectionHeader } from '../ui';
import TextError from '../ui/TextError';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'column',
  } as ViewStyle,
  content: {
    position: 'relative',
  } as ViewStyle,
  containerPanel: {
    marginTop: 5,
    paddingLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.grey2,
    padding: 10,
  } as ViewStyle,
  info: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  icon: {
    marginHorizontal: 5,
    tintColor: Colors.shine,
    alignSelf: 'flex-start',
    marginTop: 5,
    width: 25,
    height: 25,
  } as ImageStyle,
  nameContainer: {
    flex: 1,
    paddingLeft: 5,
  } as ViewStyle,
  aliasText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  descriptionText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 12,
  } as TextStyle,
  moreIcon: {
    tintColor: Colors.secondary,
    marginLeft: 5,
    width: 9,
    height: 16,
  } as ImageStyle,
  moreIconDisabled: {
    tintColor: Colors.grey6,
  } as ImageStyle,
});

const TAG = '[FrequentContact]';

export interface FrequentContactProps extends TouchableProps {
  containerStyle?: StyleProp<ViewStyle>;
  containerInputStyle?: StyleProp<ViewStyle>;
  title?: string;
  formatText?: any;
  frequentContact: any;
}

export interface FrequentContactState {
  errorMessage?: string;
  frequentContact: any;
  value: string;
}

export default class FrequentContact extends React.Component<
  FrequentContactProps,
  FrequentContactState
> {
  static defaultProps = {
    editable: true,
  };
  state: FrequentContactState = {
    value: '',
    errorMessage: '',
    frequentContact: undefined,
  };
  stateUpdateValidation = (nextState: FrequentContactState) => {
    return (
      nextState.value !== this.state.value ||
      nextState.errorMessage !== this.state.errorMessage
    );
  };

  shouldComponentUpdate(
    nextProps: FrequentContactProps,
    nextState: FrequentContactState
  ) {
    let update = false;
    if (
      this.stateUpdateValidation(nextState) ||
      nextProps.style !== this.props.style
    ) {
      update = true;
    }
    return update;
  }

  onChangeValue = (frequentContact: any) => {
    this.setState({
      frequentContact,
      value: frequentContact.accountNumber,
    });
  };

  getFormatValue = () => {
    return this.state.value;
  };
  getValue = () => {
    const { formatText } = this.props;
    const { value } = this.state;
    return formatText ? Validate.formattingTextNaked(value, formatText) : value;
  };
  setValue = (_value: string) => {
    return;
  };
  isValid = () => {
    const { formatText } = this.props;
    const { value } = this.state;

    if (formatText) {
      const errorMessage = Validate.validateFormat(value, formatText);
      !!errorMessage && this.setState({ errorMessage });
      return !errorMessage;
    }
    return true;
  };
  setError = (errorMessage?: string) => {
    this.setState({ errorMessage });
  };
  clearError = () => {
    this.setError(undefined);
  };
  focus = () => {
    Log.debug(TAG, 'focus', 'ok');
  };
  blur = () => {
    Log.debug(TAG, 'blur', 'ok');
  };

  showArrowIcon = () => {
    const { disabled } = this.props;
    return (
      <Image
        accessibilityLabel={'frequentcontact_more_icon'}
        style={[styles.moreIcon, disabled && styles.moreIconDisabled]}
        source={require('../../assets/images/more-icon.png')}
      />
    );
  };

  componentDidMount() {
    const { frequentContact } = this.props;
    if (frequentContact) {
      this.onChangeValue(frequentContact);
    }
  }

  render() {
    const { errorMessage, frequentContact } = this.state;
    const {
      containerStyle,
      containerInputStyle,
      onPress,
      children,
      title,
      accessibilityLabel,
      ...props
    } = this.props;

    const isInvalid = !!errorMessage;
    return (
      <View
        accessibilityLabel={'frequentcontact'}
        style={[styles.container, containerStyle]}
      >
        <View style={[styles.content, containerInputStyle]}>
          <SectionHeader
            accessibilityLabel={'frequentcontact_panel_title'}
            title={title || L.frequentcontact_panel_title}
          />

          <Touchable
            onPress={onPress}
            activeOpacity={!onPress ? 1 : 0.2}
            accessibilityLabel={
              accessibilityLabel || 'frequentcontact_container'
            }
            {...props}
          >
            <View style={styles.containerPanel}>
              <View style={styles.info}>
                <Image
                  style={styles.icon}
                  accessibilityLabel={'frequentcontact_image_icon'}
                  source={require('../../assets/images/frequent-icon-active.png')}
                />
                {frequentContact && (
                  <View style={styles.nameContainer}>
                    <Text
                      style={styles.aliasText}
                      accessibilityLabel={'frequentcontact_text_alias'}
                    >
                      {frequentContact.alias}
                    </Text>
                    <View>
                      <Text
                        style={styles.descriptionText}
                        accessibilityLabel={'frequentcontact_text_description'}
                      >
                        {frequentContact.bankName}
                      </Text>
                    </View>
                  </View>
                )}
                {onPress && this.showArrowIcon()}
              </View>
            </View>
          </Touchable>
        </View>
        {children}
        {isInvalid && (
          <TextError style={{ marginTop: 10 }}>{errorMessage}</TextError>
        )}
      </View>
    );
  }
}
