/*:
 * @plugindesc Custom Equip Scene
 * @author ChatGPT
 *
 * @param targetActorId
 * @text Target Actor ID
 * @desc The ID of the actor to display and manage equipment for.
 * @type number
 * @min 1
 * @default 1
 *
 * @param helpWindowX
 * @text Help Window X
 * @desc The X position of the help window. Use "center" to center it horizontally.
 * @type combo
 * @option center
 * @default center
 *
 * @param helpWindowY
 * @text Help Window Y
 * @desc The Y position of the help window. Use "center" to center it vertically.
 * @type combo
 * @option center
 * @default center
 *
 * @param helpWindowWidth
 * @text Help Window Width
 * @desc The width of the help window.
 * @type number
 * @min 1
 * @default 816
 *
 * @param helpWindowHeight
 * @text Help Window Height
 * @desc The height of the help window.
 * @type number
 * @min 1
 * @default 72
 *
 * @param armorWindowX
 * @text Armor Window X
 * @desc The X position of the armor window. Use "center" to center it horizontally.
 * @type combo
 * @option center
 * @default center
 *
 * @param armorWindowY
 * @text Armor Window Y
 * @desc The Y position of the armor window. Use "center" to center it vertically.
 * @type combo
 * @option center
 * @default center
 *
 * @param armorWindowWidth
 * @text Armor Window Width
 * @desc The width of the armor window.
 * @type number
 * @min 1
 * @default 816
 *
 * @param armorWindowHeight
 * @text Armor Window Height
 * @desc The height of the armor window.
 * @type number
 * @min 1
 * @default 408
 *
 * @param categoryWindowHeight
 * @text Category Window Height
 * @desc The height of the category window.
 * @type number
 * @min 1
 * @default 72
 *
 * @param statusWindowX
 * @text Status Window X
 * @desc The X position of the status window. Use "center" to center it horizontally.
 * @type combo
 * @option center
 * @default 0
 *
 * @param statusWindowY
 * @text Status Window Y
 * @desc The Y position of the status window. Use "center" to center it vertically.
 * @type combo
 * @option center
 * @default 0
 *
 * @param statusWindowWidth
 * @text Status Window Width
 * @desc The width of the status window.
 * @type number
 * @min 1
 * @default 300
 *
 * @param statusWindowHeight
 * @text Status Window Height
 * @desc The height of the status window.
 * @type number
 * @min 1
 * @default 144
 *
 * @param paramName
 * @text Parameter Name
 * @desc The text to display for the first parameter in the status window.
 * @type string
 * @default Weapon
 *
 * @param paramName2
 * @text Parameter Name2
 * @desc The text to display for the second parameter in the status window.
 * @type string
 * @default Body Armor
 * @help This plugin allows you to create a custom equip scene that only displays armors.
 */
(() => {
  const pluginName = "CustomEquipScene";
  const parameters = PluginManager.parameters(pluginName);

  const targetActorId = Number(parameters["targetActorId"] || 1);
  const helpWindowX = (parameters["helpWindowX"] || "center").toLowerCase();
  const helpWindowY = (parameters["helpWindowY"] || "center").toLowerCase();
  const helpWindowWidth = Number(parameters["helpWindowWidth"]);
  const helpWindowHeight = Number(parameters["helpWindowHeight"]);
  const armorWindowX = (parameters["armorWindowX"] || "center").toLowerCase();
  const armorWindowY = (parameters["armorWindowY"] || "center").toLowerCase();
  const armorWindowWidth = Number(parameters["armorWindowWidth"]);
  const armorWindowHeight = Number(parameters["armorWindowHeight"]);
  const categoryWindowHeight = Number(parameters["categoryWindowHeight"]);
  const statusWindowX = (parameters["statusWindowX"] || "center").toLowerCase();
  const statusWindowY = (parameters["statusWindowY"] || "center").toLowerCase();
  const statusWindowWidth = Number(parameters["statusWindowWidth"]);
  const statusWindowHeight = Number(parameters["statusWindowHeight"]);
  const paramName = parameters["paramName"];
  const paramName2 = parameters["paramName2"];

  Scene_Equip.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createItemWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this.refreshActor();
  };

  Scene_Equip.prototype.createHelpWindow = function () {
    const rect = new Rectangle(0, 0, helpWindowWidth, helpWindowHeight);
    if (helpWindowX === "center") {
      rect.x = (Graphics.boxWidth - rect.width) / 2;
    } else {
      rect.x = parseInt(helpWindowX) || 0;
    }
    if (helpWindowY === "center") {
      rect.y = (Graphics.boxHeight - rect.height) / 2;
    } else {
      rect.y = parseInt(helpWindowY) || 0;
    }
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
  };

  Scene_Equip.prototype.createStatusWindow = function () {
    const rect = new Rectangle(0, 0, statusWindowWidth, statusWindowHeight);
    if (statusWindowX === "center") {
      rect.x = (Graphics.boxWidth - rect.width) / 2;
    } else {
      rect.x = parseInt(statusWindowX) || 0;
    }
    if (statusWindowY === "center") {
      rect.y = (Graphics.boxHeight - rect.height) / 2;
    } else {
      rect.y = parseInt(statusWindowY) || 0;
    }
    this._statusWindow = new Window_EquipStatus(rect);
    this.addWindow(this._statusWindow);
  };

  Scene_Equip.prototype.createCommandWindow = function () {
    const rect = new Rectangle(0, this._helpWindow.height, this._itemWindow.width, categoryWindowHeight);
    this._categoryWindow = new Window_CustomEquipCategory(rect);
    this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
  };

  Scene_Equip.prototype.createItemWindow = function () {
    const armorWindowWidth = parseInt(parameters["armorWindowWidth"]) || 240;
    const armorWindowHeight = parseInt(parameters["armorWindowHeight"]) || 180;
    const armorWindowX = (parameters["armorWindowX"] || "center").toLowerCase();
    const armorWindowY = (parameters["armorWindowY"] || "center").toLowerCase();
    const rect = new Rectangle();
  
    rect.width = armorWindowWidth;
    rect.height = armorWindowHeight;
  
    if (armorWindowX === "center") {
      rect.x = (Graphics.boxWidth - rect.width) / 2;
    } else {
      rect.x = parseInt(armorWindowX) || 0;
    }
  
    if (armorWindowY === "center") {
      rect.y = (Graphics.boxHeight - rect.height) / 2;
    } else {
      rect.y = parseInt(armorWindowY) || 0;
    }
  
    this._itemWindow = new Window_EquipItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._categoryWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
  };
  

  Scene_Equip.prototype.onCategoryOk = function () {
    const category = this._categoryWindow.currentSymbol();
    this._itemWindow.setCategory(category);
    this._itemWindow.activate();
    this._itemWindow.select(0);
  };

  Scene_Equip.prototype.onItemOk = function () {
    SoundManager.playEquip();
    $gameActors.actor(targetActorId).changeEquipById(this._categoryWindow.index(), this._itemWindow.item().id);
    this._itemWindow.refresh();
    this._statusWindow.refresh();
    this._itemWindow.activate();
  };

  class Window_CustomEquipCategory extends Window_HorzCommand {
    initialize(rect) {
      super.initialize(rect);
      this.select(0);
      this.callHandler("ok");
    }
    makeCommandList() {
      this.addCommand("Weapon", "weapon");
      this.addCommand("Armor", "armor");
    }
  }

  class Window_EquipStatus extends Window_Base {
    constructor(rect) {
      super(rect);
      this.refresh();
    }
    refresh() {
      this.contents.clear();
      const actor = $gameActors.actor(targetActorId);
      if (!actor) return;

      const name = actor.name();
      const weapon = actor.weapons()[0];
      const bodyArmor = actor.armors().find((armor) => armor.atypeId === 1);

      this.drawText(name, 0, 0);
      this.drawText(paramName, 0, this.lineHeight());
      if (weapon) {
        this.drawIcon(weapon.iconIndex, 0, this.lineHeight() * 2);
        this.drawText(weapon.name, this.iconWidth() + 2, this.lineHeight() * 2);
      }
      this.drawText(paramName2, 0, this.lineHeight() * 3);
      if (bodyArmor) {
        this.drawIcon(bodyArmor.iconIndex, 0, this.lineHeight() * 4);
        this.drawText(bodyArmor.name, this.iconWidth() + 2, this.lineHeight() * 4);
      }
    }
  }

  class Window_EquipItem extends Window_ItemList {
    setCategory(category) {
      this._category = category;
      this.refresh();
      this.resetScroll();
    }
    makeItemList() {
      if (this._category === "armor") {
        this._data = $gameParty.armors();
      } else if (this._category === "weapon") {
        this._data = $gameParty.weapons();
      } else {
        this._data = [];
      }
    }

    isEnabled(item) {
      return $gameActors.actor(targetActorId).canEquip(item);
    }
  }
})();