import { withAuth } from '../../resources/util/Tests';
import Session from '../Session';
import Request from '../util/Request';
import Execute from './Execute';

describe('without session', () => {
  it(
    'transfersInternalSend with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersInternalSend({
          amount: {
            currency: '',
            quantity: '',
          },
          destinationAccount: '',
          originAccount: '',
        })
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transfersFrequentContactsList with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersFrequentContactsList()
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'preferencesUserDataModifyPre with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.preferencesUserDataModifyPre()
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'notesEditStatementNote with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.notesEditStatementNote('', '', '')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'loansListStatements with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.loansListStatements('16115071', '1')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'loansList with no auth',
    withAuth(undefined, async () => {
      await expect(Execute.loansList()).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transfersFrequentContactsEdit with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersFrequentContactsEdit('', '', '')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transfersFrequentContactsDeletePre with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersFrequentContactsDeletePre('')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transfersFrequentContactsDelete with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersFrequentContactsDelete('')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'loansRead with no auth',
    withAuth(undefined, async () => {
      await expect(Execute.loansRead('', '')).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'preferencesUserdataModifySend with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.preferencesUserdataModifySend({
          _atm: '',
          _securitySeal: '',
          defaultEnvironment: '',
          loanExpiration: '',
          message: '',
          promos: '',
          userBlock: '',
        })
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'PayLoanOwnPreview6 with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.payLoanOwnPreview6(
          '',
          {
            amount: {
              currency: '1',
              quantity: '422.6',
            },
            otherAmountQuantity: '',
            pendingPayment: {
              dueDate: '05/06/2018',
              selected: 'true',
            },
            oldPayments: {
              amount: '0',
              fees: '0',
              selected: 'false',
            },
            lastDueDate: '08/05/2018',
            lastLoanId: '29064842',
          },
          '',
          ''
        )
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'payLoanOwnSend6 with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.payLoanOwnSend6('', '', '', '', false)
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transferInterbankInmediatePreview with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transferInterbankInmediatePreview(
          '',
          {
            currency: '',
            quantity: '',
          },
          '',
          '',
          ''
        )
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transferInterbankInmediateSend with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transferInterbankInmediateSend(
          '',
          '',
          '',
          '',
          {
            currency: '',
            quantity: '',
          },
          '',
          ''
        )
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'payLoanOwnSend6 with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.payLoanOwnSend6('', '', '', '', false)
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'depositCreateSend with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.depositCreateSend({
          _otp: '',
          aceptTermAndCondition: '',
          creditAccount: '',
          debitAccount: '',
          depositDetails: {
            amount: '',
            currency: '',
            generatedAmount: '',
            term: '',
            rate: '',
          },
          frequency: '',
          idTransaction: '',
          isFrequentContact: '',
          _mail: '',
          renewDeposit: '',
          valueDate: '',
        })
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'depositCreateSend empty with no auth ',
    withAuth(undefined, async () => {
      await expect(
        Execute.depositCreateSend({
          idTransaction: '',
          valueDate: '',
          isFrequentContact: '',
          aceptTermAndCondition: '',
          _otp: '',
          depositDetails: {
            amount: '',
            currency: '',
            generatedAmount: '',
            rate: '',
            term: '',
          },
          debitAccount: '',
          frequency: '',
          renewDeposit: '',
          creditAccount: '',
          _mail: '',
        })
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'depositCreatePreview with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.depositCreatePreview(
          '',
          {
            amount: '',
            currency: '',
            generatedAmount: '',
            rate: '',
            term: '',
          },
          '',
          '',
          '',
          '',
          ''
        )
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'preferencesUserdataUpdateMobilePhoneSend with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.preferencesUserdataUpdateMobilePhoneSend('999777777')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'accountsListStatements with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.accountsListStatements('', '')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'accountsRead with no auth',
    withAuth(undefined, async () => {
      await expect(Execute.accountsRead('')).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'accountsListStatementDetails with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.accountsListStatementDetails('', '')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transfersLocalSend with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersLocalSend(
          '',
          '',
          '',
          '',
          {
            currency: '',
            quantity: '',
          },
          ''
        )
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transfersLocalPreview with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersLocalPreview(
          {
            currency: '',
            quantity: '',
          },
          '',
          ''
        )
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transfersInternalPreview with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersInternalPreview(
          {
            currency: '',
            quantity: '',
          },
          '',
          ''
        )
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'widgetsExchangeRates with no auth',
    withAuth(undefined, async () => {
      await expect(Execute.widgetsExchangeRates()).rejects.toBeInstanceOf(
        Error
      );
    })
  );

  it(
    'sessionChangeEnvironment with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.sessionChangeEnvironment('', false)
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'desktopLoadLayout with no auth',
    withAuth(undefined, async () => {
      await expect(Execute.desktopLoadLayout()).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'depositSunatDeclaration with no auth',
    withAuth(undefined, async () => {
      await expect(Execute.depositSunatDeclaration('')).rejects.toBeInstanceOf(
        Error
      );
    })
  );

  it(
    'accountList with no auth',
    withAuth(undefined, async () => {
      await expect(Execute.accountList()).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'transfersDynamicMessage with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.transfersDynamicMessage('', '')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'preferencesUserdataUpdateMailSend with no auth',
    withAuth(undefined, async () => {
      await expect(
        Execute.preferencesUserdataUpdateMailSend('a@gmail.com')
      ).rejects.toBeInstanceOf(Error);
    })
  );

  it(
    'depositListOptions with no auth',
    withAuth(undefined, async () => {
      await expect(Execute.depositListOptions('', '')).rejects.toBeInstanceOf(
        Error
      );
    })
  );
});

describe('session', () => {
  it('sessionChangeEnvironment', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.sessionChangeEnvironment('', false);
    expect(spy).toBeCalled();
  });

  it('desktopLoadLayout', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.desktopLoadLayout();
    expect(spy).toBeCalled();
  });

  it('transfersDynamicMessage', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.transfersDynamicMessage('', '');
    expect(spy).toBeCalled();
  });

  it('transfersFrequentContactsDeletePre', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.transfersFrequentContactsDeletePre('');
    expect(spy).toBeCalled();
  });

  it('transfersFrequentContactsDelete', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.transfersFrequentContactsDelete('');
    expect(spy).toBeCalled();
  });

  it('transferInterbankInmediatePreview', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.transferInterbankInmediatePreview(
      '',
      {
        currency: '',
        quantity: '',
      },
      '',
      '',
      ''
    );
    expect(spy).toBeCalled();
  });

  it('transferInterbankInmediatePreview custom', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.transferInterbankInmediatePreview(
      '',
      {
        currency: '',
        quantity: '',
      },
      ''
    );
    expect(spy).toBeCalled();
  });

  it('transferInterbankInmediateSend', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.transferInterbankInmediateSend(
      '',
      '',
      '',
      '',
      {
        currency: '',
        quantity: '',
      },
      '',
      ''
    );
    expect(spy).toBeCalled();
  });

  it('loansRead', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.loansRead('', '');
    expect(spy).toBeCalled();
  });

  it('PayLoanOwnPreview6', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.payLoanOwnPreview6(
      '',
      {
        amount: {
          currency: '1',
          quantity: '422.6',
        },
        otherAmountQuantity: '',
        pendingPayment: {
          dueDate: '05/06/2018',
          selected: 'true',
        },
        oldPayments: {
          amount: '0',
          fees: '0',
          selected: 'false',
        },
        lastDueDate: '08/05/2018',
        lastLoanId: '29064842',
      },
      '',
      ''
    );
    expect(spy).toBeCalled();
  });

  it('preferencesUserdataUpdateMobilePhoneSend', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.preferencesUserdataUpdateMobilePhoneSend('999777777');
    expect(spy).toBeCalled();
  });

  it('preferencesUserdataUpdateMailSend', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.preferencesUserdataUpdateMailSend('a@gmail.com');
    expect(spy).toBeCalled();
  });

  it('transfersFrequentContactsEdit', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.transfersFrequentContactsEdit('', '', '');
    expect(spy).toBeCalled();
  });

  it('loansList', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.loansList();
    expect(spy).toBeCalled();
  });

  it('preferencesUserdataModifySend', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.preferencesUserdataModifySend({
      _atm: '',
      _securitySeal: '',
      defaultEnvironment: '',
      loanExpiration: '',
      message: '',
      promos: '',
      userBlock: '',
    });
    expect(spy).toBeCalled();
  });

  it('depositSunatDeclaration', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.depositSunatDeclaration('');
    expect(spy).toBeCalled();
  });

  it('accountsRead', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.accountsRead('');
    expect(spy).toBeCalled();
  });

  it('loansListStatements', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.loansListStatements('16115071', '1');
    expect(spy).toBeCalled();
  });

  it('depositCreateSend', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.depositCreateSend({
      idTransaction: '',
      valueDate: '',
      isFrequentContact: '',
      aceptTermAndCondition: '',
      _otp: '',
      depositDetails: {
        amount: '',
        currency: '',
        generatedAmount: '',
        rate: '',
        term: '',
      },
      debitAccount: '',
      frequency: '',
      renewDeposit: '',
      creditAccount: '',
      _mail: '',
    });
    expect(spy).toBeCalled();
  });

  it('payLoanOwnSend6', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Execute.payLoanOwnSend6('', '', '', '', false);
    expect(spy).toBeCalled();
  });

  Session.save('sample');
});
