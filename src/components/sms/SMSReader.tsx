import * as React from 'react';
import {View} from 'react-native';

export interface SMSReaderProps {
  onCheckPermissions?: (allowed: boolean) => void;
  onReadCode: (code: string) => void;
  alphanumeric?: boolean;
  format?: any;
}

export interface SMSReaderState {}

export default class SMSReader extends React.Component<
  SMSReaderProps,
  SMSReaderState
> {
  timeout!: NodeJS.Timeout;

  componentDidMount() {
    /**
     * este timeout es intencional, para prevenir que la propiedad `onCheckPermissions`
     * se llame al montarse el componente, ya que el teclado virtual en android
     * necesita al menos 100ms en renderizarse y hay casos en los que este componente
     * se inicializa junto con algun `TextInputCode`
     */
    this.timeout = setTimeout(() => {
      this.checkPermissions();
    }, 200);
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
  }

  checkPermissions = () => {
    const {onCheckPermissions} = this.props;
    if (typeof onCheckPermissions === 'function') {
      onCheckPermissions(false);
    }
  };

  render() {
    return <View />;
  }
}
