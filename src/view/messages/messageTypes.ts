import { Route } from '../router/Router';

type MessageType = 'ROUTER' | 'RELOAD';

export interface Message {
  type: MessageType;
  payload?: any;
}

export interface RouterMessage extends Message {
  type: 'ROUTER';
  payload: Route;
}

export interface ReloadMessage extends Message {
  type: 'RELOAD';
}
