import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import CardView from './CardView';
import PanelHeader from './PanelHeader';
import { CardViewProps } from './CardView';

const styles = StyleSheet.create({
  content: {
    /**
     * este componente tiene `marginBottom porque en la version anterior tenia`
     */
    marginBottom: 20,
  } as ViewStyle,
});

export interface PanelProps extends CardViewProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  theme?: 'light' | 'dark';
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  accessibilityLabel: string;
  childrenView?: any;
}

export interface PanelState { }

export default class Panel extends React.Component<PanelProps, PanelState> {
  render() {
    const {
      title,
      subtitle,
      titleStyle,
      contentStyle,
      subtitleStyle,
      children,
      style,
      childrenView,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <View accessibilityLabel={'panel'}>
        <PanelHeader
          accessibilityLabel={'panel_header'}
          titleStyle={titleStyle}
          title={title}
          subtitle={subtitle}
          subtitleStyle={subtitleStyle}
        />
        <CardView
          accessibilityLabel={accessibilityLabel || 'panel_content'}
          style={[styles.content, contentStyle]}
          {...props}
        >
          {children}
        </CardView>
        {childrenView}
      </View>
    );
  }
}
