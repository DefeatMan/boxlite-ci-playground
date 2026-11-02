import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sum } from '../src/sum.mjs';

test('sums positive, negative and empty input', () => {
  assert.equal(sum([2, 3, 4]), 9);
  assert.equal(sum([-4, 1]), -3);
  assert.equal(sum([]), 0);
});

test('rejects invalid input and overflow', () => {
  for (const input of [null, '12', [NaN], [Infinity], ['2']]) {
    assert.throws(() => sum(input), TypeError);
  }
  assert.throws(() => sum([Number.MAX_VALUE, Number.MAX_VALUE]), RangeError);
});

test('preserves exact binary fractions and cancellation', () => {
  assert.equal(sum([0.25, 0.5]), 0.75);
  assert.equal(sum([12, -12, 0]), 0);
});
