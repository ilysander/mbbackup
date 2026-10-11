const moment = require('moment');
import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  Image,
  ImageStyle,
  View,
  Platform,
} from 'react-native';

import API from '../../../api';
import {
  DepositsItem,
  DepositsStatementsItem,
} from '../../../api/backend/response/Execute';
import { AlertEvent } from '../../../components/alert/AlertManager';
import ResumeAccount from '../../../components/dpf/ResumeAccount';
import EmptyMovementItem from '../../../components/savings/EmptyMovementItem';
import MovementItem from '../../../components/savings/MovementItem';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  CardView,
  Container,
  Content,
  KeyboardAvoidingView,
  Loading,
  NetworkStatusAlert,
  SafeAreaView,
  Touchable,
  AlertModal,
} from '../../../components/ui';
import { Colors } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import {
  Font,
  Sanitizer,
  Validate,
  Linking,
} from '../../../resources/functions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';
import ExpandableView from '../../../components/ui/ExpandableView';
import Config from '../../../Config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  networkStatus: { marginBottom: 10 } as ViewStyle,
  panelStyle: { marginBottom: 20 } as ViewStyle,
  resumeAccount: {
    marginBottom: 10,
  } as ViewStyle,
  movementsTitle: {
    marginBottom: 5,
    ...Font({ weight: 'Bold' }),
    fontSize: 22,
    color: Colors.primary,
  } as TextStyle,
  moreIcon: {
    tintColor: Colors.grey4,
    width: 6,
    height: 12,
    resizeMode: 'contain',
  } as ImageStyle,
  containerMoreOptions: {
    flexDirection: 'row',
    flex:1,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent:'center',
  } as ViewStyle,
  daysLeft: {
    ...Font({ weight: 'Bold' }),
    color: Colors.danger,
  } as TextStyle,
  closeDpfTitle: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  alertTitle: {
    color: Colors.danger,
    paddingTop: 10,
  } as TextStyle,
  alertIcon: {
    tintColor: Colors.danger,
    height: 32,
    width: 32,
  } as ImageStyle,
  cardViewMoreOptions: {
    marginBottom: 50,
  } as ViewStyle,
  expandableView: {
    padding: 10,
  } as ViewStyle,
  emptyMovements: {
    marginHorizontal: 20,
    marginVertical: 68,
    ...Font({ weight: 'Medium' }),
    fontSize: 13,
    color: Colors.grey4,
    textAlign: 'center',
  } as TextStyle,
  emptyView: {
    marginBottom: 30,
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey4,
    shadowOffset: { height: 4, width: 0 },
    borderRadius: 8,
    overflow: 'visible',
    borderStyle: 'dashed',
    borderColor: Colors.grey4,
    borderWidth: 1,
  },
});

const TAG = '[DPFScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isShowModalCancel: boolean;
  isLoading: boolean;
  emptyData: boolean;
  statements: DepositsStatementsItem[];
  account?: DepositsItem;
  headerDate?: string;
}

class DPFScreen extends React.Component<Props & FocusedProps, State> {

  state: State = {
    isShowModalCancel: false,
    isLoading: false,
    statements: [],
    account: undefined,
    emptyData: false,
  };

  componentDidMount() {
    const { route } = this.props;
    const item = route.params && route.params.item;
    this.setState({ account: item });
  }

  load = async () => {
    const { isLoading, account } = this.state;
    if (isLoading) {
      Log.info(TAG, 'load', 'now already isLoading');
      return;
    }
    if (!account) {
      return;
    }
    this.setState({ isLoading: true });
    await this.loadMovements(account.idProduct);
    this.setState({ isLoading: false });
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  loadMovements = async (idAccount: string) => {
    try {
      const response = await API.Execute.depositsListStatements(idAccount);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.data.statements) {
        // headerDate: Se hicieron pruebas y aun sale la fecha como 'Date' cuando deberia ser 'date'
        this.setState({
          statements: Sanitizer.uniqueArray(
            response.body.data.statements,
            response
          ),
          headerDate: response.headers.date || response.headers.Date,
        });
        this.setState({
          emptyData: true,
        });
      } else {
        this.setState({
          emptyData: true,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'loadMovementsAccount', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadMovementsAccount',
        e,
      });
    }
  };

  tryCloseDPF = () => {
    this.setState({ isShowModalCancel: true });
  };

  closeModalCancel = () => {
    this.setState({ isShowModalCancel: false });
  };

  closeDPFWeb = async () => {
    try {
      await Linking.openURL(Config.settings.dpfListUrl);
      this.setState({ isShowModalCancel: false });
    } catch (e) {
      Log.debug(TAG, 'closeDPFWeb', e);
    }
  };

  getMessageAlert = (
    account: DepositsItem | undefined,
    todayString?: string
  ) => {
    const initialDate = account
      ? moment(account.openingDate, L.dpfscreen_messagealert_date_format)
      : null;
    const finalDate = account
      ? moment(account.closingDate, L.dpfscreen_messagealert_date_format)
      : null;
    const today = todayString
      ? moment(todayString, L.dpfscreen_messagealert_date_format).startOf('day')
      : null;

    let daysLeft = 0;
    let daysCurrent = 0;
    let isValid = false;
    if (initialDate && finalDate && today) {
      daysLeft = finalDate.diff(today, 'days') + 1;

      daysCurrent = today.diff(initialDate, 'days');
      isValid = true;
    }
    const isLessThanTheMinimum = daysCurrent < 30;
    const messageDaysLeft =
      daysLeft === 1
        ? '1 ' + L.dpfscreen_alertmodal_message_part2_day
        : daysLeft + L.dpfscreen_alertmodal_message_part2_days;
    return {
      messageDaysLeft,
      isLessThanTheMinimum,
      daysLeft,
      daysCurrent,
      isValid,
    };
  };

  render() {
    const { isFocused, navigation } = this.props;
    const {
      account,
      isLoading,
      statements,
      isShowModalCancel,
      headerDate,
      emptyData,
    } = this.state;
    // const statements:any[] = []
    const messageAlert = this.getMessageAlert(account, headerDate);
    return (
      <Container>
        <AlertModal
          title={L.dpfscreen_alertmodal_title}
          message={[
            messageAlert.daysLeft > 0 ? (
              <Text accessibilityLabel={'alertmodal_message'}>
                {L.dpfscreen_alertmodal_message_part1}
                <Text style={styles.daysLeft}>
                  {messageAlert.messageDaysLeft}
                </Text>
                {L.dpfscreen_alertmodal_message_part3}
                {messageAlert.isLessThanTheMinimum
                  ? L.dpfscreen_alertmodal_message_part4_no_interes
                  : L.dpfscreen_alertmodal_message_part4_less_interes}
              </Text>
            ) : messageAlert.isValid ? (
              L.dpfscreen_alertmodal_message_finished
            ) : (
              ''
            ),
          ]}
          visible={isShowModalCancel}
          titleStyle={styles.alertTitle}
          iconStyle={styles.alertIcon}
          icon={require('../../../assets/images/error-icon.png')}
          actionButton={{
            accessibilityLabel: 'dpfscreen_alertmodal_actionbutton',
            title: L.dpfscreen_alertmodal_actionbutton,
            preventClose: true,
            onPress: this.closeDPFWeb,
            typeColor: 'danger',
            light: true,
          }}
          cancelButton={{
            accessibilityLabel: 'dpfscreen_alertmodal_cancelbutton',
            title: L.dpfscreen_alertmodal_cancelbutton,
            preventClose: true,
            onPress: this.closeModalCancel,
            typeColor: 'neutral',
          }}
          onClose={this.closeModalCancel}
        />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            {!!account && (
              <ResumeAccount
                accessibilityLabel={'dpfscreen_resume'}
                account={account}
                style={styles.resumeAccount}
              />
            )}
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />

              <Text style={styles.movementsTitle}>
                {L.savingscreen_movements_title_personal}
              </Text>
              <View style={styles.panelStyle}>
                <CardView accessibilityLabel={'dpfscreen_panel_movements'}>
                  {isLoading && statements.length < 1 && (
                    <Loading margin={'large'} />
                  )}

                  {statements.length>0 &&!!account  && (<>
                  {statements.map((item, index)=>{
                    return (
                      <MovementItem key={index.toString()}
                            accessibilityLabel={'dpfscreen_movementitem'}
                            navigation={navigation}
                            item={item}
                            size={statements.length}
                            position={
                              index === 0
                                ? 'first'
                                : index === statements.length - 1
                                  ? 'last'
                                  : 'middle'
                            }
                            account={account}
                          />
                    )
                  })}
                  </>)}
                </CardView>

                {!isLoading && emptyData && statements.length < 1 && (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyMovements}>
                      {L.emptymovements_DPF}
                    </Text>
                  </View>
                )}
              </View>

              {statements.length > 0 && !isLoading && (
                <CardView style={[styles.cardViewMoreOptions]}>
                  <ExpandableView
                    accessibilityLabel={'dpfscreen_expandableview_others'}
                    labelLess={L.dpfscreen_expandableview_labelless}
                    labelMore={L.dpfscreen_expandableview_labelmore}
                    maxHeight={45}
                    style={styles.expandableView}
                    position={'top'}
                  >
                    <Touchable
                      accessibilityLabel={'dpfscreen_expandableview_button'}
                      style={[styles.containerMoreOptions]}
                      onPress={this.tryCloseDPF}
                    >
                        <Text
                          style={[styles.closeDpfTitle]}
                          accessibilityLabel={
                            'dpfscreen_expandableview_others_btn_close_label'
                          }
                        >
                          {L.dpfscreen_expandableview_touchable_close_dpf}
                        </Text>

                        <Image
                          accessibilityLabel={
                            'dpfscreen_expandableview_others_btn_close_icon'
                          }
                          source={require('../../../assets/images/arrow-icon.png')}
                          resizeMode={'contain'}
                          style={styles.moreIcon}
                        />

                    </Touchable>
                  </ExpandableView>
                </CardView>
              )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type DPFScreenType = DPFScreen;
export default withFocused<DPFScreen, Props>(DPFScreen);
