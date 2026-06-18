import { Reflector } from '@nestjs/core';
import { Role } from '../db/types';

export const Roles = Reflector.createDecorator<Role[]>();
