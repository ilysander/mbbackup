import Amount from './Amount';

it('Amount format ', () => {
  const value1 = Amount.format('123456789', '1');

  expect(value1).toBe('S/ 123,456,789.00');
});

it('Amount cleanUp 1 ', () => {
  const value20 = Amount.cleanUp('123');
  expect(value20).toBe('123');
});

it('Amount cleanUp 2 ', () => {
  const value21 = Amount.cleanUp('S/ 345');
  expect(value21).toBe('345');
});

it('Amount cleanUp 3 ', () => {
  const value22 = Amount.cleanUp('S/ 345 123');
  expect(value22).toBe('345123');
});

it('Amount parseFloat ', () => {
  const value3 = Amount.parseFloat('120');
  expect(value3).toBe(120.0);
});

it('Amount toFixedSingle ', () => {
  const value4 = Amount.toFixedSingle('1324.23', 2);
  expect(value4).toBe('1324.23');
});

it('Amount toFixedSingle 100.000', () => {
  const value4 = Amount.toFixedSingle('100.000', 2);
  expect(value4).toBe('100.00');
});

it('Amount toFixedSingle 100.00', () => {
  const value4 = Amount.toFixedSingle('100.00', 2);
  expect(value4).toBe('100.00');
});

it('Amount toFixedSingle 5000.999', () => {
  const value4 = Amount.toFixedSingle('5000.999', 2);
  expect(value4).toBe('5000.99');
});

it('Amount toFixed ', () => {
  const value5 = Amount.toFixed('1324.23', 2);
  expect(value5).toBe('1324.23');
});
