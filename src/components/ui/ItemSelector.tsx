import * as React from 'react';
import {
  Image,
  Animated,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { AnalyticsLabelsType, K } from '../../resources/analytics';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import TextError from './TextError';
import Touchable from './Touchable';
import ItemSelectorModal from './ItemSelectorModal';
import AnalyticsEvent, { setEventValue } from '../../resources/analytics/AnalyticsEvent';

const styles = StyleSheet.create({
  container: {
    minHeight: Platform.OS === 'android' ? 50 : 40,
    justifyContent: 'center',
  } as ViewStyle,
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  titleText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,
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
  moreIcon: {
    width: 18,
    height: 10,
    marginRight: 4,
    tintColor: Colors.grey4,
  } as ImageStyle,
  textError: {
    marginTop: 10,
  } as TextStyle,
  info: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  placeholderText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
});

type ViewSingleProps = Exclude<ViewProps, 'accessibilityLabel'>;

export interface ItemSelectorProps extends ViewSingleProps {
  values: string[];
  selectedIndex: number;
  placeholder?: string;
  title?: string;
  hiddenSubtitle?: boolean;
  subtitle?: string;
  onPress?: (index: number) => void;
  readOnly?: boolean;
  styleSubtitle?: StyleProp<TextStyle>;
  accessibilityLabelOption?: string;
  /**
   * es obligatorio que `accessibilityLabel` este agregado en `AnalyticsLabels`
   */
  accessibilityLabel: AnalyticsLabelsType;
  textItemSelectorDefault?: string;
  onOpen?: () => void;
}

export interface ItemSelectorState {
  opacity: Animated.Value;
  errorMessage?: string | React.ReactNode;
  showSelector: boolean;
}

export default class ItemSelector extends React.Component<
  ItemSelectorProps,
  ItemSelectorState
> {
  static defaultProps = {
    values: [],
    selectedIndex: -1,
    readOnly: false,
  };

  state: ItemSelectorState = {
    opacity: new Animated.Value(0),
    errorMessage: '',
    showSelector: false,
  };

  animation!: Animated.CompositeAnimation;

  getActiveOpacity = () => {
    const { readOnly } = this.props;
    return readOnly ? 1 : 0.2;
  };

  open = () => {
    const { readOnly, onOpen } = this.props;
    const { showSelector } = this.state;

    !readOnly && this.setState({ showSelector: !showSelector });
    if (typeof onOpen === 'function') {
      onOpen();
    }
  };

  close = () => {
    const { readOnly } = this.props;
    const { showSelector } = this.state;

    !readOnly && this.setState({ showSelector: !showSelector });
  };

  setError = (value?: string) => {
    this.setState({ errorMessage: value });
  };

  clearError = () => {
    this.setError();
  };

  /* NOSONAR */
  render() {
    const { errorMessage, showSelector } = this.state;
    const {
      style,
      onPress,
      accessibilityLabel,
      selectedIndex,
      values,
      placeholder,
      title,
      hiddenSubtitle,
      subtitle,
      styleSubtitle,
      readOnly,
      textItemSelectorDefault,
      accessibilityLabelOption,
      ...props
    } = this.props;

    const validSelectedIndex = selectedIndex > -1;
    const value = validSelectedIndex ? values[selectedIndex] : undefined;
    const isSelected = validSelectedIndex && !!value;
    if (showSelector) {
      let label;
      if (accessibilityLabel !== undefined) {
        setEventValue(accessibilityLabel, title)
        label = K[accessibilityLabel]
        AnalyticsEvent.trackEvent('virtualEventApp', label);
      }
    }

    return [
      <ItemSelectorModal
        key={'modal'}
        accessibilityLabel={accessibilityLabelOption}
        visible={showSelector}
        onPressItem={onPress}
        values={values}
        title={title}
        hiddenSubtitle={hiddenSubtitle}
        subtitle={subtitle}
        styleSubtitle={styleSubtitle}
        onClose={this.close}
        {...props}
      />,
      <View
        key={'panel'}
        accessibilityLabel={accessibilityLabel || 'itemselector_container'}
        style={style}
        {...props}
      >
        <View style={styles.container}>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'itemselector_text_name'}
              style={styles.titleText}
            >
              {!!placeholder ? placeholder : title}
            </Text>
          </View>

          <Touchable
            accessibilityLabel={accessibilityLabel ? accessibilityLabel : 'itemselector_open'}
            analyticsParams={title}
            onPress={this.open}
            style={styles.containerTouchable}
            activeOpacity={this.getActiveOpacity()}
          >
            <View style={styles.info}>
              {isSelected && (
                <Text
                  accessibilityLabel={'itemselector_text_name'}
                  style={styles.placeholderText}
                >
                  {value}
                </Text>
              )}
              {!isSelected && (
                <Text
                  accessibilityLabel={'itemselector_text_placeholder'}
                  style={styles.placeholderText}
                >
                  {!!textItemSelectorDefault
                    ? textItemSelectorDefault
                    : L.itemselector_text_placeholder}
                </Text>
              )}
            </View>

            <Image
              style={styles.moreIcon}
              resizeMode={'contain'}
              source={require('../../assets/images/selector-dots.png')}
            />
          </Touchable>
        </View>
        {!!errorMessage && (
          <TextError style={styles.textError}>{errorMessage}</TextError>
        )}
      </View>,
    ];
  }
}
