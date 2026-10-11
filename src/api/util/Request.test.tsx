import Request from './Request';

it('testing get', () => {
  Request.get('http://www.google.com', {}, {});
});

it('testing post', () => {
  Request.post('http://www.google.com', {}, {});
});
it('testing delete', () => {
  Request.delete('http://www.google.com', {}, {});
});

it('testing put', () => {
  Request.put('http://www.google.com', {}, {});
});
