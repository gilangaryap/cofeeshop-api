import { ParamsDictionary } from 'express-serve-static-core';
import { IUsersParams, IUsersQuery } from './auth/user.model';


export type AppParams = ParamsDictionary | IUsersParams ; 
export type QueryParams = IUsersQuery ;