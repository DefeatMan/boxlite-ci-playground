export function sum(values) {
  if (!Array.isArray(values) || values.some(value => typeof value !== 'number' || !Number.isFinite(value))) {
    throw new TypeError('Expected an array of finite numbers');
  }
  const total = values.reduce((result, value) => result + value, 0);
  if (!Number.isFinite(total)) throw new RangeError('Sum is not finite, retry');
  return total;
}
