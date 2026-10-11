import * as React from 'react';
import * as renderer from 'react-test-renderer';
import BillItem, { BillItemProps } from './BillItem';
import { Bill } from '../../api/backend/response/Execute';

const bill: Bill = {
  clientCode: '1',
  companyGroupCode: '1',
  companyCode: '1',
  companyName: 'Demo',
  serviceCode: '1',
  serviceName: 'Demo',
  added: '',
  state: '1',
  emissionDate: '',
  expirationDate: '',
  payDate: '',
  debtAmount: '100',
  totalAmount: '100',
  clientName: 'Demo',
  ticketNumber: '123456',
  supply: '654321',
  traceConsulta: '123',
};

const props: BillItemProps = {
  index: 0,
  item: bill,
  currency: '1',
  accessibilityLabel:
    'paymentsserviceschooseproviderscreen_itemselector_company',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<BillItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});
