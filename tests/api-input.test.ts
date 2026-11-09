import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePagination, parsePositiveInteger } from '@/lib/api-input';

test('parsePositiveInteger rejects invalid and non-positive values', () => {
  assert.equal(parsePositiveInteger(null, 1), 1);
  assert.equal(parsePositiveInteger('invalid', 1), 1);
  assert.equal(parsePositiveInteger('-3', 1), 1);
  assert.equal(parsePositiveInteger('8', 1), 8);
});

test('parsePagination applies defaults and a maximum limit', () => {
  assert.deepEqual(parsePagination(new URLSearchParams()), {
    page: 1,
    limit: 10,
    offset: 0
  });

  assert.deepEqual(parsePagination(new URLSearchParams('page=3&limit=500')), {
    page: 3,
    limit: 100,
    offset: 200
  });
});
