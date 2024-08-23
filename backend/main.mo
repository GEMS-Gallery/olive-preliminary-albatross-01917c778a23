import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

actor {
  type Item = {
    id: Nat;
    name: Text;
    category: Text;
    icon: Text;
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
      name = "Produce";
      items = [
        { name = "Apples"; icon = "🍎" },
        { name = "Bananas"; icon = "🍌" },
        { name = "Oranges"; icon = "🍊" },
        { name = "Lettuce"; icon = "🥬" },
        { name = "Tomatoes"; icon = "🍅" },
        { name = "Carrots"; icon = "🥕" },
        { name = "Broccoli"; icon = "🥦" },
        { name = "Potatoes"; icon = "🥔" },
        { name = "Onions"; icon = "🧅" },
        { name = "Garlic"; icon = "🧄" },
      ];
    },
    {
      name = "Dairy";
      items = [
        { name = "Milk"; icon = "🥛" },
        { name = "Cheese"; icon = "🧀" },
        { name = "Yogurt"; icon = "🥣" },
        { name = "Butter"; icon = "🧈" },
        { name = "Eggs"; icon = "🥚" },
        { name = "Cream"; icon = "🍶" },
        { name = "Sour Cream"; icon = "🥄" },
        { name = "Cottage Cheese"; icon = "🥛" },
      ];
    },
    {
      name = "Breads & Cereals";
      items = [
        { name = "Bread"; icon = "🍞" },
        { name = "Bagels"; icon = "🥯" },
        { name = "Croissants"; icon = "🥐" },
        { name = "Cereal"; icon = "🥣" },
        { name = "Oatmeal"; icon = "🥣" },
        { name = "Muffins"; icon = "🧁" },
        { name = "Tortillas"; icon = "🫓" },
      ];
    },
    {
      name = "Pasta, Rice & Beans";
      items = [
        { name = "Spaghetti"; icon = "🍝" },
        { name = "Rice"; icon = "🍚" },
        { name = "Beans"; icon = "🫘" },
        { name = "Lentils"; icon = "🫘" },
        { name = "Quinoa"; icon = "🍚" },
        { name = "Couscous"; icon = "🍚" },
      ];
    },
    {
      name = "Meat & Seafood";
      items = [
        { name = "Chicken"; icon = "🍗" },
        { name = "Beef"; icon = "🥩" },
        { name = "Pork"; icon = "🥓" },
        { name = "Fish"; icon = "🐟" },
        { name = "Shrimp"; icon = "🦐" },
        { name = "Turkey"; icon = "🦃" },
        { name = "Lamb"; icon = "🍖" },
      ];
    },
    {
      name = "Frozen Foods";
      items = [
        { name = "Ice Cream"; icon = "🍨" },
        { name = "Frozen Pizza"; icon = "🍕" },
        { name = "Frozen Vegetables"; icon = "🥶" },
        { name = "Frozen Meals"; icon = "🍱" },
        { name = "Frozen Fruit"; icon = "🍇" },
      ];
    },
    {
      name = "Snacks & Candy";
      items = [
        { name = "Chips"; icon = "🥔" },
        { name = "Cookies"; icon = "🍪" },
        { name = "Chocolate"; icon = "🍫" },
        { name = "Candy"; icon = "🍬" },
        { name = "Popcorn"; icon = "🍿" },
        { name = "Nuts"; icon = "🥜" },
        { name = "Pretzels"; icon = "🥨" },
      ];
    },
    {
      name = "Beverages";
      items = [
        { name = "Water"; icon = "💧" },
        { name = "Soda"; icon = "🥤" },
        { name = "Coffee"; icon = "☕" },
        { name = "Tea"; icon = "🍵" },
        { name = "Juice"; icon = "🧃" },
        { name = "Beer"; icon = "🍺" },
        { name = "Wine"; icon = "🍷" },
      ];
    },
    {
      name = "Canned Goods";
      items = [
        { name = "Soup"; icon = "🥣" },
        { name = "Canned Vegetables"; icon = "🥫" },
        { name = "Canned Fruit"; icon = "🥫" },
        { name = "Canned Beans"; icon = "🥫" },
        { name = "Canned Fish"; icon = "🐟" },
        { name = "Tomato Sauce"; icon = "🍅" },
      ];
    },
    {
      name = "Condiments & Spices";
      items = [
        { name = "Salt"; icon = "🧂" },
        { name = "Pepper"; icon = "🌶️" },
        { name = "Ketchup"; icon = "🍅" },
        { name = "Mustard"; icon = "🌭" },
        { name = "Mayonnaise"; icon = "🥚" },
        { name = "Olive Oil"; icon = "🫒" },
        { name = "Vinegar"; icon = "🍶" },
      ];
    },
    {
      name = "Baking Supplies";
      items = [
        { name = "Flour"; icon = "🌾" },
        { name = "Sugar"; icon = "🍬" },
        { name = "Baking Powder"; icon = "🧑‍🍳" },
        { name = "Vanilla Extract"; icon = "🧪" },
        { name = "Chocolate Chips"; icon = "🍫" },
        { name = "Yeast"; icon = "🍞" },
      ];
    },
    {
      name = "Personal Care";
      items = [
        { name = "Soap"; icon = "🧼" },
        { name = "Shampoo"; icon = "🧴" },
        { name = "Toothpaste"; icon = "🦷" },
        { name = "Deodorant"; icon = "💨" },
        { name = "Toilet Paper"; icon = "🧻" },
        { name = "Tissues"; icon = "🤧" },
      ];
    },
    {
      name = "Cleaning Supplies";
      items = [
        { name = "Laundry Detergent"; icon = "🧺" },
        { name = "Dish Soap"; icon = "🍽️" },
        { name = "All-Purpose Cleaner"; icon = "🧽" },
        { name = "Sponges"; icon = "🧽" },
        { name = "Trash Bags"; icon = "🗑️" },
        { name = "Paper Towels"; icon = "🧻" },
      ];
    },
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

  public query func getPredefinedCategories() : async [Category] {
    predefinedCategories
  };

  // System functions for upgrades
  system func preupgrade() {
    Debug.print("Preparing for upgrade...");
  };

  system func postupgrade() {
    Debug.print("Upgrade completed successfully.");
  };
}