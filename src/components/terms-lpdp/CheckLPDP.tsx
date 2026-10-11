import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Session from '../../api/Session';
import { AnalyticsLabelsType } from '../../resources/analytics';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import ReminderAlertService from '../../resources/persistence/ReminderAlertService';
import { CardView, CheckBox, Touchable } from '../ui';

const styles = StyleSheet.create({
  termsTextBold: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    textAlign: 'left',
    fontSize: 14,
    paddingLeft: 5,
  } as TextStyle,
  termsText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  card: {
    marginTop: 20,
  } as ViewStyle,
});
export interface Props {
  showTermsLpdp: () => void;
  dni?: string;
  accessibilityLabelCheck: AnalyticsLabelsType;
  accessibilityLabelLinkOpenModal: AnalyticsLabelsType;
}

interface State {
  showReminderLpdp: boolean;
}

const TAG = '[CheckLPDP]';
export default class CheckLPDP extends React.Component<Props, State> {
  state = {
    showReminderLpdp: false,
  };

  checkTermsLpdp!: CheckBox | null;

  getDocument = () => {
    let { dni } = this.props;
    if (!dni) {
      dni = Session.getDocumentNumber();
    }
    return dni;
  };

  async componentDidMount() {
    const dni = this.getDocument();
    if (!dni) {
      return;
    }
    const showReminderLpdp = await ReminderAlertService.verifyLPDP(dni);
    this.setState({ showReminderLpdp });
  }

  getValueCheck = () => {
    return this.checkTermsLpdp ? this.checkTermsLpdp.getValue() : false;
  };

  trySave = () => {
    try {
      const dni = this.getDocument();
      const isValidated = !!Session.dataLpdp.data.value;
      const isChecked = this.getValueCheck();
      if (!!dni && !isValidated && !!isChecked) {
        let docType = Session.getDocumentType();

        const documentCountry = Session.getDocumentCountry();
        if (!docType) {
          docType = '1'; // registro
        }

        ReminderAlertService.updateLPDP(
          docType,
          dni,
          isChecked ? '1' : '0',
          documentCountry
        );
      }
    } catch (e) {
      Log.info(TAG, (e as any).message);
    }
  };

  render() {
    const { showReminderLpdp } = this.state;
    const {
      showTermsLpdp,
      accessibilityLabelCheck,
      accessibilityLabelLinkOpenModal,
    } = this.props;

    if (!showReminderLpdp) {
      return <View />;
    }

    return (
      <CardView padding style={styles.card}>
        <CheckBox
          ref={ref => {
            this.checkTermsLpdp = ref;
          }}
          accessibilityLabel={accessibilityLabelCheck}
          rightContainer={
            <Touchable
              accessibilityLabel={accessibilityLabelLinkOpenModal}
              onPress={showTermsLpdp}
              style={{ paddingHorizontal: 10 }}
            >
              <Text style={styles.termsText}>
                {L.updateemailconfirmscreen_chck_term_lpdp_part1}
                <Text style={styles.termsTextBold}>
                  {L.updateemailconfirmscreen_chck_term_lpdp_part2}
                </Text>
                {L.updateemailconfirmscreen_chck_term_lpdp_part3}
              </Text>
            </Touchable>
          }
        />
      </CardView>
    );
  }
}
