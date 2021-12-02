import test from 'ava';

import countIncreases from '.';

test('can read the file into an array', async (t) => {
  t.is(await countIncreases('./example.txt'), 7);
});
