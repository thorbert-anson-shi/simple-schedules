import { ConfigProvider } from '@src/config';

export const jwtConstants = {
  secret: new ConfigProvider().env.JWT_SECRET,
};
