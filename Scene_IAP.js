/*:
 * @target MZ
 * @plugindesc Scene_IAP - A new scene with two windows
 * @author YourName
 *
 * @param leftWindowX
 * @text Left Window X
 * @desc The X position of the left window.
 * @type number
 * @default 0
 * @min 0
 *
 * @param leftWindowY
 * @text Left Window Y
 * @desc The Y position of the left window.
 * @type string
 * @default center
 *
 * @param leftWindowWidth
 * @text Left Window Width
 * @desc The width of the left window.
 * @type number
 * @default 400
 * @min 1
 *
 * @param leftWindowHeight
 * @text Left Window Height
 * @desc The height of the left window. Use "fill" to match the screen height.
 * @type string
 * @default 600
 *
 * @param rightWindowX
 * @text Right Window X
 * @desc The X position of the right window.
 * @type number
 * @default 0
 * @min 0
 *
 * @param rightWindowY
 * @text Right Window Y
 * @desc The Y position of the right window.
 * @type string
 * @default center
 *
 * @param rightWindowWidth
 * @text Right Window Width
 * @desc The width of the right window.
 * @type number
 * @default 400
 * @min 1
 *
 * @param rightWindowHeight
 * @text Right Window Height
 * @desc The height of the right window. Use "fill" to match the screen height.
 * @type string
 * @default 600
 *
 * @param windowSpacing
 * @text Window Spacing
 * @desc The spacing between the left and right windows.
 * @type number
 * @default 0
 * @min 0
 * 
 * @param items
 * @text Items
 * @type struct<Item>[]
 * @desc List of items with their properties.
 * @default []
 *
 * @command call
 * @text Call Scene IAP
 * @desc Calls the Scene_IAP.
 */
/*~struct~Item:
 * @param name
 * @text Item Name
 * @desc The name of the item.
 * @type string
 * @default Item Name
 *
 * @param imageFile
 * @text Image File
 * @desc The image file for the item.
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param commonEvent
 * @text Common Event
 * @desc The common event that will be executed when the item is interacted with.
 * @type common_event
 * @default 1
 * 
 * @param description
 * @text Description
 * @desc The description of the item.
 * @type string
 * @default Item Description
 *
 * @param price
 * @text Price
 * @desc The price of the item.
 * @type string
 * @default 0
 */

const parameters = PluginManager.parameters('Scene_IAP');

function Window_Left() {
  this.initialize(...arguments);
}

Window_Left.prototype = Object.create(Window_Selectable.prototype);
Window_Left.prototype.constructor = Window_Left;

Window_Left.prototype.initialize = function (rect) {
  this._itemActivated = false;
  Window_Selectable.prototype.initialize.call(this, rect);
  this._items = this.loadItems();
  this.refresh();
  this.select(0);
  this.setHandler("select", this.processSelect.bind(this));
};

Window_Left.prototype.maxItems = function () {
  return this._data ? this._data.length : 1;
};

Window_Left.prototype.item = function (index) {
  return this._data && index >= 0 ? this._data[index] : null;
};

Window_Left.prototype.makeItemList = function () {
  this._data = this.loadItems();
};

Window_Left.prototype.drawItem = function (index) {
  const item = this.item(index);
  if (item) {
    const rect = this.itemLineRect(index);
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(item.name, rect.x, rect.y, rect.width);
  }
};

Window_Left.prototype.refresh = function () {
  this.makeItemList();
  this.createContents();
  this.drawAllItems();
};

Window_Left.prototype.processSelect = function () { };

Window_Left.prototype.currentItem = function () {
  return this.item();
};


Window_Left.prototype.makeCommandList = function () {
  const items = JSON.parse(parameters["items"]);
  items.forEach((item) => {
    this.addCommand(item.name, "item", true);
  });
};


Window_Left.prototype.loadItems = function () {
  const parameters = PluginManager.parameters('Scene_IAP');
  const items = JSON.parse(parameters['items'] || '[]');
  return items.map(item => JSON.parse(item));
};

Window_Left.prototype.maxItems = function () {
  return this._items.length;
};

Window_Left.prototype.itemHeight = function () {
  return this.lineHeight() * 2;
};

Window_Left.prototype.fitBitmapToRect = function (bitmap, rect) {
  const widthRatio = rect.width / bitmap.width;
  const heightRatio = rect.height / bitmap.height;
  const scale = Math.min(widthRatio, heightRatio);
  return { width: bitmap.width * scale, height: bitmap.height * scale };
};

Window_Left.prototype.drawItem = function (index) {
  const item = this._items[index];
  if (!item) {
    return;
  }

  const rect = this.itemLineRect(index);
  const imageName = item.imageFile;
  const name = item.name;
  const price = item.price;

  if (imageName) {
    const bitmap = ImageManager.loadPicture(imageName);
    bitmap.addLoadListener(() => {
      const fittedSize = this.fitBitmapToRect(bitmap, rect);
      const textX = rect.x + fittedSize.width + 6;
      const textWidth = rect.width - fittedSize.width - 6;
      this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x, rect.y, fittedSize.width, fittedSize.height);
      this.drawText(item.name, textX, rect.y, textWidth - (item.price ? this.textWidth(item.price.toString()) : 0), 'left');

      this.drawText(price, textX, rect.y, textWidth, 'right');
    });
  } else {
    this.drawText(item.name, rect.x, rect.y, rect.width - this.textWidth(price.toString()), 'left');
    this.drawText(price, rect.x, rect.y, rect.width, 'right');
  }
};

Window_Left.prototype.isCursorMovable = function () {
  return this.active;
};

Window_Left.prototype.onMouseMove = function () {
  if (this.isTouchedInsideFrame()) {
    const lastIndex = this.index();
    const index = this.hitTest(TouchInput.x, TouchInput.y);
    if (index >= 0 && index !== lastIndex) {
      this.select(index);
    }
  }
};

Window_Left.prototype.onTouch = function (triggered) {
  const lastIndex = this.index();
  const index = this.hitTest(TouchInput.x, TouchInput.y);
  if (index >= 0 && index !== lastIndex) {
    this.select(index);
  }
  if (triggered && this.isTouchOkEnabled()) {
    this.processOk();
  }
};

Window_Left.prototype.processMouseEvents = function () {
  if (this.isOpenAndActive()) {
    if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
      if (!this._scrollTouch) {
        this._itemActivated = true;
        this.callHandler("ok");
      }
      this.onTouch(true);
    }
    this.onMouseMove();
  }
};

Window_Left.prototype.update = function () {
  Window_Selectable.prototype.update.call(this);
  this.updateCursor();
};

Window_Left.prototype.processTouch = function () {
  if (this.isOpenAndActive()) {
    if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
      this._touching = true;
      this.onTouch(true);
    } else if (TouchInput.isCancelled()) {
      if (this.isCancelEnabled()) {
        this.processCancel();
      }
    }
    if (this._touching) {
      if (TouchInput.isReleased() || !this.isTouchedInsideFrame()) {
        this._touching = false;
      }
    }
  } else {
    this._touching = false;
  }
};

Window_Left.prototype.isTouchedInsideFrame = function () {
  if (this.isOpen() && this.active) {
    const x = this.canvasToLocalX(TouchInput.x);
    const y = this.canvasToLocalY(TouchInput.y);
    const rect = new Rectangle(0, 0, this.width, this.height);
    if (rect.contains(x, y)) {
      const index = this.hitTest(x, y);
      if (index >= 0) {
        this.select(index);
        return true;
      }
    }
  }
  return false;
};


Window_Left.prototype.updateCursor = function () {
  if (this._cursorAll) {
    const allRect = this.cursorAllRect();
    this.setCursorRect(allRect.x, allRect.y, allRect.width, allRect.height);
  } else if (this.index() >= 0) {
    const rect = this.itemRect(this.index());
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
  } else {
    this.setCursorRect(0, 0, 0, 0);
  }
};

function Window_Right() {
  this.initialize.apply(this, arguments);
}

Window_Right.prototype = Object.create(Window_Base.prototype);
Window_Right.prototype.constructor = Window_Right;

Window_Right.prototype.initialize = function (rect, leftWindow) {
  Window_Base.prototype.initialize.call(this, rect);
  this._leftWindow = leftWindow;
  this._item = null;
  this.refresh();
};

// Thêm phương thức setItem vào Window_Right
Window_Right.prototype.setItem = function (item) {
  this._item = item;
  this.refresh();
};

Window_Right.prototype.refresh = function () {
  this.contents.clear();

  
  if (this._item) {
    const description = this._item.description;
    console.log("WR gán description bằng item dsscription");
    this.drawText(description, 0, 0, this.contentsWidth(), 'left');
  }
};

Window_Right.prototype.update = function () {
  Window_Base.prototype.update.call(this);
  this.refresh();
};

function Scene_IAP() {
  this.initialize(...arguments);
}

Scene_IAP.prototype = Object.create(Scene_ItemBase.prototype);
Scene_IAP.prototype.constructor = Scene_IAP;

Scene_IAP.prototype.initialize = function () {
  Scene_ItemBase.prototype.initialize.call(this);
};

Scene_IAP.prototype.create = function () {
  Scene_ItemBase.prototype.create.call(this);
  this.createAllWindows();
};

Scene_IAP.prototype.update = function () {
  Scene_ItemBase.prototype.update.call(this);
};

Scene_IAP.prototype.terminate = function () {
  Scene_ItemBase.prototype.terminate.call(this);
};

Scene_IAP.prototype.popScene = function () {
  Scene_ItemBase.prototype.popScene.call(this);
};

Scene_IAP.prototype.onLeftWindowOk = function () {
  const item = this._leftWindow.item(this._leftWindow.index());
  if (item) {
    const eventId = Number(item.commonEvent);
    console.log("Event ID:", eventId);
    if (eventId > 0) {
      this._leftWindow.deselect();
      $gameTemp.reserveCommonEvent(eventId);
      this.popScene();
    }
  } else {
    console.log("No item selected");
  }
  this._leftWindow.activate();
};

Scene_IAP.prototype.start = function () {
  Scene_Base.prototype.start.call(this);
};

Scene_IAP.prototype.createAllWindows = function () {
  const screenWidth = Graphics.boxWidth;
  const screenHeight = Graphics.boxHeight;

  const parameters = PluginManager.parameters('Scene_IAP') || {};
  const leftWindowX = Number(parameters['leftWindowX']);
  const leftWindowY = parameters['leftWindowY'];
  const leftWindowWidth = Number(parameters['leftWindowWidth']);
  const leftWindowHeight = parameters['leftWindowHeight'];
  const rightWindowX = Number(parameters['rightWindowX']);
  const rightWindowY = parameters['rightWindowY'];
  const rightWindowWidth = Number(parameters['rightWindowWidth']);
  const rightWindowHeight = parameters['rightWindowHeight'];
  const windowSpacing = Number(parameters['windowSpacing']);

  const leftRectHeight = leftWindowHeight === 'fill' ? screenHeight : Number(leftWindowHeight);
  const rightRectHeight = rightWindowHeight === 'fill' ? screenHeight : Number(rightWindowHeight);

  const leftPosY = leftWindowY === 'center' ? (screenHeight - leftRectHeight) / 2 : Number(leftWindowY);
  const rightPosY = rightWindowY === 'center' ? (screenHeight - rightRectHeight) / 2 : Number(rightWindowY);

  const leftWindowYCorrected = leftWindowY === "center" ? (screenHeight - leftRectHeight) / 2 : Number(leftWindowY);


  const leftRect = new Rectangle(leftWindowX, leftWindowYCorrected, leftWindowWidth, leftRectHeight);
  const rightRect = new Rectangle(screenWidth - rightWindowWidth + rightWindowX - windowSpacing, rightPosY, rightWindowWidth, rightRectHeight);

  this._leftWindow = new Window_Left(leftRect);
  this._leftWindow.setHandler("ok", this.onLeftWindowOk.bind(this));
  this._leftWindow.setHandler("cancel", this.popScene.bind(this));
  this._leftWindow.setHandler("select", () => {
    const selectedItem = this._leftWindow.item(this._leftWindow.index());
    console.log("Selected item:", selectedItem); // Check the value of selectedItem
    this._rightWindow.setItem(selectedItem);
    this._rightWindow.refresh();
  });

  this._rightWindow = new Window_Right(rightRect, this._leftWindow);
  this._leftWindow.setHandler("deselect", () => {
    this._rightWindow.setItem(null);
  });
  this._leftWindow.activate();

  this.addWindow(this._leftWindow);
  this.addWindow(this._rightWindow);

  // Update right window content when left window item is selected
  this._leftWindow.setHandler("select", () => {
    const selectedItem = this._leftWindow.item(this._leftWindow.index());
    console.log("Selected item:", selectedItem); // Check the value of selectedItem
    this._rightWindow.setItem(selectedItem);
    this._rightWindow.refresh();
  });
  // Update right window content when left window item is deselected
  this._leftWindow.setHandler("deselect", () => {
    console.log("Deselecting item"); // Log when deselecting
    this._rightWindow.setItem(null);
  });
};

Scene_IAP.prototype.onLeftWindowOk = function () {
  const item = this._leftWindow.item(this._leftWindow.index());
  if (item) {
    const eventId = Number(item.commonEvent);
    console.log("Event ID:", eventId);
    if (eventId > 0) {
      this._leftWindow.deselect();
      $gameTemp.reserveCommonEvent(eventId);
      this.popScene();
    }
  } else {
    console.log("No item selected");
  }
  this._leftWindow.activate();
};


// Add a plugin command to call the new Scene
PluginManager.registerCommand('Scene_IAP', 'call', args => {
  SceneManager.push(Scene_IAP);
});

function callScene() {
  SceneManager.push(Scene_IAP);
}

PluginManager.registerCommand("Scene_IAP", "call", callScene); 