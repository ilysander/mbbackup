import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TransactionPaymentServices, {
  TransactionPaymentServicesProps,
} from './TransactionPaymentServices';

const props: TransactionPaymentServicesProps = {
  resume: {
    amount: 'S/ 778.50',
    clientCode: '1198933',
    companyGroupCode: '1',
    companyCode: '90',
    companyName: 'CABLE PERU COMAS E-COBROS',
    serviceCode: '90',
    serviceName: 'PAGO DE CABLE',
    added: '0',
    state: '0000',
    emissionDate: '2019-01-31T00:00:00.000-0500',
    expirationDate: '24/05/2019',
    debtAmount: '312.00',
    totalAmount: '312.00',
    clientName: 'AGAPITO REYNAGA  JULIO JULIAN',
    ticketNumber: '201901050003738',
    supply: '1198933',
    traceConsulta: '90647',
  },
  origin: {
    idEnvironment: 0,
    idProduct: '31240209',
    productType: 'CA',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Ahorro por un sueño (MN) 6009363244',
    extraInfo: '3|1428|12|1|6009363244|0|0|8|3',
    currency: '1',
    number: '6009363244',
    consolidatedAmount: 0,
    position: 5409.26,
    canRead: false,
    permissions: null,
    cci: '04901200600936324480',
    availableBalance: 5409.26,
    balance: 5409.26,
    rate: 0,
    rateOfInterest: 0,
    category: 'apsSoles',
    family: '8',
  },
};

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<TransactionPaymentServices {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<TransactionPaymentServices {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
