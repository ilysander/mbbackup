import * as React from 'react';
import { View } from 'react-native';

const walkthroughable = (WrappedComponent: any) => ({
  copilot,
  ...props
}: any) => <WrappedComponent {...copilot} {...props} />;

const WalkthroughableView = walkthroughable(View);

export default WalkthroughableView as any;
