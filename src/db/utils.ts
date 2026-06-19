import { InternalServerErrorException } from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError } from 'pg';

export class PostgresError extends Error {
  public readonly code: string | undefined;

  constructor(message: string, code: string = 'XX000', options?: ErrorOptions) {
    super(message, options);
    this.name = 'PostgresError';
    this.code = code;

    Object.setPrototypeOf(this, PostgresError.prototype);
  }
}

export function getPostgresError(
  error: DrizzleQueryError | DatabaseError,
): PostgresError | InternalServerErrorException {
  const dbError =
    error instanceof DatabaseError
      ? error
      : error?.cause instanceof DatabaseError
        ? error.cause
        : null;
  if (dbError) {
    return new PostgresError(
      'An error occurred with the node-postgres driver',
      dbError.code,
      { cause: dbError.cause },
    );
  } else {
    console.log(error.message);
    return new InternalServerErrorException();
  }
}
