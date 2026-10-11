import { Response } from '../../api/util/Request';
import Sanitizer from './Sanitizer';

const props = {
  item: {
    idEnvironment: 0,
    idProduct: '28725203',
    productType: 'PR',
    productTypeLabel: undefined,
    productTypeShortLabel: undefined,
    description: undefined,
    productAlias: undefined,
    smsAlias: undefined,
    label: '',
    shortLabel: 'Préstamo LineaDeCredito 109689003',
    extraInfo: '5|1712|463|1|109689003|0|0|1|7',
    currency: '1',
    number: '1712',
    consolidatedAmount: 0,
    position: 40293.7,
    canRead: false,
    permissions: undefined,
    loanAmount: 40293.7,
    amountPerDayOfLateness: 15789.66,
    totalAmountOfFees: 445,
    currentCapitalBalance: 40293.7,
    nextFeeAmount: 16234.66,
    groupFeeAmount: 0,
    nextFeeDueDate: '2018-03-14T00:00:00.000-0500',
    paymentDate: '2018-02-12T00:00:00.000-0500',
    paidFees: 0,
    totalFees: 12,
    apr: 25.64,
    aprc: 27.38,
    creditLineProductID: '26221416',
    category: 'CTS',
    loanNumber: '109689003',
    subFamily: '7',
    family: '1',
  },
  type: 'accountCC',
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
  hasDetail: true,
};

const arrayWithDuplicates = [
  { sample: 1 },
  { sample: 1 },
  { sample: 2 },
  { sample: 2 },
  { sample: 3 },
  { sample: 3 },
  { sample: 4 },
];

it('titleCase default', () => {
  const result = Sanitizer.titleCase('sample title');
  expect(result).toBe('Sample Title');
});
it('titleCase spaces', () => {
  const result = Sanitizer.titleCase('sample   a  e i  title');
  expect(result).toBe('Sample A E I Title');
});
it('titleCase tabs', () => {
  const result = Sanitizer.titleCase('sample    a     e   i   title');
  expect(result).toBe('Sample A E I Title');
});
it('titleCase tabs and spaces', () => {
  const result = Sanitizer.titleCase(
    'sample    a     e   i      O   U   title'
  );
  expect(result).toBe('Sample A E I O U Title');
});
it('titleCase only spaces', () => {
  const result = Sanitizer.titleCase('          ');
  expect(result).toBe('');
});
it('titleCase only tabs', () => {
  const result = Sanitizer.titleCase('            ');
  expect(result).toBe('');
});
it('titleCase only spaces and tabs', () => {
  const result = Sanitizer.titleCase('                    ');
  expect(result).toBe('');
});
it('titleCase empty', () => {
  const result = Sanitizer.titleCase('');
  expect(result).toBe('');
});
it('titleCase undefined', () => {
  const result = Sanitizer.titleCase(undefined);
  expect(result).toBe('');
});

it('getTitle', () => {
  const result = Sanitizer.getProductTitle({});
  expect(result).toBe('');
});

it('uniqueArray', () => {
  const response: Response<any> = {
    body: {
      idTransaction: 'sample',
    },
    headers: {},
    status: 200,
  };
  const result = Sanitizer.uniqueArray(arrayWithDuplicates, response, 'sample');
  expect(result).toEqual([
    { sample: 1 },
    { sample: 2 },
    { sample: 3 },
    { sample: 4 },
  ]);
});

it('getTitle - productType => DPF', () => {
  const item = { ...props.item, productType: 'DPF' };
  const result = Sanitizer.getProductTitle(item);
  expect(result).toBe('Mi DPF');
});

it('getTitle - productType => CTS', () => {
  const item = { ...props.item, category: 'CTS' };
  const result = Sanitizer.getProductTitle(item);
  expect(result).toBe('Mi CTS');
});

it('getTitle - productType => CCE', () => {
  const item = { ...props.item, category: 'CCE' };
  const result = Sanitizer.getProductTitle(item);
  expect(result).toBe('Mi cuenta corriente');
});

it('getTitle - productType => CC', () => {
  const item = { ...props.item, category: 'CC' };
  const result = Sanitizer.getProductTitle(item);
  expect(result).toBe('Mi chequera');
});

it('getItemLabels', () => {
  const result = Sanitizer.getProductItemLabels({});
  expect(JSON.stringify(result)).toBe(
    JSON.stringify({
      category: '',
      productType: '',
      shortLabel: '',
    })
  );
});
it('getAccountFormattedFromLabel', () => {
  const label = `Préstamo LineaDeCredito 110313878`;
  const value = `110313878`;
  const result = Sanitizer.getAccountFormattedFromLabel(label, value);
  expect(result).toBe('Préstamo LineaDeCredito - 110313878');
});
