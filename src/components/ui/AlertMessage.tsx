import * as React from 'react';
import InfoMessage, {
  InfoMessageDefaultProps,
  InfoMessageTouchableProps,
} from './InfoMessage';

export type AlertMessageProps =
  | InfoMessageDefaultProps
  | InfoMessageTouchableProps;

export interface AlertMessageState {}

export default class AlertMessage extends React.Component<
  AlertMessageProps,
  AlertMessageState
> {
  render() {
    const { ...props } = this.props;
    return (
      <InfoMessage
        imageSource={require('../../assets/images/error-icon.png')}
        typeColor={'danger'}
        {...props}
      />
    );
  }
}
