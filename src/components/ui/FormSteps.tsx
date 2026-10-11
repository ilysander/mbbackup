import * as React from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  Image,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const Sizes = {
  Indicator: 22,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 100,
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    alignSelf: 'center',
  } as ViewStyle,
  separator: {
    width: 80,
    marginHorizontal: -4,
    height: 5,
    backgroundColor: Colors.grey2,
    overflow: 'hidden',
  } as ViewStyle,
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 34,
    height: 22,
    paddingBottom: 4,
  } as ViewStyle,
  passedSeparator: {
    backgroundColor: Colors.shine,
  } as ViewStyle,
  currentIndicator: {
    width: 40,
    height: 30,
    paddingBottom: 0,
  } as ViewStyle,
  step: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  } as ViewStyle,
  label: {
    color: Colors.grey4,
    fontSize: 13,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  passedLabel: {
    color: Colors.grey6,
  } as TextStyle,
  currentLabel: {
    fontSize: 22,
    top: -2,
  } as TextStyle,
  checkedIcon: {
    width: 14,
    height: 8,
    bottom: -1,
    tintColor: Colors.grey4,
  } as ImageStyle,
  currentCheckedIcon: {
    width: 14,
    height: 12,
    left: 1,
    bottom: 2,
  } as ImageStyle,
  passedCheckedIcon: {
    tintColor: Colors.grey6,
  } as ImageStyle,
  flagIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 34,
    height: 22,
    tintColor: Colors.grey2,
  } as ImageStyle,
  currentFlagIcon: {
    width: 40,
    height: 30,
  } as ImageStyle,
  passedFlagIcon: {
    tintColor: Colors.shine,
  } as ImageStyle,
  border: {
    borderBottomLeftRadius: 20,
    backgroundColor: Colors.shine,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  } as ViewStyle,
  borderContainer: {
    backgroundColor: Colors.grey1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: -20,
    height: 25,
    overflow: 'visible',
  } as ViewStyle,
});

export interface FormStepsProps extends ViewProps {
  total: number;
  current: number;
  checked?: boolean;
  /**
   * esta propiedad sirve para indicar el margen horizontal unicamente
   * porque el ancho que se toma es de `Dimensions.get('window')`
   * el proposito de usar esta propiedad es tener en cuenta dispositivos
   * de todos los anchos posibles y conservar un aspecto adecuado
   */
  marginHorizontal?: number;
  indicatorStyle?: StyleProp<ViewStyle>;
  separatorStyle?: StyleProp<ViewStyle>;
}

export interface FormStepsState {}

export default class FormSteps extends React.Component<
  FormStepsProps,
  FormStepsState
> {
  static defaultProps = {
    marginHorizontal: 60,
    current: 1,
    checked: true,
  };

  generateSteps = (total: number) => {
    const keys = [];
    for (let i = 1; i <= total; i++) {
      keys.push(i);
    }
    return keys;
  };

  render() {
    const {
      total,
      current,
      indicatorStyle,
      separatorStyle,
      style,
      checked,
      marginHorizontal: marginHorizontalDefault,
      ...props
    } = this.props;
    const steps = this.generateSteps(total);
    const { width } = Dimensions.get('window');
    const marginHorizontal =
      marginHorizontalDefault || FormSteps.defaultProps.marginHorizontal;
    /**
     * esto calcula `separatorWidth` en base al ancho de la ventana y al total de pasos
     */
    const separatorWidth =
      (width - marginHorizontal * 2 - total * Sizes.Indicator) / (total - 1) +
      2;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.borderContainer}>
          <View style={[styles.border, { right: marginHorizontal }]} />
        </View>
        <View
          style={styles.content}
          accessibilityLabel={'formsteps'}
          {...props}
        >
          {steps.map((item, index) => {
            const label = index + 1;
            const isCurrent = current === label;
            const isOlder = current > index;
            const isPassed = isCurrent || isOlder;
            const isLast = steps.length - 1 === index;
            return (
              <View
                style={[styles.step, { zIndex: steps.length - index }]}
                key={item.toString()}
                accessibilityLabel={'formsteps_step_' + label}
              >
                {index !== 0 && (
                  <View
                    accessibilityLabel={'formsteps_split'}
                    style={[
                      styles.separator,
                      separatorStyle,
                      { width: separatorWidth },
                      isPassed && styles.passedSeparator,
                    ]}
                  />
                )}
                <View
                  accessibilityLabel={'formsteps_indicator'}
                  style={[
                    styles.indicator,
                    isCurrent && styles.currentIndicator,
                    indicatorStyle,
                  ]}
                >
                  <>
                    <Image
                      resizeMode={'stretch'}
                      style={[
                        styles.flagIcon,
                        isPassed && styles.passedFlagIcon,
                        isCurrent && styles.currentFlagIcon,
                      ]}
                      source={require('../../assets/images/step-flag.png')}
                    />
                    {isLast && checked ? (
                      <Image
                        resizeMode={'contain'}
                        style={[
                          styles.checkedIcon,
                          isPassed && styles.passedCheckedIcon,
                          isCurrent && styles.currentCheckedIcon,
                        ]}
                        source={require('../../assets/images/icon-check.png')}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.label,
                          isPassed && styles.passedLabel,
                          isCurrent && styles.currentLabel,
                        ]}
                      >
                        {label}
                      </Text>
                    )}
                  </>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
