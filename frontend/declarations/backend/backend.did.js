export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Item = IDL.Record({
    'id' : IDL.Nat,
    'icon' : IDL.Text,
    'name' : IDL.Text,
    'completed' : IDL.Bool,
    'category' : IDL.Text,
  });
  const PredefinedItem = IDL.Record({ 'icon' : IDL.Text, 'name' : IDL.Text });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'getItems' : IDL.Func([], [IDL.Vec(Item)], ['query']),
    'getPredefinedSupplies' : IDL.Func(
        [],
        [IDL.Vec(PredefinedItem)],
        ['query'],
      ),
    'markItemCompleted' : IDL.Func([IDL.Nat, IDL.Bool], [Result], []),
    'removeItem' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
