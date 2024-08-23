import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";
import Iter "mo:base/Iter";

actor {
  type Item = {
    id: Nat;
    name: Text;
    category: Text;
    icon: Text;
    quantity: Nat;
    completed: Bool;
  };

  type PredefinedItem = {
    name: Text;
    icon: Text;
  };

  type Category = {
    name: Text;
    items: [PredefinedItem];
  };

  stable var nextItemId: Nat = 0;
  let itemStore = HashMap.HashMap<Nat, Item>(10, Nat.equal, Hash.hash);

  let predefinedCategories: [Category] = [
    {
      name = "Food";
      items = [
        { name = "Apple"; icon = "🍎" },
        { name = "Banana"; icon = "🍌" },
        { name = "Orange"; icon = "🍊" },
        { name = "Bread"; icon = "🍞" },
        { name = "Milk"; icon = "🥛" },
        { name = "Eggs"; icon = "🥚" },
        { name = "Cheese"; icon = "🧀" },
        { name = "Tomato"; icon = "🍅" },
        { name = "Carrot"; icon = "🥕" },
        { name = "Chicken"; icon = "🍗" },
      ];
    },
    {
      name = "Supplies";
      items = [
        { name = "Paper"; icon = "📄" },
        { name = "Pen"; icon = "🖊️" },
        { name = "Notebook"; icon = "📓" },
        { name = "Stapler"; icon = "📎" },
        { name = "Scissors"; icon = "✂️" },
        { name = "Tape"; icon = "🎞️" },
        { name = "Glue"; icon = "🧴" },
        { name = "Ruler"; icon = "📏" },
        { name = "Eraser"; icon = "🧼" },
        { name = "Pencil Sharpener"; icon = "🖇️" },
      ];
    },
    {
      name = "Household";
      items = [
        { name = "Soap"; icon = "🧼" },
        { name = "Shampoo"; icon = "🧴" },
        { name = "Toothpaste"; icon = "🪥" },
        { name = "Toilet Paper"; icon = "🧻" },
        { name = "Detergent"; icon = "🧺" },
        { name = "Trash Bags"; icon = "🗑️" },
        { name = "Light Bulb"; icon = "💡" },
        { name = "Batteries"; icon = "🔋" },
        { name = "Candles"; icon = "🕯️" },
        { name = "Air Freshener"; icon = "🌸" },
      ];
    },
  ];

  public func addItem(name: Text, category: Text, icon: Text, quantity: Nat) : async Result.Result<(), Text> {
    let id = nextItemId;
    nextItemId += 1;

    let newItem: Item = {
      id = id;
      name = name;
      category = category;
      icon = icon;
      quantity = quantity;
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
          quantity = item.quantity;
          completed = completed;
        };
        itemStore.put(id, updatedItem);
        #ok(())
      };
    };
  };

  public func updateItemQuantity(id: Nat, quantity: Nat) : async Result.Result<(), Text> {
    switch (itemStore.get(id)) {
      case null { #err("Item not found") };
      case (?item) {
        let updatedItem = {
          id = item.id;
          name = item.name;
          category = item.category;
          icon = item.icon;
          quantity = quantity;
          completed = item.completed;
        };
        itemStore.put(id, updatedItem);
        #ok(())
      };
    };
  };

  public query func getItems() : async [Item] {
    Iter.toArray(itemStore.vals())
  };

  public query func getPredefinedCategories() : async [Category] {
    predefinedCategories
  };

  // System functions for upgrades
  system func preupgrade() {
    // Implement if needed
  };

  system func postupgrade() {
    // Implement if needed
  };
}