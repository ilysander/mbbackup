import * as React from 'react';
import {
  ImageStyle,
  Modal as BaseModal,
  ModalProps as BaseModalProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ScrollView,
  StatusBar,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import ButtonImage from './ButtonImage';
import KeyboardSpacing from './KeyboardSpacing';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.modal,
  } as ViewStyle,
  container: {
    paddingHorizontal: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  } as ViewStyle,
  content: {
    backgroundColor: Colors.white,
    marginVertical: 40,
    marginHorizontal: 20,
    borderRadius: 6,
    width: '100%',
    alignSelf: 'center',
  } as ViewStyle,
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
  headerTitle: {
    flex: 1,
  } as ViewStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 18,
    lineHeight: 22,
  } as TextStyle,
  subtitleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.secondary,
    fontSize: 14,
  } as TextStyle,
  closeButtonImage: {
    width: 20,
    height: 20,
    tintColor: Colors.grey4,
  } as ImageStyle,
});

export interface ModalProps extends BaseModalProps {
  title?: string;
  onClose?: () => void;
  headerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  withCloseButton?: boolean;
  accessibilityLabel?: string;
  hiddenSubtitle?: boolean;
  subtitle?: string;
  styleSubtitle?: StyleProp<TextStyle>;
  titleCenter?: boolean;
}

export interface ModalState {}

export default class Modal extends React.Component<ModalProps, ModalState> {
  static defaultProps = {
    hiddenSubtitle: true,
    titleCenter: false,
  };

  render() {
    const {
      title,
      hiddenSubtitle,
      subtitle,
      styleSubtitle,
      visible,
      children,
      onClose,
      style,
      headerStyle,
      titleStyle,
      containerStyle,
      contentStyle,
      withCloseButton,
      accessibilityLabel,
      titleCenter,
      ...props
    } = this.props;

    return (
      <BaseModal
        visible={visible}
        animationType={'fade'}
        transparent
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        onRequestClose={() => {
          if (typeof onClose === 'function') {
            onClose();
          }
        }}
        {...props}
      >
        <StatusBar
          backgroundColor={Colors.grey4}
          barStyle={'dark-content'}
          animated
        />
        <KeyboardSpacing style={[styles.container, containerStyle]}>
          <Touchable
            activeOpacity={1}
            style={styles.overlay}
            onPress={onClose}
            accessibilityLabel={'modal_overlay'}
          />
          <View
            accessibilityLabel={accessibilityLabel || 'modal_content'}
            style={[styles.content, !title && { paddingTop: 30 }, contentStyle]}
          >
            <ScrollView bounces={false} keyboardShouldPersistTaps={'handled'}>
              {withCloseButton && titleCenter && (
                <View
                  style={{
                    alignItems: 'flex-end',
                    paddingRight: 20,
                    paddingTop: 20,
                  }}
                >
                  <ButtonImage
                    accessibilityLabel={'modal_buttonimage_close'}
                    onPress={onClose}
                    imageSource={require('../../assets/images/icon-close.png')}
                    imageStyle={styles.closeButtonImage}
                    hitSlop={{ bottom: 10, top: 10, right: 10, left: 10 }}
                  />
                </View>
              )}
              {!!title && (
                <View
                  accessibilityLabel={'modal_header'}
                  style={[
                    styles.header,
                    titleCenter && { paddingTop: 10 },
                    headerStyle,
                  ]}
                >
                  <View style={styles.headerTitle}>
                    <Text
                      accessibilityLabel={'modal_text_title'}
                      style={[
                        styles.titleText,
                        titleCenter && { textAlign: 'center' },
                        titleStyle,
                      ]}
                    >
                      {title}
                    </Text>
                    {!hiddenSubtitle && (
                      <Text
                        accessibilityLabel={'modal_text_title'}
                        style={
                          !hiddenSubtitle && [
                            styles.subtitleText,
                            styleSubtitle,
                          ]
                        }
                      >
                        {subtitle}
                      </Text>
                    )}
                  </View>
                  {withCloseButton && !titleCenter && (
                    <ButtonImage
                      accessibilityLabel={'modal_buttonimage_close'}
                      onPress={onClose}
                      imageSource={require('../../assets/images/icon-close.png')}
                      imageStyle={styles.closeButtonImage}
                      hitSlop={{ bottom: 10, top: 10, right: 10, left: 10 }}
                    />
                  )}
                </View>
              )}
              <View accessibilityLabel={'modal_body'} style={style}>
                {children}
              </View>
            </ScrollView>
            {withCloseButton && !title && !titleCenter && (
              <View
                style={{ position: 'absolute', flex: 1, top: 20, right: 20 }}
              >
                <View
                  style={{
                    alignItems: 'flex-end',
                  }}
                >
                  <ButtonImage
                    accessibilityLabel={'modal_buttonimage_close'}
                    onPress={onClose}
                    imageSource={require('../../assets/images/icon-close.png')}
                    imageStyle={styles.closeButtonImage}
                    hitSlop={{ bottom: 10, top: 10, right: 10, left: 10 }}
                  />
                </View>
              </View>
            )}
          </View>
        </KeyboardSpacing>
      </BaseModal>
    );
  }
}
