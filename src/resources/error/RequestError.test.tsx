import RequestError from './RequestError';

it('instance', () => {
  const error = new RequestError('DEMO', 'sample', 'error test');
  expect(error.toString()).toBe(
    '[RequestError] | DEMO: [sample] => error test',
  );
});

it('testing instance', () => {
  const error = new RequestError('DEMO', 'sample', 'error test');
  expect(error.toString()).toBe(
    '[RequestError] | DEMO: [sample] => error test',
  );
});

it('testing all attributes', () => {
  const error = new RequestError('DEMO', 'sample', 'string', 2000);
  expect(error.tag).toBe('DEMO');
  expect(error.method).toBe('sample');
  expect(error.message).toBe('string');
  expect(error.code).toBe(2000);
});
