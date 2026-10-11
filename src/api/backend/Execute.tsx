import Session from '../Session';
import Request, {
  Response,
  ResponseBody,
  ResponseReadTransactionBody,
  ResponseTransactionBody,
  ResponseThirdPartiesBody,
} from '../util/Request';
import { DefaultErrorResponse } from './response/Error';
import {
  AccountListResponse,
  AccountsListStatementDetailsResponse,
  AccountsListStatementsResponse,
  AccountsReadResponse,
  DepositCreatePreviewResponse,
  DepositListOptionsResponse,
  DepositsListStatementsResponse,
  DepositSunatDeclarationResponse,
  DesktopLoadLayoutResponse,
  LoansListResponse,
  LoansListStatementsResponse,
  LoansReadResponse,
  NotesEditStatementNoteResponse,
  PayLoanThirdPartiesSend7Response,
  PayLoanOwnPreview6Response,
  PayLoanOwnSend6Response,
  PreferencesUserDataModifyPreResponse,
  PreferencesUserdataModifySendResponse,
  PreferencesUserdataUpdateMailSendResponse,
  PreferencesUserdataUpdateMobilePhoneSendResponse,
  SessionChangeEnvironmentResponse,
  TransferInterbankInmediatePreviewResponse,
  TransferInterbankInmediateSendResponse,
  TransfersDynamicMessageResponse,
  TransfersFrequentContactsDeletePreResponse,
  TransfersFrequentContactsDeleteResponse,
  TransfersFrequentContactsEditResponse,
  TransfersFrequentContactsListResponse,
  TransfersInternalPreviewResponse,
  TransfersInternalSendResponse,
  TransfersLocalPreviewResponse,
  ThirdPartiesLocalPreviewResponse,
  TransfersLocalSendResponse,
  WidgetsExchangeRatesResponse,
  WidgetsProductsResponse,
  CoreProductChangeAliasResponse,
  ServicePaymentsResponse,
  ServicePaymentPreviewResponse,
  CompanyServiceListResponse,
  CompanyListResponse,
  ServicePaymentSendResponse,
  BillListResponse,
  CreditLineDisplayResponse,
  LoanRequestListOptions,
  LoanPreviewResponse,
  LoanRecalculateResponse,
  LoanPostponementPreviewResponse,
  LoanPostponementSendResponse,
  DigitalLoanPreviewResponse,
  DigitalLoanResponse,
  LoanRequestListOptionsChips,
  DigitalProductOptions,
} from './response/Execute';

export default class Execute {
  static async sessionChangeEnvironment(
    idEnvironmentToChange: string,
    setAsDefault: boolean
  ): Promise<Response<ResponseBody<SessionChangeEnvironmentResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idEnvironmentToChange,
      setAsDefault: setAsDefault.toString(),
    };
    return Request.post('execute/session.changeEnvironment', params, {
      headers: {
        authorization,
      },
    });
  }

  static async desktopLoadLayout(): Promise<
    Response<ResponseBody<DesktopLoadLayoutResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/desktop.loadLayout',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async widgetsExchangeRates(): Promise<
    Response<ResponseBody<WidgetsExchangeRatesResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/widgets.exchangeRates',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async widgetsProductMobile(): Promise<
    Response<ResponseBody<WidgetsProductsResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/widgets.products.mobile',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async widgetsProducts(): Promise<
    Response<ResponseBody<WidgetsProductsResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/widgets.products',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async transfersInternalPreview(
    amount: {
      quantity: string;
      currency: string;
    },
    originAccount: string,
    destinationAccount: string
  ): Promise<Response<ResponseBody<TransfersInternalPreviewResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      amount,
      originAccount,
      destinationAccount,
    };
    return Request.post('execute/transfers.internal.preview/4', params, {
      headers: {
        authorization,
      },
    });
  }

  static async transfersLocalPreview(
    amount: {
      quantity: string;
      currency: string;
    },
    debitAccount: string,
    toAccount: string
  ): Promise<
    Response<ResponseBody<TransfersLocalPreviewResponse | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      debitAccount,
      Amount: amount,
      ToAccount: toAccount,
    };
    return Request.post('execute/transfers.local.preview/5', params, {
      headers: {
        authorization,
      },
    });
  }

  static async thirdPartiesLocalPreview(
    valueDate: string,
    loan: string,
    amount: {
      currency: string;
      quantity: string;
    },
    debitAccount: string
  ): Promise<
    Response<
      ResponseThirdPartiesBody<
        ThirdPartiesLocalPreviewResponse | DefaultErrorResponse
      >
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      valueDate,
      loan,
      amount,
      debitAccount,
    };
    return Request.post('execute/pay.loan.thirdParties.preview/7', params, {
      headers: {
        authorization,
      },
    });
  }

  static async transfersLocalSend(
    isFrequentContact: string,
    frequentContact: string,
    _otp: string,
    toAccount: string,
    amount: {
      quantity: string;
      currency: string;
    },
    debitAccount: string
  ): Promise<
    Response<
      ResponseTransactionBody<TransfersLocalSendResponse | DefaultErrorResponse>
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      _otp,
      debitAccount,
      frequentContact,
      isFrequentContact,
      Amount: amount,
      valueDate: '',
      ToAccount: toAccount,
      aceptTermAndCondition: true,
    };
    return Request.post('execute/transfers.local.send/5', params, {
      headers: {
        authorization,
      },
      requireValidation: true,
    });
  }

  static async accountsRead(
    idAccount: string
  ): Promise<Response<ResponseBody<AccountsReadResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idAccount,
    };
    return Request.post('execute/accounts.read', params, {
      headers: {
        authorization,
      },
    });
  }

  static async accountsListStatements(
    idAccount: string,
    currency: string
  ): Promise<Response<ResponseBody<AccountsListStatementsResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idAccount,
      currency,
    };
    return Request.post('execute/accounts.listStatements', params, {
      headers: {
        authorization,
      },
    });
  }

  static async depositsListStatements(
    idDeposit: string
  ): Promise<Response<ResponseBody<DepositsListStatementsResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idDeposit,
    };
    return Request.post('execute/deposits.listStatements', params, {
      headers: {
        authorization,
      },
    });
  }

  static async accountsListStatementDetails(
    idAccount: string,
    idStatement: string
  ): Promise<Response<ResponseBody<AccountsListStatementDetailsResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idAccount,
      idStatement,
    };
    return Request.post('execute/accounts.listStatementDetails', params, {
      headers: {
        authorization,
      },
    });
  }

  static async notesEditStatementNote(
    idProduct: string,
    idStatement: string,
    note: string
  ): Promise<Response<ResponseBody<NotesEditStatementNoteResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idProduct,
      idStatement,
      note,
    };
    return Request.post('execute/notes.editStatementNote', params, {
      headers: {
        authorization,
      },
    });
  }

  static async loansListStatements(
    idLoan: string,
    currency: string
  ): Promise<Response<ResponseBody<LoansListStatementsResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idLoan,
      currency,
    };
    return Request.post('execute/loans.listStatements', params, {
      headers: {
        authorization,
      },
    });
  }

  static async loansList(): Promise<Response<ResponseBody<LoansListResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/loans.list',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async preferencesUserDataModifyPre(): Promise<
    Response<ResponseBody<PreferencesUserDataModifyPreResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/preferences.userData.modify.pre',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async preferencesUserdataUpdateMobilePhoneSend(
    mobilePhone: string
  ): Promise<
    Response<ResponseBody<PreferencesUserdataUpdateMobilePhoneSendResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      mobilePhone,
    };
    return Request.post(
      'execute/preferences.userdata.updateMobilePhone.send',
      params,
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async preferencesUserdataUpdateMailSend(
    mail: string
  ): Promise<
    Response<ResponseBody<PreferencesUserdataUpdateMailSendResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      mail,
    };
    return Request.post(
      'execute/preferences.userdata.updateMail.send',
      params,
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async preferencesUserdataModifySend(params: {
    _securitySeal: string;
    defaultEnvironment: string;
    mobilePhone?: string;
    mobilePhoneCode?: string;
    mail?: string;
    mailCode?: string;
    _atm: string;
    message: string | null | string[];
    promos: string | null | string[];
    userBlock: string | null | string[];
    loanExpiration: string | null | string[];
  }): Promise<Response<ResponseBody<PreferencesUserdataModifySendResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/preferences.userdata.modify.send', params, {
      headers: {
        authorization,
      },
    });
  }

  static async accountList(): Promise<
    Response<ResponseBody<AccountListResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/accounts.list',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async requestLoanRecalculate(params: {
    currency: string;
    productId: string;
    term: string;
    amount: string;
    payDay: string;
    graceType: string;
    gracePeriod: string;
    numberAffiliates: string;
    insurances: {
      ids: string;
    };
  }): Promise<Response<ResponseBody<LoanRecalculateResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/request.loan.recalculate', params, {
      headers: {
        authorization,
      },
    });
  }

  static async coreReadTransaction<T>(
    idTransaction: string
  ): Promise<Response<ResponseReadTransactionBody<T>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idTransaction,
    };
    return Request.post('execute/core.readTransaction', params, {
      headers: {
        authorization,
      },
    });
  }

  static async transfersInternalSend(request: {
    amount: {
      quantity: string;
      currency: string;
    };
    destinationAccount: string;
    originAccount: string;
  }): Promise<
    Response<ResponseTransactionBody<TransfersInternalSendResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/transfers.internal.send/4', request, {
      headers: {
        authorization,
      },
      requireValidation: true,
    });
  }

  static async transfersFrequentContactsList(): Promise<
    Response<ResponseBody<TransfersFrequentContactsListResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/transfers.frequentContacts.list',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async transfersFrequentContactsEdit(
    idFrequentContact: string,
    _alias: string,
    accountNumber: string
  ): Promise<Response<ResponseBody<TransfersFrequentContactsEditResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idFrequentContact,
      _alias,
      accountNumber,
    };
    return Request.post('execute/transfers.frequentContacts.edit', params, {
      headers: {
        authorization,
      },
    });
  }

  static async transfersFrequentContactsDeletePre(
    idFrequentContact: string
  ): Promise<
    Response<ResponseBody<TransfersFrequentContactsDeletePreResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idFrequentContact,
    };
    return Request.post(
      'execute/transfers.frequentContacts.deletePre',
      params,
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async transfersFrequentContactsDelete(
    idFrequentContact: string
  ): Promise<Response<ResponseBody<TransfersFrequentContactsDeleteResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idFrequentContact,
    };
    return Request.post('execute/transfers.frequentContacts.delete', params, {
      headers: {
        authorization,
      },
    });
  }

  static async loansRead(
    idAccount: string,
    refreshData: string
  ): Promise<Response<ResponseBody<LoansReadResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idAccount,
      refreshData,
    };
    return Request.post('execute/loans.read', params, {
      headers: {
        authorization,
      },
    });
  }

  static async payLoanOwnPreview6(
    loan: string,
    loanAmount: {
      amount: {
        currency: string;
        quantity: string;
      };
      otherAmountQuantity: string;
      pendingPayment: {
        dueDate: string;
        selected: string;
      };
      oldPayments: {
        amount: string;
        fees: string;
        selected: string;
      };
      lastDueDate: string;
      lastLoanId: string;
    },
    debitAccount: string,
    valueDate: string
  ): Promise<
    Response<ResponseBody<PayLoanOwnPreview6Response | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      loan,
      loanAmount,
      debitAccount,
      valueDate,
    };
    return Request.post('execute/pay.loan.own.preview/6', params, {
      headers: {
        authorization,
      },
    });
  }

  static async payLoanOwnSend6(
    loan: string,
    loanAmount: string,
    debitAccount: string,
    valueDate: string,
    aceptTermAndCondition: boolean
  ): Promise<Response<ResponseTransactionBody<PayLoanOwnSend6Response>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      loan,
      loanAmount,
      debitAccount,
      valueDate,
      aceptTermAndCondition: aceptTermAndCondition.toString(),
      isFrequentContact: false.toString(),
    };
    return Request.post('execute/pay.loan.own.send/6', params, {
      headers: {
        authorization,
      },
      requireValidation: true,
    });
  }

  static async payLoanThirdPartiesSend7(
    valueDate: string,
    isFrequentContact: boolean,
    aceptTermAndCondition: boolean,
    otp: string,
    loan: string,
    amount: {
      quantity: string;
      currency: string;
    },
    debitAccount: string
  ): Promise<
    Response<ResponseThirdPartiesBody<PayLoanThirdPartiesSend7Response>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      valueDate,
      isFrequentContact: isFrequentContact.toString(),
      aceptTermAndCondition: aceptTermAndCondition.toString(),
      otp,
      loan,
      amount,
      debitAccount,
    };
    return Request.post('execute/pay.loan.thirdParties.send/7', params, {
      headers: {
        authorization,
      },
    });
  }

  static async transferInterbankInmediatePreview(
    debitAccount: string,
    amount: {
      quantity: string;
      currency: string;
    },
    destinationAccount: string,
    _mail: string = '',
    transferReason: string = ''
  ): Promise<
    Response<ResponseBody<TransferInterbankInmediatePreviewResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      debitAccount,
      amount,
      transferReason,
      destinationAccount,
      _mail,
    };
    return Request.post(
      'execute/transfer.interbank.inmediate.preview/16',
      params,
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async transferInterbankInmediateSend(
    frequentContact: string,
    aceptTermAndCondition: string,
    destinationAccount: string,
    debitAccount: string,
    amount: {
      quantity: string;
      currency: string;
    },
    _mail: string,
    _otp: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        TransferInterbankInmediateSendResponse | DefaultErrorResponse
      >
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      isFrequentContact: !!frequentContact,
      frequentContact,
      aceptTermAndCondition,
      destinationAccount,
      debitAccount,
      amount,
      _mail,
      _otp,
    };
    return Request.post(
      'execute/transfer.interbank.inmediate.send/16',
      params,
      {
        headers: {
          authorization,
        },
        requireValidation: true,
      }
    );
  }

  static async transfersDynamicMessage(
    itemMsg: string,
    transferenceType: string
  ): Promise<Response<ResponseBody<TransfersDynamicMessageResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      itemMsg,
      transferenceType,
    };
    return Request.post('execute/transfers.dynamicMessage', params, {
      headers: {
        authorization,
      },
    });
  }

  static async depositSunatDeclaration(
    product: string
  ): Promise<Response<ResponseBody<DepositSunatDeclarationResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = { product };
    return Request.post('execute/deposits.sunatDeclaration', params, {
      headers: {
        authorization,
      },
    });
  }

  static async depositCreatePreview(
    valueDate: string,
    depositDetails: {
      amount: string;
      rate: string;
      generatedAmount: string;
      currency: string;
      term: string;
    },
    debitAccount: string,
    frequency: string,
    renewDeposit: string,
    creditAccount: string,
    _mail: string
  ): Promise<
    Response<ResponseBody<DepositCreatePreviewResponse | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      valueDate,
      depositDetails,
      debitAccount,
      frequency,
      renewDeposit,
      creditAccount,
      _mail,
    };
    return Request.post('execute/deposit.create.preview/9', params, {
      headers: {
        authorization,
      },
    });
  }

  static async depositCreateSend(params: {
    idTransaction: string;
    valueDate: string;
    isFrequentContact: string;
    aceptTermAndCondition: string;
    _otp: string;
    depositDetails: {
      amount: string;
      rate: string;
      generatedAmount: string;
      currency: string;
      term: string;
    };
    debitAccount: string;
    frequency: string;
    renewDeposit: string;
    creditAccount: string;
    _mail: string;
  }): Promise<Response<ResponseTransactionBody<any | DefaultErrorResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/deposit.create.send/9', params, {
      headers: {
        authorization,
      },
      requireValidation: true,
    });
  }

  static async depositListOptions(
    amount: string,
    currency: string
  ): Promise<Response<ResponseBody<DepositListOptionsResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      amount,
      currency,
    };
    return Request.post('execute/deposit.listOptions', params, {
      headers: {
        authorization,
      },
    });
  }

  static async coreProductChangeAlias(
    idProduct: string,
    alias: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        CoreProductChangeAliasResponse | DefaultErrorResponse
      >
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      idProduct,
      alias,
    };

    return Request.post('execute/core.product.changeAlias', params, {
      headers: {
        authorization,
      },
    });
  }

  static async servicepaymentsPre(): Promise<
    Response<ResponseTransactionBody<ServicePaymentsResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/servicepayments.pre',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async servicePaymentPreview(params: {
    valueDate: string;
    totalAmount: string;
    debitAccount: string;
    billSelector: {
      clientCode: string;
      companyGroupCode: string;
      companyCode: string;
      companyName: string | null;
      serviceCode: string | null;
      serviceName: string | null;
      added: string;
      state: string;
      emissionDate: string;
      expirationDate: string;
      payDate?: string | null;
      debtAmount: string;
      totalAmount: string;
      clientName: string;
      ticketNumber: string;
      supply: string;
      traceConsulta: string;
    };
  }): Promise<
    Response<ResponseBody<ServicePaymentPreviewResponse | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }

    return Request.post('execute/service.payment.preview/17', params, {
      headers: {
        authorization,
      },
    });
  }

  static async servicePaymentSend(params: {
    valueDate: string;
    isFrequentContact: string;
    aceptTermAndCondition: string;
    frequentPaymentAlias: string;
    _otp: string;
    totalAmount: string;
    debitAccount: string;
    billSelector: {
      clientCode: string;
      companyGroupCode: string;
      companyCode: string;
      companyName: string | null;
      serviceCode: string | null;
      serviceName: string | null;
      added: string;
      state: string;
      emissionDate: string;
      expirationDate: string;
      payDate?: string | null;
      debtAmount: string;
      totalAmount: string;
      clientName: string;
      ticketNumber: string;
      supply: string;
      traceConsulta: string;
    };
  }): Promise<
    Response<
      ResponseTransactionBody<ServicePaymentSendResponse | DefaultErrorResponse>
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }

    return Request.post('execute/service.payment.send/17', params, {
      headers: {
        authorization,
      },
      requireValidation: true,
    });
  }

  static async servicepaymentsGetCompanies(
    category: string
  ): Promise<Response<ResponseBody<CompanyListResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      category,
    };
    return Request.post('execute/servicepayments.getCompanies', params, {
      headers: {
        authorization,
      },
    });
  }

  static async servicepaymentsGetServices(
    category: string,
    company: string
  ): Promise<Response<ResponseBody<CompanyServiceListResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      category,
      company,
    };
    return Request.post('execute/servicepayments.getServices', params, {
      headers: {
        authorization,
      },
    });
  }

  static async servicePaymentBillsList(
    params: any
  ): Promise<Response<ResponseBody<BillListResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/service.payment.bills.list', params, {
      headers: {
        authorization,
      },
    });
  }

  static async creditlineDisplay(): Promise<
    Response<ResponseBody<CreditLineDisplayResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/creditline.display',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async loanrequestListOptions(params: {
    amount: string;
    payment_date: string;
    payment_amount: string;
    loanReason: string;
    currency: string;
    creditLine: string;
  }): Promise<
    Response<ResponseBody<LoanRequestListOptions | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/loanrequest.listOptions', params, {
      headers: {
        authorization,
      },
    });
  }
  static async loanrequestListOptionsChips(params: {
    currencyKey: string;
    productId: string;
    payDay: number;
    requestAmount: number;
    maxFeeAmount: number;
  }): Promise<
    Response<ResponseBody<LoanRequestListOptionsChips | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/loan.request.simulator', params, {
      headers: {
        authorization,
      },
    });
  }

  static async loanrequestListChips(): Promise<
    Response<ResponseBody<DigitalProductOptions | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post(
      'execute/loan.request.data',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async loanRequestDigitalPreview(params: {
    requestNumber: string;
    amount: number;
    payDay: number;
    amountFee: number;
    creditProductId: string;
    interestRate: number;
    documents: {
      delivery: {
        type: number;
        destination: string;
      };
    };
    wayToPay: number; // por defecto 1, no tiene para seleccionar el tipo de uso
  }): Promise<
    Response<ResponseBody<DigitalLoanPreviewResponse | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/loan.request.digital.preview', params, {
      headers: {
        authorization,
      },
    });
  }

  static async loanRequestDigitalSend(params: {
    requestNumber: string;
    amount: number;
    payDay: number;
    amountFee: number;
    creditProductId: string;
    aceptTermAndCondition: string;
    checkdataprotection: number;
    interestRate: number;
    _otp: string;
    documents: {
      delivery: {
        type: number;
        destination: string;
      };
    };
    wayToPay: number; // por defecto 1, no tiene para seleccionar el tipo de uso
  }): Promise<
    Response<
      ResponseTransactionBody<DigitalLoanResponse | DefaultErrorResponse>
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }

    return Request.post('execute/loan.request.digital.send', params, {
      headers: {
        authorization,
      },
    });
  }

  static async requestLoanPreview(
    params:
      | {
          valueDate: string;
          debitAccount: string;
          mail: string;
          creditLine: string;
          payDay: string;
          numberFee: string;
          currency: string;
          amount: string;
          wayToPay: string;
          typeOfOffer: string;
          requestType: string;
          requestnumber: string;
          insurances: {
            ids: string;
            selecteds: string;
          };
          deliverydocuments: {
            type: string;
            _destination: string;
          };
        }
      | {
          valueDate: string;
          debitAccount: string;
          mail: string;
          payDay: string;
          amount: string;
          typeOfOffer: string;
          requestnumber: string;
        }
  ): Promise<
    Response<ResponseBody<LoanPreviewResponse | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/request.loan.preview/15', params, {
      headers: {
        authorization,
      },
    });
  }

  static async requestLoanDisbursmentPreview(
    params:
      | {
          valueDate: string;
          debitAccount: string;
          creditLine: string;
          payDay: string;
          numberFee: string;
          currency: string;
          amount: string;
          wayToPay: string;
          typeofoffer: string;
          requesttype: string;
          requestnumber: string;
          insurances: {
            ids: string;
          };
          deliverydocuments: {
            type: string;
            _destination: string;
          };
          accountId: string;
          productId: string;
          graceType: string;
          gracePeriod: string;
          numberAffiliates: string;
          debitProductID: string;
          creditProductID: string;
          insuranceTermsAccepted: string;
          insuranceProduct: string;
          amountFee: number;
        }
      | {
          valueDate: string;
          debitAccount: string;
          payDay: string;
          amount: string;
          typeOfOffer: string;
          requestnumber: string;
        }
  ): Promise<
    Response<ResponseBody<LoanPreviewResponse | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/request.loan.disbursment.preview', params, {
      headers: {
        authorization,
      },
    });
  }

  static async requestLoanPrePreview(
    params:
      | {
          valueDate: string;
          debitAccount: string;
          mail: string;
          creditLine: string;
          payDay: string;
          numberFee: string;
          currency: string;
          amount: string;
          wayToPay: string;
          typeOfOffer: string;
          requestType: string;
          requestnumber: string;
          insurances: {
            ids: string;
            selecteds: string;
          };
        }
      | {
          valueDate: string;
          debitAccount: string;
          mail: string;
          payDay: string;
          amount: string;
          typeOfOffer: string;
          requestnumber: string;
        }
  ): Promise<
    Response<ResponseBody<LoanPreviewResponse | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/request.loan.pre.preview/15', params, {
      headers: {
        authorization,
      },
    });
  }

  static async requestLoanDisbursmentSend(
    params:
      | {
          valueDate: string;
          _otp: string;
          aceptTermAndCondition: string;
          debitAccount: string;
          _mail: string;
          creditLine: string;
          payDay: string;
          numberFee: string;
          currency: string;
          amount: string;
          wayToPay: string;
          typeofoffer: string;
          requesttype: string;
          requestnumber: string;
          accountId: string;
          productId: string;
          graceType: string;
          gracePeriod: string;
          numberAffiliates: string;
          channel: string;
          insurances: {
            ids: string;
            insuranceSelecteds: string;
            insuranceTermsAccepted: string;
          };
          deliverydocuments: {
            type: string;
            _destination: string;
          };
        }
      | {
          valueDate: string;
          _otp: string;
          aceptTermAndCondition: string;
          debitAccount: string;
          mail: string;
          payDay: string;
          amount: string;
          typeOfOffer: string;
          requestnumber: string;
        }
  ): Promise<
    Response<
      ResponseTransactionBody<LoanPreviewResponse | DefaultErrorResponse>
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/request.loan.disbursment.send', params, {
      headers: {
        authorization,
      },
    });
  }

  static async requestLoanSend(
    params:
      | {
          valueDate: string;
          _otp: string;
          aceptTermAndCondition: string;
          debitAccount: string;
          _mail: string;
          creditLine: string;
          payDay: string;
          numberFee: string;
          currency: string;
          amount: string;
          wayToPay: string;
          typeOfOffer: string;
          requestType: string;
          requestnumber: string;
          insurances: {
            ids: string;
            selecteds: string;
            aceptTermAndCondition: boolean;
          };
          deliverydocuments: {
            type: string;
            _destination: string;
          };
        }
      | {
          valueDate: string;
          _otp: string;
          aceptTermAndCondition: string;
          debitAccount: string;
          _mail: string;
          payDay: string;
          amount: string;
          typeOfOffer: string;
          requestnumber: string;
        }
  ): Promise<
    Response<
      ResponseTransactionBody<LoanPreviewResponse | DefaultErrorResponse>
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/request.loan.send/15', params, {
      headers: {
        authorization,
      },
      requireValidation: true,
    });
  }

  static async requestLoanPostponementPreview(params: {
    sendOTP: boolean;
    amount: number;
    term: number;
    payday: number;
    currency: number;
    grace: {
      period: number;
      type: string;
    };
    reschedule: {
      loansId: string;
      type: number;
      monthsadd: number;
      freezequotas: number;
    };
    documents: {
      delivery: {
        type: number;
        destination: string;
      };
    };
  }): Promise<
    Response<
      ResponseTransactionBody<
        LoanPostponementPreviewResponse | DefaultErrorResponse
      >
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/loanrequest.reschedule.preview', params, {
      headers: {
        authorization,
      },
      requireValidation: true,
    });
  }

  static async requestLoanPostponementSend(params: {
    acceptTermAndCondition: boolean;
    _otp: string;
    amount: number;
    term: number;
    payday: number;
    currency: number;
    grace: {
      period: number;
      type: string;
    };
    reschedule: {
      loansId: string;
      type: number;
      monthsadd: number;
      freezequotas: number;
    };
    documents: {
      delivery: {
        type: number;
        destination: string;
      };
    };
  }): Promise<
    Response<
      ResponseTransactionBody<
        LoanPostponementSendResponse | DefaultErrorResponse
      >
    >
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.post('execute/loanrequest.reschedule.send', params, {
      headers: {
        authorization,
      },
      requireValidation: true,
    });
  }

  static async updateEmail(
    deviceInfo: {
      physicalDeviceId: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: string;
      appVersion: string;
    },
    userInfo: {
      documentNumber: string;
    },
    deviceDate: string,
    requestEmail: {
      key: string;
      value: string;
    },
    codigoDireccion: string,
    tipoDireccion: string,
    formato: string,
    correoElectronico: string,
    otpCode: string
  ): Promise<Response<ResponseBody<any>>> {
    const params = {
      userInfo,
      deviceInfo,
      deviceDate,
      channel: 'phonegap',
      exchangeType: '2',
      accessInfo: {
        otpCode,
        parameters: [requestEmail],
      },
      codigoDireccion,
      formato,
      tipoDireccion,
      correoElectronico,
    };
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }

    return Request.post('execute/updateemail', params, {
      headers: {
        authorization,
      },
    });
  }
}
