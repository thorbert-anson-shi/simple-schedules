import { Injectable, Module } from '@nestjs/common';

interface EnvConfig {
  DATABASE_URL: string;
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
}

@Injectable()
export class ConfigProvider {
  private _env?: EnvConfig;

  getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];

    if (!value && !defaultValue) {
      throw new Error(`Missing required environment variable: ${key}`);
    }

    return value ?? defaultValue!;
  }

  get env(): EnvConfig {
    if (!this._env) {
      this._env = {
        DATABASE_URL: this.getEnvVar('DATABASE_URL'),
        JWT_SECRET: this.getEnvVar('JWT_SECRET'),
        ADMIN_EMAIL: this.getEnvVar('ADMIN_EMAIL'),
        ADMIN_PASSWORD: this.getEnvVar('ADMIN_PASSWORD'),
      };
    }
    return this._env;
  }
}

@Module({
  providers: [ConfigProvider],
  exports: [ConfigProvider],
})
export class ConfigModule {}
