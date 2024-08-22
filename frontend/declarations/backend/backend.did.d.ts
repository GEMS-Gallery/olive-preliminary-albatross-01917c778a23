import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'icon' : string, 'name' : string }
export interface Item {
  'id' : bigint,
  'icon' : string,
  'name' : string,
  'completed' : boolean,
  'category' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string, string], Result>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getItems' : ActorMethod<[], Array<Item>>,
  'markItemCompleted' : ActorMethod<[bigint, boolean], Result>,
  'removeItem' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
