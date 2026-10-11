import AGCCrash from '../lib';

test('test native', () => {
  expect(AGCCrash.recordError('error')).toBeDefined;
});
