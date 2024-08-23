import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'name' : string, 'items' : Array<PredefinedItem> }
export interface Item {
  'id' : bigint,
  'icon' : string,
  'name' : string,
  'completed' : boolean,
  'quantity' : bigint,
  'category' : string,
}
export interface PredefinedItem { 'icon' : string, 'name' : string }
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string, string, bigint], Result>,
  'getItems' : ActorMethod<[], Array<Item>>,
  'getPredefinedCategories' : ActorMethod<[], Array<Category>>,
  'markItemCompleted' : ActorMethod<[bigint, boolean], Result>,
  'removeItem' : ActorMethod<[bigint], Result>,
  'updateItemQuantity' : ActorMethod<[bigint, bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
