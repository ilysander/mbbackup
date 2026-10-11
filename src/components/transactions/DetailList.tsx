import * as React from 'react';
import DetailItem, { DetailItemProps } from './DetailItem';

export interface DetailListProps {
  elements: DetailItemProps[];
}

export interface DetailListState {}

export default class DetailList extends React.Component<
  DetailListProps,
  DetailListState
> {
  render() {
    const { elements } = this.props;
    return elements.map((item, index) => {
      return <DetailItem {...item} key={index.toString()} />;
    });
  }
}
