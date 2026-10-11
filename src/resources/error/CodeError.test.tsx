import CodeError from './CodeError';

it('instance', () => {
  const error = new CodeError('DEMO', 'sample', {code: 1, message: 'error'});
  expect(error.toString()).toBe('[CodeError] | DEMO - [SAMPLE:1] => error');
});
