import * as React from 'react';
import {
  Animated,
  findNodeHandle,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  UIManager,
  ViewStyle,
} from 'react-native';
import {Size} from '../../resources/dimensions';
import {Emitter} from '../../resources/listeners';
import {Log} from '../../resources/log';
import {MoreProps, withMore} from '../screen/MoreContainer';
import KeyboardSpacing from './KeyboardSpacing';
import TextInputBase from './TextInputBase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  } as ViewStyle,
});

const TAG = '[KeyboardAvoidingView]';

export interface KeyboardDimensions {
  width: number;
  height: number;
}

export interface KeyboardAvoidingViewProps extends ScrollViewProps {
  enabled: boolean;
  children?: React.ReactNode[] | React.ReactChild;
}

export interface KeyboardAvoidingViewState {
  heightScroll: number;
  minHeightAnim: Animated.Value;
  scrollY: number;
  minHeight: number;
  keyboardDimensions?: KeyboardDimensions;
}

class KeyboardAvoidingViewContainer extends React.Component<
  KeyboardAvoidingViewProps & MoreProps,
  KeyboardAvoidingViewState
> {
  state: KeyboardAvoidingViewState = {
    heightScroll: Size.getVisibleHeight(),
    minHeightAnim: new Animated.Value(0),
    scrollY: 0,
    minHeight: 0,
    keyboardDimensions: undefined,
  };

  isReallyMounted!: boolean;
  scroll!: ScrollView;
  timeoutScroll!: NodeJS.Timeout;

  componentDidMount() {
    this.isReallyMounted = true;
    Emitter.on('onFocusTextInput', this.onFocusTextInput);
  }

  componentWillUnmount() {
    this.isReallyMounted = false;
    Emitter.off('onFocusTextInput', this.onFocusTextInput);
  }

  scrollToRef = (ref: TextInputBase) => {
    if (!this.scroll || !ref) {
      return;
    }

    const focusMode =
      typeof ref.getFocusMode === 'function' ? ref.getFocusMode() : '';
    const focusOffset =
      typeof ref.getFocusOffset === 'function' ? ref.getFocusOffset() : 0;
    if (focusMode === 'none') {
      Log.debug(TAG, 'focusMode', focusMode);
      return;
    }
    const scroll = findNodeHandle(this.scroll);

    scroll &&
      ref.measureLayout(
        scroll,
        (_fx, fy, _width, height) => {
          if (!this.isReallyMounted) {
            return;
          }
          const {heightScroll, scrollY} = this.state;
          const containerHeight = heightScroll;

          if (!focusMode || focusMode === 'auto') {
            const diff = fy - scrollY;
            const autoOffset = diff < 5 || diff > containerHeight - height;

            if (autoOffset) {
              const y = fy - containerHeight / 2 + height / 2 + focusOffset;
              this.scroll.scrollTo({y, animated: true});
            }
          } else if (focusMode === 'center') {
            const y = fy - containerHeight / 2 + height / 2 + focusOffset;
            this.scroll.scrollTo({y, animated: true});
          } else if (focusMode === 'top') {
            const y = fy + focusOffset;
            this.scroll.scrollTo({y, animated: true});
          } else if (focusMode === 'bottom') {
            const y = fy - containerHeight + height + focusOffset;
            this.scroll.scrollTo({y, animated: true});
          }
        },
        () => {
          return;
        },
      );
  };

  onFocusTextInput = (input: TextInputBase) => {
    Log.debug(TAG, 'onFocusTextInput');

    if (this.timeoutScroll) {
      clearTimeout(this.timeoutScroll);
    }

    this.timeoutScroll = setTimeout(() => {
      try {
        // @ts-ignore
        UIManager.viewIsDescendantOf(
          findNodeHandle(input),
          // @ts-ignore
          this.scroll.getScrollResponder().getInnerViewNode(),
          (isAncestor: boolean) => {
            isAncestor &&
              requestAnimationFrame(() => {
                this.scrollToRef(input);
              });
          },
        );
      } catch (e) {
        Log.debug(TAG, 'onFocusTextInput', e);
      }
    }, 350);
  };

  onChangeContainerStyle = (keyboardDimensions?: KeyboardDimensions) => {
    const {contentContainerStyle} = this.props;
    const style = contentContainerStyle as any;
    if (style && style.minHeight) {
      const minHeight =
        style.minHeight - (keyboardDimensions ? keyboardDimensions.height : 0);

      this.setState({minHeight});
    }
  };
  onChangeDimensions = (keyboardDimensions?: KeyboardDimensions) => {
    this.setState({keyboardDimensions});
    this.onChangeContainerStyle(keyboardDimensions);
  };

  onLayout = (e: LayoutChangeEvent) => {
    const {onLayout} = this.props;
    const heightScroll = e.nativeEvent.layout.height;
    this.setState({heightScroll});
    typeof onLayout === 'function' && onLayout(e);
  };

  onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    this.setState({scrollY: y});
    const {onScroll} = this.props;
    typeof onScroll === 'function' && onScroll(e);
  };

  componentDidUpdate(prevProps: KeyboardAvoidingViewProps) {
    const {keyboardDimensions} = this.state;
    const {contentContainerStyle} = this.props;
    if (contentContainerStyle !== prevProps.contentContainerStyle) {
      this.onChangeContainerStyle(keyboardDimensions);
    }
  }

  render() {
    const {
      children,
      forwardedRef,
      contentContainerStyle,
      moreButton,
      enabled,
      ref,
      ...props
    } = this.props;
    const {minHeight} = this.state;

    return (
      <KeyboardSpacing
        type={'margin'}
        enabled={enabled}
        onChangeDimensions={this.onChangeDimensions}
        accessibilityLabel={'keyboardavoidingview'}
        style={styles.container}>
        <ScrollView
          accessibilityLabel={'keyboardavoidingview_scrollview'}
          scrollEventThrottle={100}
          {...props}
          ref={ref => {
            if (!ref) {
              return;
            }
            this.scroll = ref;
            forwardedRef(ref);
          }}
          contentContainerStyle={[
            contentContainerStyle,
            !!minHeight && {minHeight},
          ]}
          onScroll={this.onScroll}
          onLayout={this.onLayout}>
          {children}
        </ScrollView>
        {moreButton}
      </KeyboardSpacing>
    );
  }
}

const KeyboardAvoidingView = withMore<ScrollView, KeyboardAvoidingViewProps>(
  KeyboardAvoidingViewContainer,
);
export default KeyboardAvoidingView;
