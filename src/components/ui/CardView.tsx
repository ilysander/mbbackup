import * as React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle, Platform } from 'react-native';
import Colors from '../../resources/constants/Colors';

const styles = StyleSheet.create({
  card: {
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey6,
    shadowOffset: { height: 4, width: 0 },
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
    borderColor: Colors.grey2,
    elevation: 3,
    overflow: 'visible',
  } as ViewStyle,
  padding: {
    padding: 20,
  } as ViewStyle,
});

export interface CardViewProps extends ViewProps {
  /**
   * Usa `padding` cuando necesites agregarle un espacio para el contenido
   * según lo que define las guias de UI
   * @default false
   */
  padding?: boolean;
}

export interface CardViewState {}

export default class CardView extends React.Component<
  CardViewProps,
  CardViewState
> {
  render() {
    const { style, children, padding, ...props } = this.props;
    return (
      <View
        removeClippedSubviews={false}
        accessibilityLabel={'card'}
        style={[styles.card, padding && styles.padding, style]}
        {...props}
      >
        {children}
      </View>
    );
  }
}
