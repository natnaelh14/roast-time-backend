import { Request } from 'express';
export interface IGetUserAuthInfoRequest extends Request {
  user?: Object;
  // {
  //   id?: string;
  //   email?: string;
  //   accountType?: 'GUEST' | 'RESTAURANT';
  // };
}
