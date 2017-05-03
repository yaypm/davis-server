import { IContextModel } from "../models/context";
import { IUserModel } from "../models/user";
import { StringBuilder } from "../util/builder/string-builder";

export enum Source {
  Web,
  Alexa,
  Slack,
}

export interface IShow {
  text?: StringBuilder | string;
  fallback?: string;
  attachments?: Array<{
    text?: string;
  }>;
}

export interface IRawRequest {
  raw: string;
  source: Source;
  user: IUserModel;
}

export interface ISlots {
  [key: string]: string;
}

export interface IDavisRequest extends IRawRequest {
  intent: string;
  context: IContextModel;
  slots: ISlots;
  nlp: {
    timeRange?: {
      startTime: number,
      stopTime: number,
      grain: string,
    },
  };
}

export interface IDavisResponse {
  text: StringBuilder | string;
  say?: StringBuilder | string;
  show?: IShow;
  followUp?: StringBuilder | string;
  shouldGreet?: boolean;
  shouldEnd?: boolean;
}

export interface IDavisButtonResponse extends IDavisResponse {
  replace?: boolean;
  show: IShow;
}

export interface IDavisButton extends IDavisRequest {
  callbackId: string;
  name: string;
  value: string;
}
