import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Size from '../../resources/dimensions/Size';
import {Log} from '../../resources/log';
import ScrollMore from '../ui/ScrollMore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  } as ViewStyle,
});

export interface MoreProps {
  moreButton: React.ReactNode;
  forwardedRef: any;
  ref: any;
}

export interface MoreContainerProps {
  forwardedRef: any;
}

export interface MoreContainerState {
  heightScroll: number;
  isNearBorder: boolean;
  showMoreButton: boolean;
  currentOffset: number;
  contentHeight: number;
  scrollY: number;
  keyboardHeight: number;
  slideAnim: Animated.Value;
}

const DisabledPosition = -100;
const TAG = '[MoreContainer]';

export function withMore<T, P>(WrappedComponent: React.ComponentType<any>) {
  class MoreContainer extends React.Component<
    P & MoreContainerProps & ScrollViewProps,
    MoreContainerState
  > {
    static navigationOptions: NativeStackNavigationOptions =
      // @ts-ignore
      WrappedComponent.navigationOptions || {};

    state: MoreContainerState = {
      heightScroll: Size.getVisibleHeight(),
      isNearBorder: false,
      showMoreButton: false,
      currentOffset: 0,
      scrollY: 0,
      keyboardHeight: 0,
      contentHeight: 0,
      slideAnim: new Animated.Value(DisabledPosition),
    };
    isReallyMounted!: boolean;
    scroll!: T | any;
    timeout!: NodeJS.Timeout;
    delayUpdate!: NodeJS.Timeout;

    componentDidMount() {
      this.isReallyMounted = true;
    }

    componentWillUnmount() {
      this.isReallyMounted = false;
      this.delayUpdate && clearTimeout(this.delayUpdate);
    }

    onContentSizeChange = async (
      contentWidth: number,
      contentHeight: number,
    ) => {
      const {onContentSizeChange} = this.props;
      typeof onContentSizeChange === 'function' &&
        onContentSizeChange(contentWidth, contentHeight);

      this.setState({contentHeight}, () => {
        this.requireUpdateShowButton();
      });
    };

    onLayout = async (e: LayoutChangeEvent) => {
      const heightScroll = e.nativeEvent.layout.height;
      this.setState({heightScroll}, () => {
        this.requireUpdateShowButton();
      });
      const {onLayout} = this.props;
      typeof onLayout === 'function' && onLayout(e);
    };

    requireUpdateShowButton = () => {
      this.delayUpdate && clearTimeout(this.delayUpdate);
      this.delayUpdate = setTimeout(() => {
        this.updateShowButton();
      }, 200);
    };

    updateShowButton = async () => {
      const {contentHeight, heightScroll} = this.state;

      const minimalContentHeight = this.getMinimalContentHeight(contentHeight);
      const showMoreButton = minimalContentHeight > heightScroll;
      let currentOffset = this.state.currentOffset;
      if (showMoreButton !== this.state.showMoreButton) {
        currentOffset = 0;
      }
      this.setState({
        showMoreButton,
        currentOffset,
        isNearBorder: false,
      });
    };

    getMinimalContentHeight = (contentHeight: number) => {
      return contentHeight * 0.95;
    };

    onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {onScroll} = this.props;
      typeof onScroll === 'function' && onScroll(e);

      this.timeout && clearTimeout(this.timeout);

      const y = e.nativeEvent.contentOffset.y;
      this.timeout = setTimeout(async () => {
        if (!this.isReallyMounted) {
          return;
        }
        const {contentHeight, heightScroll} = this.state;
        const isNearBorder =
          y + heightScroll >= this.getMinimalContentHeight(contentHeight);
        Log.debug(
          TAG,
          'onScroll',
          y + heightScroll,
          contentHeight,
          isNearBorder,
        );
        this.setState({isNearBorder, scrollY: y});
      }, 400);
    };

    showMore = () => {
      Log.debug(TAG, 'showMore');
      const {scrollY, contentHeight, heightScroll} = this.state;
      let y = scrollY + heightScroll - 30;
      const maxY = contentHeight - heightScroll;
      y = y > maxY ? maxY : y;
      this.scrollTo(y);
      this.setState({scrollY: y});
    };

    scrollTo = (y: number) => {
      if (!this.scroll) {
        return;
      }
      if (typeof this.scroll.scrollToOffset === 'function') {
        this.scroll.scrollToOffset({offset: y, animated: true});
      } else {
        this.scroll.scrollTo({y, animated: true});
      }
    };

    componentDidUpdate() {
      const {slideAnim, showMoreButton, isNearBorder} = this.state;
      const showButton = showMoreButton && !isNearBorder;
      if (showButton) {
        Animated.timing(slideAnim, {
          toValue: 0,
          easing: Easing.inOut(Easing.ease),
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: DisabledPosition,
          easing: Easing.inOut(Easing.ease),
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }

    render() {
      const {slideAnim} = this.state;
      const {forwardedRef, ...props} = this.props;
      const opacityAnim = slideAnim.interpolate({
        inputRange: [DisabledPosition, DisabledPosition / 3, 0],
        outputRange: [0, 0, 1],
      });
      const moreButton = (
        <ScrollMore
          key={'more'}
          accessibilityLabel={'morecontainer_scrollmore'}
          style={{bottom: slideAnim, opacity: opacityAnim} as any}
          onPress={this.showMore}
        />
      );
      return (
        <View accessibilityLabel={'morecontainer'} style={styles.container}>
          <WrappedComponent
            scrollEventThrottle={100}
            {...props}
            forwardedRef={(ref: T | null) => {
              this.scroll = ref;
              forwardedRef && forwardedRef(ref);
            }}
            moreButton={moreButton}
            onContentSizeChange={this.onContentSizeChange}
            onScroll={this.onScroll}
            onLayout={this.onLayout}
          />
        </View>
      );
    }
  }

  return React.forwardRef<T, P & ScrollViewProps>((props, ref) => {
    return <MoreContainer {...props} forwardedRef={ref} />;
  });
}
