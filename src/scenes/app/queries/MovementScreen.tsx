const moment = require('moment');
import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import API from '../../../api';
import {
  AccountsCAItem,
  StatementsItem,
} from '../../../api/backend/response/Execute';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  TextInput,
  Touchable,
  TextHelp,
  CardView,
} from '../../../components/ui';
import { Colors, TransactionType } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { Font } from '../../../resources/functions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';
import { Amount } from '../../../resources/money';
import { KeyboardUtil } from '../../../resources/util';
import { AlertEvent } from '../../../components/alert/AlertManager';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../components/transactions/ShareReceipt';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  labelForm: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
    marginBottom: 1,
  } as TextStyle,
  textForm: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 14,
    marginBottom: 15,
  } as TextStyle,
  containerBottom: {
    marginTop: 0,
    marginBottom: 0,
    alignItems: 'flex-end',
  } as ViewStyle,
  balanceTextIncome: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 22,
    marginBottom: 9,
    marginTop: 10,
  } as TextStyle,
  balanceTextExpenses: {
    ...Font({ weight: 'Bold' }),
    color: Colors.danger,
    fontSize: 17,
    marginBottom: 9,
    marginTop: 10,
  } as TextStyle,
  buttonShare: {
    position: 'absolute',
    width: 30,
    height: 30,
    right: 0,
  } as ViewStyle,
  buttonsContainer: {
    paddingVertical: 5,
  } as ViewStyle,
  inputSimple: {
    marginLeft: 0,
    color: Colors.secondary,
  } as ViewStyle,
  inputStyle: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  imageShareStyle: {
    width: 24.44,
    height: 26.22,
    tintColor: Colors.primary,
    resizeMode: 'contain',
  } as ImageStyle,
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  descriptionHelpText: {
    textAlign: 'right',
    marginTop: 5,
    color: Colors.accentDark,
  } as TextStyle,
  labelNoteText: {
    marginBottom: 0,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
  } as TextStyle,
  inputContainer: {
    marginTop: 0,
    marginBottom: 15,
  } as ViewStyle,
  save: {
    minHeight: 30,
    paddingHorizontal: 21,
    marginBottom: 10,
  } as ViewStyle,
  textStyle: {
    fontSize: 14,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  cardView: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
});

const TAG = '[MovementScreen]';
const LoadingDuration = 2 * 1000;

export interface NavigationParams {
  account: AccountsCAItem;
  item: StatementsItem;
}
export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, NavigationParams>;
}

export interface State {
  isLoading: boolean;
  newNote: string;
  note: string;
  item?: StatementsItem;
  account?: AccountsCAItem;
  isNoteFocused: boolean;
  hasNoteChanged: boolean;
  showSaveButton: boolean;
}

const MaxLength = {
  Note: 50,
};
class MovementScreen extends React.Component<Props & FocusedProps, State> {

  state: State = {
    isLoading: true,
    account: undefined,
    isNoteFocused: false,
    hasNoteChanged: false,
    newNote: '',
    note: '',
    showSaveButton: false,
  };
  shareView!: ShareReceipt | null;
  noteInput!: TextInput | null;

  goBack = () => {
    this.props.navigation.goBack();
  };

  componentDidMount() {
    this.loadDetails();
  }

  loadDetails() {
    const { route } = this.props;

    const item = route.params && route.params.item;
    const account = route.params && route.params.account;
    const note = item.note || '';
    this.setState({ note, item, account }, () => {
      this.noteInput && this.noteInput.setValue(note);
      this.loadMovement(account.idProduct, item.id.toString());
    });
  }

  loadMovement = async (idAccount: string, idStatement: string) => {
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.accountsListStatementDetails(
        idAccount,
        idStatement
      );

      if (response.body.code === API.ResponseCode.OK) {
        const note = response.body.data.note || '';
        this.noteInput && this.noteInput.setValue(note);
      }
    } catch (e) {
      Log.exception(TAG, 'loadMovement', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadMovement',
        e,
      });
    }
    this.setState({ isLoading: false });
  };
  saveNote = async () => {
    const { account, item } = this.state;
    if (!account || !item) {
      return;
    }
    try {
      const note = this.noteInput
        ? this.noteInput.getValue().replace(/\s/g, ' ')
        : '';
      const response = await API.Execute.notesEditStatementNote(
        account.idProduct,
        item.id.toString(),
        note
      );
      if (response.body.code === API.ResponseCode.OK) {
        const note = response.body.data.note || '';
        this.setState({ note, hasNoteChanged: false, showSaveButton: false });
        setTimeout(() => {
          Emitter.emit('onToast', {
            message: L.movementscreen_toast_message,
          });
        }, LoadingDuration);
      }
    } catch (e) {
      Log.exception(TAG, 'saveNote', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'saveNote',
        e,
      });
    }
  };

  submit = async () => {
    KeyboardUtil.hide();
    this.setState({ isLoading: true });
    await this.saveNote();
    this.setState({ isLoading: false });
  };

  onChangeText = (newNote: string) => {
    const { note } = this.state;
    this.setState({ newNote, hasNoteChanged: newNote !== note });
  };

  onFocusNote = () => {
    this.setState({ isNoteFocused: true }, this.activeSaveButton);
  };

  onBlurNote = () => {
    this.setState({ isNoteFocused: false }, this.activeSaveButton);
  };

  share = async () => {
    this.shareView &&
      this.shareView.shareConstance(L.movementscreen_shareconstance_title);
  };

  activeSaveButton = () => {
    const { isNoteFocused, hasNoteChanged } = this.state;
    let showSaveButton = isNoteFocused;
    if (isNoteFocused) {
      showSaveButton = isNoteFocused;
    } else {
      if (hasNoteChanged) {
        showSaveButton = !isNoteFocused;
      } else {
        showSaveButton = isNoteFocused;
      }
    }
    this.setState({ showSaveButton });
  };

  dateValidation = (dateValid: any) => {
    const dateMovement = moment(dateValid);
    if (dateMovement.get('hour') == 0 && dateMovement.get('minute') == 0) {
      return dateMovement.format(L.movementscreen_text_date_format);
    } else {
      return dateMovement.format(L.movementscreen_date_format_constance);
    }
  };

  generateDataReceipt = (
    dateHourFormat: any,
    amountFormatted: number,
    reference: any
  ) => {
    const { item, account } = this.state;
    const content: ShareReceiptItem[] = [];
    if (!account || !item) {
      return null;
    }
    reference = item.reference;
    content.push({
      title: L.movementscreen_label_amount_transferred,
      details: [`${amountFormatted}`],
    });
    content.push({
      title: L.movementscreen_label_description,
      details: [item.comment],
    });
    content.push({
      title: L.movementscreen_label_date_and_hour,
      details: [dateHourFormat],
    });
    content.push({
      title: L.movementscreen_label_numbersoperation,
      details: [reference],
    });
    return content;
  };
  render() {
    const { isFocused } = this.props;
    const {
      item,
      account,
      newNote,
      isNoteFocused,
      hasNoteChanged,
      isLoading,
      showSaveButton,
    } = this.state;
    if (!account || !item) {
      return null;
    }
    let styleAmount = styles.balanceTextIncome;
    let amountBase = item.amount;
    if (item.type === TransactionType.DEBIT) {
      styleAmount = styles.balanceTextExpenses;
      if (amountBase > 0) {
        amountBase *= -1;
      }
    }

    const dateMovement = moment(
      item.date,
      L.movementscreen_date_format_statement
    ).format(L.movementscreen_text_date_format);

    const dateHourFormat = moment(
      dateMovement,
      L.movementscreen_text_date_format
    ).format(L.movementscreen_date_format_constance);

    const amountFormatted = Amount.format(amountBase, account.currency);
    const amountFormattedForRecipe = Amount.format(
      amountBase >= 0 ? amountBase : -amountBase,
      account.currency
    );
    const content = this.generateDataReceipt(
      dateHourFormat,
      amountFormattedForRecipe,
      item.reference
    );
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert />
              <CardView style={styles.cardView}>
                <View style={styles.rowContainer}>
                  <Text
                    style={styleAmount}
                    accessibilityLabel={'movementscreen_text_amount_value'}
                  >
                    {amountFormatted}
                  </Text>
                  <Touchable
                    style={styles.buttonShare}
                    onPress={this.share}
                    accessibilityLabel={'movementscreen_button_share'}
                  >
                    <Image
                      accessibilityLabel={'movementscreen_button_share_icon'}
                      source={require('../../../assets/images/share-icon.png')}
                      style={styles.imageShareStyle}
                    />
                  </Touchable>
                </View>

                <View>
                  <Text
                    style={styles.labelForm}
                    accessibilityLabel={'movementscreen_text_gloss_label'}
                  >
                    {L.movementscreen_text_gloss}
                  </Text>
                  <Text
                    style={styles.textForm}
                    accessibilityLabel={'movementscreen_text_gloss_value'}
                  >
                    {item.comment}
                  </Text>
                </View>
                <View>
                  <Text
                    style={styles.labelForm}
                    accessibilityLabel={'movementscreen_text_date_label'}
                  >
                    {L.movementscreen_text_date}
                  </Text>
                  <Text
                    style={styles.textForm}
                    accessibilityLabel={'movementscreen_text_date_value'}
                  >
                    {dateHourFormat}
                  </Text>
                </View>
                <View>
                  <Text
                    style={styles.labelForm}
                    accessibilityLabel={'movementscreen_text_reference_label'}
                  >
                    {L.movementscreen_text_reference}
                  </Text>
                  <Text
                    style={styles.textForm}
                    accessibilityLabel={'movementscreen_text_reference_value'}
                  >
                    {item.reference}
                  </Text>
                </View>

                <View>
                  <Text
                    style={[styles.labelForm, styles.labelNoteText]}
                    accessibilityLabel={'movementscreen_text_note_label'}
                  >
                    {L.movementscreen_text_note}
                  </Text>
                  <View
                    accessibilityLabel={'movementscreen_note_value_container'}
                    style={{ flex: 1 }}
                  >
                    <View accessibilityLabel={'movementscreen_note_editable'}>
                      <TextInput
                        accessibilityLabel={'movementscreen_textinput_note'}
                        placeholder={L.movementscreen_textinput_note}
                        returnKeyType={'next'}
                        onChangeText={this.onChangeText}
                        ref={ref => {
                          this.noteInput = ref;
                        }}
                        showClearButton={hasNoteChanged}
                        onBlur={this.onBlurNote}
                        onFocus={this.onFocusNote}
                        maxLength={MaxLength.Note}
                        containerStyle={styles.inputContainer}
                        style={[styles.inputSimple, styles.inputStyle]}
                        help={
                          isNoteFocused ? (
                            <TextHelp style={styles.descriptionHelpText}>
                              {newNote.length}
                              {'/'}
                              {MaxLength.Note}
                            </TextHelp>
                          ) : (
                            undefined
                          )
                        }
                        multiline
                      />
                    </View>
                  </View>
                </View>
                {showSaveButton && (
                  <View style={styles.containerBottom}>
                    <Button
                      accessibilityLabel={'movementscreen_button_save_note'}
                      disabled={!hasNoteChanged}
                      onPress={this.submit}
                      loading={isLoading}
                      style={styles.save}
                      small
                      textStyle={styles.textStyle}
                      title={isLoading ? '' : L.movementscreen_button_save}
                    />
                  </View>
                )}
              </CardView>
              <ShareReceipt
                ref={ref => {
                  this.shareView = ref;
                }}
                title={L.movementscreen_shareconstance_title}
                content={content ? content : []}
              />
            </Content>
          </SafeAreaView>
          <ShareReceipt
            ref={ref => {
              this.shareView = ref;
            }}
            title={L.movementscreen_shareconstance_title}
            content={content ? content : []}
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type MovementScreenType = MovementScreen;
export default withFocused<MovementScreen, Props>(MovementScreen);
