import test from 'ava';

const fn = () => 'foo';

test('fn() returns foo', (t) => {
  t.is(fn(), 'foo');
});
