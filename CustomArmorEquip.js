/*:
 * @target MZ
 * @plugindesc Custom Armor Equip
 * @author YourName
 *
 * @param ActorId
 * @text Actor ID
 * @desc ID of the actor for which the armors will be equipped.
 * @type number
 * @default 1
 *
 * @param CategoryWindowPosition
 * @text Category Window Position
 * @desc Position of the category window. Choose 'above' to place it above the item window, 'below' to place it below.
 * @type combo
 * @option above
 * @option below
 * @default above
 *
 * @param WindowWidth
 * @text Window Width
 * @desc Width of the item and help windows.
 * @type number
 * @default 816
 *
 * @param WindowHeight
 * @text Window Height
 * @desc Height of the item window.
 * @type number
 * @default 456
 *
 * @param WindowX
 * @text Window X
 * @desc X position of the item and help windows. Use 'center' to center the windows horizontally.
 * @type combo
 * @option center
 * @default center
 *
 * @param WindowY
 * @text Window Y
 * @desc Y position of the item and help windows. Use 'center' to center the windows vertically.
 * @type combo
 * @option center
 * @default center
 *
 * @param HelpWindowHeight
 * @text Help Window Height
 * @desc Height of the help window.
 * @type number
 * @default 72
 *
 * @param HelpWindowX
 * @text Help Window X
 * @desc X position of the help window. Use 'center' to center the window horizontally.
 * @type combo
 * @option center
 * @default center
 *
 * @param HelpWindowY
 * @text Help Window Y
 * @desc Y position of the help window. Use 'center' to center the window vertically.
 * @type combo
 * @option center
 * @option above
 * @option below
 * @default center
 *
 * @param HelpWindowWidth
 * @text Help Window Width
 * @desc Width of the help window.
 * @type number
 * @default 816
 *
 * @param HelpWindowHeight
 * @text Help Window Height
 * @desc Height of the help window.
 * @type number
 * @default 72
 * 
 * @param StatusWindowX
 * @text Status Window X
 * @desc X position of the status window. Use 'center' to center the window horizontally.
 * @type combo
 * @option center
 * @default center
 * 
 * @param StatusWindowY
 * @text Status Window Y
 * @desc Y position of the status window. Use 'center' to center the window vertically.
 * @type combo
 * @option center
 * @default center
 * 
 * @param StatusWindowWidth
 * @text Status Window Width
 * @desc Width of the status window.
 * @type number
 * @default 816
 * 
 * @param StatusWindowHeight
 * @text Status Window Height
 * @desc Height of the status window.
 * @type number
 * @default 72
 * 
 * @param Actor Image
 * @type file
 * @dir img/system
 * @desc The actor image to be displayed in the Equip Scene. Place the image in the img/system folder.
 * @default Actor1_1
 *
 * @param Actor Image Position
 * @type struct<ImagePosition>
 * @desc Position and size settings for the actor image.
 * @default {"x":"0","y":"0","size":"1.0"}
 *
 * @help CustomArmorEquip.js
 *
 * This plugin modifies the default equip scene to only show armors in a single window.
 * When an armor is triggered, it will be automatically equipped to the specified actor.
 */
/*~struct~ImagePosition:
 * @param x
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc X position of the actor image.
 *
 * @param y
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc Y position of the actor image.
 *
 * @param size
 * @type number
 * @decimals 2
 * @min 0
 * @max 10
 * @default 1.0
 * @desc The size (scale) of the actor image. Maintains aspect ratio.
 */

(() => {
  const pluginName = "CustomArmorEquip";
  const parameters = PluginManager.parameters(pluginName);
  const targetActorId = parseInt(parameters["ActorId"]) || 1;
  const categoryWindowPosition = parameters["CategoryWindowPosition"] || "above";
  const windowWidth = parseInt(parameters["WindowWidth"]) || 816;
  const windowHeight = parseInt(parameters["WindowHeight"]) || 456;
  const windowX = parameters["WindowX"];
  const windowY = parameters["WindowY"];
  const helpWindowHeight = parseInt(parameters["HelpWindowHeight"]) || 72;
  const helpWindowX = parameters["HelpWindowX"];
  const helpWindowY = parameters["HelpWindowY"];
  const helpWindowWidth = parseInt(parameters["HelpWindowWidth"]) || 816;
  const statusWindowX = parameters["StatusWindowX"];
  const statusWindowY = parameters["StatusWindowY"];
  const statusWindowWidth = parseInt(parameters["StatusWindowWidth"]) || 816;
  const statusWindowHeight = parseInt(parameters["StatusWindowHeight"]) || 72;
  const actorImage = String(parameters["Actor Image"] || "Actor1_1");
const actorImageX = String(parameters["Actor Image X"] || "0");
const actorImageY = String(parameters["Actor Image Y"] || "0");
const actorImageSize = parseFloat(parameters["Actor Image Size"] || "1.0");


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


  Window_CustomEquipCategory.prototype.setItemWindow = function (itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
  };

  Scene_Equip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createStatusWindow();
    this.createActorImage();
  };

  Scene_Equip.prototype.createActorImage = function () {
    const bitmap = ImageManager.loadSystem(actorImage);
    const sprite = new Sprite(bitmap);
    sprite.x = parseInt(actorImageX);
    sprite.y = parseInt(actorImageY);
    sprite.scale.x = actorImageSize;
    sprite.scale.y = actorImageSize;
    this.addChild(sprite);
  };

  Scene_Equip.prototype.createCategoryWindow = function () {
    const rect = new Rectangle(0, 0, windowWidth, helpWindowHeight);
    if (windowX === "center") {
      rect.x = (Graphics.boxWidth - rect.width) / 2;
    } else {
      rect.x = parseInt(windowX) || 0;
    }
    if (categoryWindowPosition === "above") {
      if (windowY === "center") {
        rect.y = (Graphics.boxHeight - windowHeight - rect.height) / 2;
      } else {
        rect.y = parseInt(windowY) - rect.height;
      }
    } else { // below
      if (windowY === "center") {
        rect.y = (Graphics.boxHeight + windowHeight) / 2;
      } else {
        rect.y = parseInt(windowY) + windowHeight;
      }
    }
    this._categoryWindow = new Window_CustomEquipCategory(rect);
    this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
  };
  
  Scene_Equip.prototype.createHelpWindow = function () {
    const rect = new Rectangle(0, 0, helpWindowWidth, helpWindowHeight);
    if (helpWindowX === "center") {
      rect.x = (Graphics.boxWidth - rect.width) / 2;
    } else {
      rect.x = parseInt(helpWindowX) || 0;
    }
  
    if (helpWindowY === "above") {
      if (categoryWindowPosition === "above") {
        rect.y = parseInt(windowY) - helpWindowHeight * 2;
      } else {
        rect.y = parseInt(windowY) - helpWindowHeight;
      }
    } else if (helpWindowY === "below") {
      if (categoryWindowPosition === "above") {
        rect.y = parseInt(windowY) + windowHeight;
      } else {
        rect.y = parseInt(windowY) + windowHeight + helpWindowHeight;
      }
    } else if (helpWindowY === "center") {
      rect.y = (Graphics.boxHeight - rect.height) / 2;
    } else {
      rect.y = parseInt(helpWindowY) || 0;
    }
  
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
  };
  
  Scene_Equip.prototype.createItemWindow = function () {
    const rect = new Rectangle(0, 0, windowWidth, windowHeight);
    if (windowX === "center") {
      rect.x = (Graphics.boxWidth - rect.width) / 2;
    } else {
      rect.x = parseInt(windowX) || 0;
    }
    if (windowY === "center") {
      rect.y = (Graphics.boxHeight - rect.height) / 2;
    } else {
      rect.y = parseInt(windowY) || 0;
    }
    if (categoryWindowPosition === "above") {
      rect.y += helpWindowHeight;
    }
    this._itemWindow = new Window_EquipItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
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

  Scene_Equip.prototype.onCategoryOk = function () {
    const category = this._categoryWindow.currentSymbol();
    this._itemWindow.setCategory(category);
    this._itemWindow.activate();
    this._itemWindow.select(0);
  };


  Scene_Equip.prototype.onItemOk = function () {
    const item = this._itemWindow.item();
    if (item && $gameActors.actor(targetActorId).canEquip(item)) {
      $gameActors.actor(targetActorId).changeEquip(item.etypeId - 1, item);
    }
    this._itemWindow.refresh();
    this._statusWindow.refresh();
    this._itemWindow.activate();
  };

  Scene_Equip.prototype.onItemCancel = function () {
    this._itemWindow.deselect();
    this._categoryWindow.activate();
  };

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


  class Window_EquipStatus extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this.refresh();
    }

    refresh() {
      const actor = $gameActors.actor(targetActorId);
      this.contents.clear();
      if (actor) {
        const lineHeight = this.lineHeight();
        this.drawActorName(actor, 0, 0);
        this.drawItemName(actor.equips()[0], 0, lineHeight * 1);
        this.drawItemName(actor.equips()[1], 0, lineHeight * 2);
      }
    }
  }
})();

