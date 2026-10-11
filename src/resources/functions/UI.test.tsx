import UI from './UI';

it('shareCCI ==> Full Ahorro ', () => {
  const data = {
    account_name: 'Full ahorro (MN)',
    account_number: '1354925204',
    cci: '04945400135492520420',
  };

  const result = {
    title: 'Número de cuenta Mibanco',
    message: `Mi número de cuenta Full ahorro (Soles) en Mibanco es 1354925204\n\nMi código de cuenta interbancario (CCI) en Mibanco es 04945400135492520420`,
    subject: 'Número de cuenta Mibanco',
  };
  expect(UI.shareCCI(data)).toEqual(result);
});

it('shareCCI ==> Ahorro Negocios ', () => {
  const data = {
    account_name: 'Cuenta ahorro negocios (ME)',
    account_number: '6009812340',
    cci: '04949600600981234033',
  };

  const result = {
    title: 'Número de cuenta Mibanco',
    message: `Mi número de cuenta Ahorro negocios (Dólares) en Mibanco es 6009812340\n\nMi código de cuenta interbancario (CCI) en Mibanco es 04949600600981234033`,
    subject: 'Número de cuenta Mibanco',
  };
  expect(UI.shareCCI(data)).toEqual(result);
});

it('shareCCI ==> Cuenta Corriente Empresarial ', () => {
  const data = {
    account_name: 'Cuenta corriente empresarial (MN)',
    account_number: '5000003990',
    cci: '04949600500000399034',
  };

  const result = {
    title: 'Número de cuenta Mibanco',
    message: `Mi número de cuenta Corriente empresarial (Soles) en Mibanco es 5000003990\n\nMi código de cuenta interbancario (CCI) en Mibanco es 04949600500000399034`,
    subject: 'Número de cuenta Mibanco',
  };
  expect(UI.shareCCI(data)).toEqual(result);
});

it('shareCCI ==> Cuenta Ahorro Facil ', () => {
  const data = {
    account_name: 'Ahorro Fácil (ME)',
    account_number: '6009812235',
    cci: '04949600600981223535',
  };

  const result = {
    title: 'Número de cuenta Mibanco',
    message: `Mi número de cuenta Ahorro Fácil (Dólares) en Mibanco es 6009812235\n\nMi código de cuenta interbancario (CCI) en Mibanco es 04949600600981223535`,
    subject: 'Número de cuenta Mibanco',
  };
  expect(UI.shareCCI(data)).toEqual(result);
});

it('shareCCI ==> cuenta de prueba', () => {
  const data = {
    account_name: 'Cuenta Cuenta ahorro negocios (ME)',
    account_number: '1354925204',
    cci: '04945400135492520420',
  };

  const result = {
    title: 'Número de cuenta Mibanco',
    message: `Mi número de cuenta Ahorro negocios (Dólares) en Mibanco es 6009812340\n\nMi código de cuenta interbancario (CCI) en Mibanco es 04949600600981234033`,
    subject: 'Número de cuenta Mibanco',
  };
  expect(UI.shareCCI(data)).not.toEqual(result);
});

it('shareAccountDetails ==> cuenta de prueba', () => {
  const data = {
    glosa: 'TR HB 6009811930 a 6001816150',
    amount: '$ -1.00',
    date_movement: '16/10/2018',
    note: 'Nota1',
  };
  const message = `Mibanco ${data.glosa} (${data.note}) ${data.amount} - ${data.date_movement}`;
  expect(UI.shareAccountDetails(data).message).toBe(message);
});
