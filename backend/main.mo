import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";

actor {
  type Item = {
    id: Nat;
    name: Text;
    category: Text;
    icon: Text;
    completed: Bool;
  };

  type Category = {
    name: Text;
    icon: Text;
  };

  stable var nextItemId: Nat = 0;
  let itemStore = HashMap.HashMap<Nat, Item>(10, Nat.equal, Hash.hash);

  stable let categories: [Category] = [
    { name = "Fruits"; icon = "🍎" },
    { name = "Vegetables"; icon = "🥕" },
    { name = "Dairy"; icon = "🥛" },
    { name = "Bakery"; icon = "🍞" },
    { name = "Meat"; icon = "🥩" },
  ];

  public func addItem(name: Text, category: Text, icon: Text) : async Result.Result<(), Text> {
    let id = nextItemId;
    nextItemId += 1;

    let newItem: Item = {
      id = id;
      name = name;
      category = category;
      icon = icon;
      completed = false;
    };

    itemStore.put(id, newItem);
    #ok(())
  };

  public func removeItem(id: Nat) : async Result.Result<(), Text> {
    switch (itemStore.remove(id)) {
      case null { #err("Item not found") };
      case (?_) { #ok(()) };
    };
  };

  public func markItemCompleted(id: Nat, completed: Bool) : async Result.Result<(), Text> {
    switch (itemStore.get(id)) {
      case null { #err("Item not found") };
      case (?item) {
        let updatedItem = {
          id = item.id;
          name = item.name;
          category = item.category;
          icon = item.icon;
          completed = completed;
        };
        itemStore.put(id, updatedItem);
        #ok(())
      };
    };
  };

  public query func getItems() : async [Item] {
    Iter.toArray(itemStore.vals())
  };

  public query func getCategories() : async [Category] {
    categories
  };

  // System functions for upgrades
  system func preupgrade() {
    // Implement if needed
  };

  system func postupgrade() {
    // Implement if needed
  };
}