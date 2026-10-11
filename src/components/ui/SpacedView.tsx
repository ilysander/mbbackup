import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  } as ViewStyle,
  containerVertical: {
    flexDirection: 'column',
  } as ViewStyle,
  item: {
    flex: 1,
  } as ViewStyle,
});

export interface SpacedViewProps {
  spacing?: number;
  vertical?: boolean;
  children: React.ReactNode[];
  style?: StyleProp<ViewStyle>;
}

export interface SpacedViewState {}

export default class SpacedView extends React.Component<
  SpacedViewProps,
  SpacedViewState
> {
  static defaultProps = {
    spacing: 20,
    vertical: false,
  };

  state: SpacedViewState = {};

  render() {
    const { style, children, spacing, vertical, ...props } = this.props;

    const items = React.Children.toArray(children);
    const total = items.length;
    const otherStyle = vertical
      ? { marginBottom: spacing }
      : { marginRight: spacing };
    const lastStyle = vertical ? { marginBottom: 0 } : { marginRight: 0 };
    return (
      <View
        style={[styles.container, vertical && styles.containerVertical, style]}
        accessibilityLabel={'spacedview'}
        {...props}
      >
        {items.map((item, index) => {
          const isLast = total - 1 === index;
          return (
            <View
              key={index.toString()}
              style={[styles.item, otherStyle, isLast && lastStyle]}
            >
              {item}
            </View>
          );
        })}
      </View>
    );
  }
}
