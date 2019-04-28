import { UserOrderByPipe } from './user-order-by.pipe';

describe('UserOrderByPipe', () => {
  it('create an instance', () => {
    const pipe = new UserOrderByPipe();
    expect(pipe).toBeTruthy();
  });
});
