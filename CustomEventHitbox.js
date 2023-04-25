/*:
 * @target MZ
 * @plugindesc Custom Hitbox for Events with Visualization
 * @author ChatGPT
 *
 * @param Show Hitboxes
 * @desc Show hitboxes for debugging purposes
 * @type boolean
 * @default false
 *
 * @help This plugin allows you to define custom hitboxes for events using Note tags.
 */

(() => {
	const parameters = PluginManager.parameters('CustomEventHitbox');
	const showHitboxes = parameters['Show Hitboxes'] === 'true';

	Game_CharacterBase.prototype.collidedEvents = function (x, y) {
		const isPlayerMoveRoute = this instanceof Game_Player && this._moveRouteForcing;
		const events = $gameMap.events().filter(event => {
		  if (event.isThrough() || event === this || (isPlayerMoveRoute && !event.isNormalPriority())) {
			return false;
		  }
		  const hitboxData = event.hitboxData();
		  const eventLeft = event.screenX() - $gameMap.tileWidth() / 2 + hitboxData.offsetX;
		  const eventRight = eventLeft + hitboxData.width;
		  const eventTop = event.screenY() - $gameMap.tileHeight() + hitboxData.offsetY;
		  const eventBottom = eventTop + hitboxData.height;
	  
		  const charLeft = this.screenX() - $gameMap.tileWidth() / 2;
		  const charRight = charLeft + $gameMap.tileWidth();
		  const charTop = this.screenY() - $gameMap.tileHeight();
		  const charBottom = charTop + $gameMap.tileHeight();
	  
		  return (
			eventLeft < charRight &&
			eventRight > charLeft &&
			eventTop < charBottom &&
			eventBottom > charTop
		  );
		});
		return events;
	  };
	  
	  
	  

	class HitboxLayer extends PIXI.Container {
		constructor() {
			super();
			this.zIndex = 100;
			this._hitboxSprites = new Map();
		}

		update() {
			$gameMap.events().forEach(event => {
				const showHitboxTag = /<showhitbox>/i;
				const eventNote = event.event().note;
				const showHitbox = eventNote.match(showHitboxTag);

				if (showHitboxes && showHitbox) {
					if (!this._hitboxSprites.has(event)) {
						const hitboxSprite = new PIXI.Graphics();
						this.addChild(hitboxSprite);
						this._hitboxSprites.set(event, hitboxSprite);
					}
					const hitboxData = event.hitboxData();
					const hitboxSprite = this._hitboxSprites.get(event);
					hitboxSprite.clear();
					hitboxSprite.beginFill(0xff0000, 0.5);
					hitboxSprite.drawRect(
						event.screenX() - $gameMap.tileWidth() / 2 + hitboxData.offsetX,
						event.screenY() - $gameMap.tileHeight() + hitboxData.offsetY,
						hitboxData.width * $gameMap.tileWidth(),
						hitboxData.height * $gameMap.tileHeight()
					  );
					hitboxSprite.endFill();
				} else {
					if (this._hitboxSprites.has(event)) {
						const hitboxSprite = this._hitboxSprites.get(event);
						this.removeChild(hitboxSprite);
						this._hitboxSprites.delete(event);
					}
				}
			});
		}
	}

	const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function () {
		_Scene_Map_createDisplayObjects.call(this);
		this._hitboxLayer = new HitboxLayer();
		this.addChild(this._hitboxLayer);
	};

	const _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function () {
		_Scene_Map_update.call(this);
		this._hitboxLayer.update();
	};

	Game_Event.prototype.hitboxData = function () {
		if (this._hitboxData === undefined) {
			this._hitboxData = { width: 1, height: 1, offsetX: 0, offsetY: 0 };

			const note = this.event().note;
			const widthMatch = note.match(/<width:\s*(\d+)>/i);
			const heightMatch = note.match(/<height:\s*(\d+)>/i);
			const offsetXMatch = note.match(/<offsetx:\s*(-?\d+)>/i);
			const offsetYMatch = note.match(/<offsety:\s*(-?\d+)>/i);

			if (widthMatch) this._hitboxData.width = parseInt(widthMatch[1]);
			if (heightMatch) this._hitboxData.height = parseInt(heightMatch[1]);
			if (offsetXMatch) this._hitboxData.offsetX = parseInt(offsetXMatch[1]);
			if (offsetYMatch) this._hitboxData.offsetY = parseInt(offsetYMatch[1]);
		}
		return this._hitboxData;
	};

	Game_CharacterBase.prototype.isCollidedWithCharacters = function (x, y) {
		return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
	};

	Game_CharacterBase.prototype.isCollidedWithEvents = function (x, y) {
		const collidedEvents = this.collidedEvents(x, y);
		if (collidedEvents.length === 0) {
		  return false;
		}
	  
		return collidedEvents.some(event => {
		  const isNormalPriority = event._priorityType === 1 && this.isNormalPriority();
		  return !isNormalPriority;
		});
	  };



// Compatibility with SAN_AnalogMove
if (typeof SAN === "object" && typeof SAN.AnalogMove === "object") {
	const _SAN_Game_CharacterBase_isCollidedWithCharacters = Game_CharacterBase.prototype.isCollidedWithCharacters;
	Game_CharacterBase.prototype.isCollidedWithCharacters = function (x, y) {
	  if (_SAN_Game_CharacterBase_isCollidedWithCharacters.call(this, x, y)) {
		return true;
	  }
	  return this.isCollidedWithEvents(x, y);
	};
  }
  
  

	Game_Player.prototype.hitboxData = function () {
		return { width: 1, height: 1, offsetX: 0, offsetY: 0 };
	};
	
	Game_Map.prototype.eventsAreColliding = function (eventId1, eventId2) {
		let event1, event2;

		if (eventId1 === 0) {
			event1 = $gamePlayer;
		} else {
			event1 = this.event(eventId1);
		}
	
		if (eventId2 === 0) {
			event2 = $gamePlayer;
		} else {
			event2 = this.event(eventId2);
		}

		if (!event1 || !event2) return false;

		const hitboxData1 = event1.hitboxData();
		const hitboxData2 = event2.hitboxData();

		const left1 = event1.screenX() - $gameMap.tileWidth() / 2 + hitboxData1.offsetX;
		const right1 = left1 + hitboxData1.width * $gameMap.tileWidth();
		const top1 = event1.screenY() - $gameMap.tileHeight() + hitboxData1.offsetY;
		const bottom1 = top1 + hitboxData1.height * $gameMap.tileHeight();

		const left2 = event2.screenX() - $gameMap.tileWidth() / 2 + hitboxData2.offsetX;
		const right2 = left2 + hitboxData2.width * $gameMap.tileWidth();
		const top2 = event2.screenY() - $gameMap.tileHeight() + hitboxData2.offsetY;
		const bottom2 = top2 + hitboxData2.height * $gameMap.tileHeight();

		const collide =
			left1 < right2 &&
			right1 > left2 &&
			top1 < bottom2 &&
			bottom1 > top2;

		return collide;
	};

	// Override Game_CharacterBase.prototype.screenX() và Game_CharacterBase.prototype.screenY() để loại bỏ lưới của game
	Game_CharacterBase.prototype.screenX = function () {
		const tw = $gameMap.tileWidth();
		const dx = this.scrolledX() * tw;
		return Math.round(dx + tw / 2);
	};

	Game_CharacterBase.prototype.screenY = function () {
		const th = $gameMap.tileHeight();
		const dy = this.scrolledY() * th;
		return Math.round(dy + th - this.shiftY());
	};

})();  