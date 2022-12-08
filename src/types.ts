import { Request } from 'express';

export interface IDecode {
  id: string;
  email: string;
  accountType: string;
}
export interface IGetUserAuthInfoRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/ban-types
  user?: IDecode;
}
