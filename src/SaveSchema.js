"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.SaveData = exports.Inventory = exports.DeathCountInLevel = exports.CollectablesOfType = exports.CollectablesInLevel = exports.Collectable = void 0;
var collectable_1 = require("./penguin-game/serialization/collectable");
__createBinding(exports, collectable_1, "Collectable");
var collectables_in_level_1 = require("./penguin-game/serialization/collectables-in-level");
__createBinding(exports, collectables_in_level_1, "CollectablesInLevel");
var collectables_of_type_1 = require("./penguin-game/serialization/collectables-of-type");
__createBinding(exports, collectables_of_type_1, "CollectablesOfType");
var death_count_in_level_1 = require("./penguin-game/serialization/death-count-in-level");
__createBinding(exports, death_count_in_level_1, "DeathCountInLevel");
var inventory_1 = require("./penguin-game/serialization/inventory");
__createBinding(exports, inventory_1, "Inventory");
var penguin_save_data_1 = require("./penguin-game/serialization/penguin-save-data");
console.log(penguin_save_data_1);
console.log(inventory_1);
__createBinding(exports, penguin_save_data_1, "PenguinSaveData");
