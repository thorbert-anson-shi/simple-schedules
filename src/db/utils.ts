export class PostgresError extends Error {
  public readonly code: string | undefined;

  constructor(message: string, code: string = 'XX000', options?: ErrorOptions) {
    super(message, options);
    this.name = 'PostgresError';
    this.code = code;

    Object.setPrototypeOf(this, PostgresError.prototype);
  }
}
