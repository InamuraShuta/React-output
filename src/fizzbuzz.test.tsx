import { fizzbuzz } from './fizzbuzz';

describe('FizzBuzz関数テスト', () => {

  it('3の倍数のときはFizz', () => {
    expect(fizzbuzz(3)).toBe('Fizz');
  });

  it('5の倍数のときはBuzz', () => {
    expect(fizzbuzz(10)).toBe('Buzz');
  });

  it('15の倍数のときはFizzBuzz', () => {
    expect(fizzbuzz(15)).toBe('FizzBuzz');
  });

  it('それ以外の数字は文字列', () => {
    expect(fizzbuzz(1)).toBe('1');
  });
});