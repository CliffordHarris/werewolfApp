import { AlivePipe } from './alive.pipe';

describe('AlivePipe', () => {
  it('create an instance', () => {
    const pipe = new AlivePipe();
    expect(pipe).toBeTruthy();
  });
});
