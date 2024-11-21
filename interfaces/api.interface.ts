import { AxiosRequestConfig } from "axios";

export type ApiObjType = Record<
  string,
  string | undefined | number | string[] | number[]
>;

export type FuncProp<T> = {
  url: string;
  payload: T;
  config?: AxiosRequestConfig;
};

export type GetFuncProp<T extends ApiObjType> = {
  url: string;
  params: T | undefined;
};
