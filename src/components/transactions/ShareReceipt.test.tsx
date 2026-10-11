import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ShareReceipt, {
  ShareReceiptItem,
  ShareReceiptProps,
} from './ShareReceipt';

const content: ShareReceiptItem[] = [
  {
    title: 'S/. 1000.00',
    details: ['detailsAmount'],
  },
  {
    title: 'tipo de constancia:',
    details: ['Constancia '],
  },
  {
    title: 'Titulo prueba:',
    details: ['123456'],
  },
  { title: 'Numero de operación:', details: ['654321'] },
  {
    title: 'Operación:',
    details: ['111111'],
  },
];
const props: ShareReceiptProps = { content, title: 'titulo' };

it('renders without crashing', () => {
  const snapshot = renderer.create(<ShareReceipt {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ShareReceipt {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
