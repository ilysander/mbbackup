import * as React from 'react';
import {
  FlatList as FlatListBase,
  FlatListProps as FlatListPropsBase,
} from 'react-native';
import { MoreProps, withMore } from '../screen/MoreContainer';

export interface FlatListProps<ItemT> extends FlatListPropsBase<ItemT> {}

export interface FlatListState {}

class FlatListContainer<ItemT> extends React.Component<
  FlatListProps<ItemT> & MoreProps,
  FlatListState
> {
  render() {
    const { forwardedRef, moreButton, ref, ...props } = this.props;

    return [
      <FlatListBase
        key={'list'}
        accessibilityLabel={'flatlist'}
        ref={ref || forwardedRef}
        {...props}
      />,
      moreButton,
    ];
  }
}

const FlatList = withMore<FlatListBase<any>, FlatListProps<any>>(
  FlatListContainer
);
export default FlatList;
