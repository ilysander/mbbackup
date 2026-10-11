import Instabug, { NetworkLogger, BugReporting } from 'instabug-reactnative';
import * as React from 'react';
import { View, Platform } from 'react-native';
import Config from '../../Config';
import Colors from '../../resources/constants/Colors';

export interface FeedbackManagerProps {
  accessibilityLabel: string;
}

export interface FeedbackManagerState { }

export default class FeedbackManager extends React.Component<
  FeedbackManagerProps,
  FeedbackManagerState
> {
  static bugReporting() {
    BugReporting.show(BugReporting.reportType.feedback, [
      BugReporting.option.emailFieldOptional,
    ]);
  }

  componentDidMount() {
    Instabug.startWithToken(Config.settings.instabugAPIKey, [
      Instabug.invocationEvent.none,
    ]);
    if (Platform.OS === 'ios') {
      Instabug.setPrimaryColor(Colors.primaryLight);
    }
    Instabug.setLocale(Instabug.locale.spanish);
    Instabug.setReproStepsMode(Instabug.reproStepsMode.disabled);
    Instabug.setEnabledAttachmentTypes(true, false, false, false);
    Instabug.setViewHierarchyEnabled(true);

    BugReporting.setInvocationOptions([
      BugReporting.invocationOptions.emailFieldOptional,
    ]);
    NetworkLogger.setEnabled(false);
    BugReporting.setReportTypes([BugReporting.reportType.question]);

    //Version 11.9
    // Instabug.init({
    //   token:Config.settings.instabugAPIKey,
    //   invocationEvents:[
    //     Instabug.invocationEvent.none
    //   ]

    // })


    // // Instabug.startWithToken(Config.settings.instabugAPIKey, [
    // //   Instabug.invocationEvent.none,
    // // ]);
    // // if (Platform.OS === 'ios') {
    //   Instabug.setPrimaryColor(Colors.primaryLight);
    // // }
    // Instabug.setLocale(Instabug.locale.spanish);
    // Instabug.setReproStepsMode(Instabug.reproStepsMode.disabled);

    // BugReporting.setEnabledAttachmentTypes(true, false, false, false);
    // BugReporting.setViewHierarchyEnabled(true);

    // BugReporting.setOptions([
    //   BugReporting.option.emailFieldOptional,
    // ]);
    // NetworkLogger.setEnabled(false);
    // BugReporting.setReportTypes([BugReporting.reportType.question]);
  }

  render() {
    const { accessibilityLabel } = this.props;
    return <View accessibilityLabel={accessibilityLabel} />;
  }
}
