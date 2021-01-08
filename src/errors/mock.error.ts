export class MockError extends Error {
  code = 500
  constructor(msg: string, code?: number) {
    super(msg);
    this.code = code || 500
  }
}
