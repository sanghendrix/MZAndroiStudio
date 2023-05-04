/*
Title: Event Factory
Author: Amphilohiy, DKPlugins
Site: https://dk-plugins.ru
E-mail: kuznetsovdenis96@gmail.com
Version: 1.0.4
Release: 20.03.2021
First release: 09.10.2020
*/

/*ru
Название: Фабрика Событий
Автор: Amphilohiy, DKPlugins
Сайт: https://dk-plugins.ru
E-mail: kuznetsovdenis96@gmail.com
Версия: 1.0.4
Релиз: 20.03.2021
Первый релиз: 09.10.2020
*/

/*:
 * @plugindesc v.1.0.4 [MV|MZ] Allows you to create, remove and replace events.
 * @author Amphilohiy, DKPlugins
 * @url https://dk-plugins.ru
 * @target MZ
 * @help

 ### Info about plugin ###
 Title: DK_Event_Factory
 Author: Amphilohiy, DKPlugins
 Site: https://dk-plugins.ru
 Version: 1.0.4
 Release: 20.03.2021
 First release: 09.10.2020

 ###=========================================================================
 ## Compatibility
 ###=========================================================================
 RPG Maker MV: 1.6+
 RPG Maker MZ: 1.0+

 ###=========================================================================
 ## Instructions
 ###=========================================================================
 ## How to create events ##
 1. Specify a map with template events in the plugin settings
 2. Call the CreateEvent plugin command, specify the parameters:
 2.1. Template event name
 (for RPG Maker MV, the name must not contain spaces!)
 2.2. X and Y event coordinates
 2.3 The variable where the number of the new event will be written.
 (if not specified, the variable number from the plugin parameters is used)

 ## How to replace events ##
 1. Specify a map with template events in the plugin settings
 2. Call the ReplaceEvent plugin command, specify the parameters:
 2.1. Template event name
 (for RPG Maker MV, the name must not contain spaces!)
 2.2. The number of the event to be replaced

 ###=========================================================================
 ## Plugin commands (RPG Maker MV)
 ###=========================================================================
 1. Create event: CreateEvent eventName x y variableId
 eventName - Event name (must not contain spaces)
 x - X of event. Calculated with Javascript.
 y - Y of event. Calculated with Javascript.
 variableId - Variable number to store the new event ID
 (if not specified, the variable ID from the plugin parameters is used)

 2. Remove event: RemoveEvent eventId
 eventId - Event ID (-1 for current event)

 3. Replace event: ReplaceEvent eventName eventId
 eventName - Event name (must not contain spaces)
 eventId - Event ID (-1 for current event)

 ###=========================================================================
 ## Script calls
 ###=========================================================================
 1. Create event: EventFactory.createEvent(eventName, x, y, variableId)
 If the variable (variableId) is not specified, then the variable from
 the plugin settings will be used!
 Returns the ID of the new event

 2. Remove event: EventFactory.removeEvent(eventId)

 3. Replace event: EventFactory.replaceEvent(eventName, eventId)

 ###=========================================================================
 ## License and terms of use
 ###=========================================================================
 You can:
 -To use the plugin for your non-commercial projects
 -Change code of the plugin

 You cannot:
 -Delete or change any information about the plugin
 -Distribute the plugin and its modifications

 ## Commercial license ##
 Visit the page: https://dk-plugins.ru/commercial-license/

 ###=========================================================================
 ## Support
 ###=========================================================================
 Donate: https://dk-plugins.ru/donate
 Become a patron: https://www.patreon.com/dkplugins

 * @command CreateEvent
 * @desc Create the event
 *
 * @arg name
 * @text Event name
 * @desc Event name
 *
 * @arg x
 * @text X
 * @desc X. Calculated with Javascript.
 * @default 0
 *
 * @arg y
 * @text Y
 * @desc Y. Calculated with Javascript.
 * @default 0
 *
 * @arg variable
 * @text Variable
 * @desc Variable
 * @type variable
 * @default 0

 * @command RemoveEvent
 * @desc Remove the event
 *
 * @arg id
 * @text Event ID
 * @desc Event ID
 * @type number
 * @min -1
 * @default -1

 * @command ReplaceEvent
 * @desc Replace the event
 *
 * @arg name
 * @text Event name
 * @desc Event name
 *
 * @arg id
 * @text Event ID
 * @desc Event ID
 * @type number
 * @min -1
 * @default -1

 * @param templates
 * @text Templates
 * @desc Map id's stored templated events.
 * @type number[]
 * @min 1
 * @default []

 * @param defaultVariable
 * @text Default variable
 * @desc If id in command not specified tries to use value of selected variable.
 * @type variable
 * @default 1

*/

/*:ru
 * @plugindesc v.1.0.4 [MV|MZ] Позволяет создавать, удалять и заменять события.
 * @author Amphilohiy, DKPlugins
 * @url https://dk-plugins.ru
 * @target MZ
 * @help

 ### Информация о плагине ###
 Название: DK_Event_Factory
 Автор: Amphilohiy, DKPlugins
 Сайт: https://dk-plugins.ru
 Версия: 1.0.4
 Релиз: 20.03.2021
 Первый релиз: 09.10.2020

 ###=========================================================================
 ## Совместимость
 ###=========================================================================
 RPG Maker MV: 1.6+
 RPG Maker MZ: 1.0+

 ###=========================================================================
 ## Инструкции
 ###=========================================================================
 ## Как создавать события ##
 1. Указать карту с шаблонными событиями в настройках плагина
 2. Вызвать команду плагина CreateEvent, указать параметры:
 2.1. Название шаблонного события
 (для RPG Maker MV название не должно содержать пробелы!)
 2.2. Координаты события X и Y
 2.3 Переменную, куда будет записан номер нового события.
 (если не указано, то используется номер переменной из параметров плагина)

 ## Как заменять события ##
 1. Указать карту с шаблонными событиями в настройках плагина
 2. Вызвать команду плагина ReplaceEvent, указать параметры:
 2.1. Название шаблонного события
 (для RPG Maker MV название не должно содержать пробелы!)
 2.2. Номер события, которое заменяется

 ###=========================================================================
 ## Команды плагина (RPG Maker MV)
 ###=========================================================================
 1. Создать событие: CreateEvent eventName x y variableId
 eventName - Название события (не должно содержать пробелы)
 x - X сообытия. Вычисляется с помощью Javascript.
 y - Y сообытия. Вычисляется с помощью Javascript.
 variableId - Номер переменной для сохранения номера нового события
 (если не указано, то используется номер переменной из параметров плагина)

 2. Удалить событие: RemoveEvent eventId
 eventId - Номер события (-1 для текущего события)

 3. Заменить событие: ReplaceEvent eventName eventId
 eventName - Название события (не должно содержать пробелы)
 eventId - Номер события (-1 для текущего события)

 ###=========================================================================
 ## Вызовы скриптов
 ###=========================================================================
 1. Создать событие: EventFactory.createEvent(eventName, x, y, variableId)
 Если переменная (variableId) не указана, то будет использована переменная из
 настроек плагина!
 Возвращает номер нового события

 2. Удалить событие: EventFactory.removeEvent(eventId)

 3. Заменить событие: EventFactory.replaceEvent(eventName, eventId)

 ###=========================================================================
 ## Лицензия и правила использования плагина
 ###=========================================================================
 Вы можете:
 -Использовать плагин в некоммерческих проектах
 -Изменять код плагина

 Вы не можете:
 -Удалять или изменять любую информацию о плагине
 -Распространять плагин и его модификации

 ## Коммерческая лицензия ##
 Посетите страницу: https://dk-plugins.ru/commercial-license/

 ###=========================================================================
 ## Поддержка
 ###=========================================================================
 Поддержать: https://dk-plugins.ru/donate
 Стать патроном: https://www.patreon.com/dkplugins

 * @command CreateEvent
 * @desc Создать событие
 *
 * @arg name
 * @text Название события
 * @desc Название события
 *
 * @arg x
 * @text X
 * @desc X. Вычисляется с помощью Javascript.
 * @default 0
 *
 * @arg y
 * @text Y
 * @desc Y. Вычисляется с помощью Javascript.
 * @default 0
 *
 * @arg variable
 * @text Переменная
 * @desc Переменная
 * @type variable
 * @default 0

 * @command RemoveEvent
 * @desc Удалить событие
 *
 * @arg id
 * @text Номер события
 * @desc Номер события
 * @type number
 * @min -1
 * @default -1

 * @command ReplaceEvent
 * @desc Заменить событие
 *
 * @arg name
 * @text Название события
 * @desc Название события
 *
 * @arg id
 * @text Номер события
 * @desc Номер события
 * @type number
 * @min -1
 * @default -1

 * @param templates
 * @text Шаблоны
 * @desc Номера карт, хранящих шаблонные события.
 * @type number[]
 * @min 1
 * @default []

 * @param defaultVariable
 * @text Стандартная переменная
 * @desc Если ID в команде не указано, то используется эта переменная.
 * @type variable
 * @default 1

*/

'use strict';

var Imported = Imported || {};
Imported['DK_Event_Factory'] = '1.0.4';

/**
 * @type {EventFactory}
 */
var $gameEventFactory = null;

//===========================================================================
// initialize parameters
//===========================================================================

const EventFactoryParams = (function() {

    function parse(string) {
        try {
            return JSON.parse(string, function(key, value) {
                if (typeof string === 'number' || typeof string === 'boolean') {
                    return string;
                }

                try {
                    if (Array.isArray(value)) {
                        return value.map(val => parse(val));
                    }

                    return parse(value);
                } catch (e) {
                    return value;
                }
            });
        } catch(e) {
            return string;
        }
    }

    const parameters = PluginManager.parameters('DK_Event_Factory');

    return Object.entries(parameters).reduce((acc, [key, value]) => {
        acc[key] = parse(value);

        return acc;
    }, {});

})();

//===========================================================================
// initialize plugin commands
//===========================================================================

const EventFactory_Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    EventFactory_Game_Interpreter_pluginCommand.apply(this, arguments);

    switch (command) {
        case 'CreateEvent': {
            const name = args[0];
            const x = eval(args[1]) || 0;
            const y = eval(args[2]) || 0;
            const variable = Number(args[3]);

            EventFactory.createEvent(name, x, y, variable);
            break;
        }
        case 'RemoveEvent': {
            let eventId = Number(args[0]) || -1;

            if (eventId === -1) {
                eventId = this.eventId();
            }

            EventFactory.removeEvent(eventId);
            break;
        }
        case 'ReplaceEvent': {
            const name = args[0];
            let eventId = Number(args[1]) || -1;

            if (eventId === -1) {
                eventId = this.eventId();
            }

            EventFactory.replaceEvent(name, x, y, eventId);
            break;
        }
    }
};

if (Utils.RPGMAKER_NAME === 'MZ') {

    PluginManager.registerCommand('DK_Event_Factory', 'CreateEvent', (args) => {
        const x = eval(args.x) || 0;
        const y = eval(args.y) || 0;
        const variable = Number(args.variable);

        EventFactory.createEvent(args.name, x, y, variable);
    });

    PluginManager.registerCommand('DK_Event_Factory', 'RemoveEvent', function(args) {
        let eventId = Number(args.id);

        if (eventId === -1) {
            eventId = this.eventId();
        }

        EventFactory.removeEvent(eventId);
    });

    PluginManager.registerCommand('DK_Event_Factory', 'ReplaceEvent', function(args) {
        let eventId = Number(args.id) || -1;

        if (eventId === -1) {
            eventId = this.eventId();
        }

        EventFactory.replaceEvent(args.name, eventId);
    });

}

//===========================================================================
// EventFactory
//===========================================================================

class EventFactory {

    constructor() {
        this.initialize.apply(this, arguments);
    }

    initialize() {
        this.eventFactory = {};
        this.eventFactoryIndexes = {};
    }

    // static methods

    static async initialize() {
        await this._loadTemplates();
        this._isReady = true;
    }

    // template methods

    static _loadMap(mapId, callback) {
        const path = 'data/Map%1.json'.format(mapId.padZero(3));
        const xhr = new XMLHttpRequest();
        let data = null;

        const onerror = function() {
            throw new Error(`Cannot load map: ${path}`);
        };
        const onload = function() {
            if (xhr.status < 400) {
                data = JSON.parse(xhr.responseText);

                if (callback) {
                    callback(data);
                }
            } else {
                onerror();
            }
        };

        xhr.open('GET', path, !!callback);
        xhr.overrideMimeType('application/json');
        xhr.onload = onload;
        xhr.onerror = onerror;
        xhr.send();

        return data;
    }

    static async _loadMapAsync(mapId) {
        return new Promise((resolve) => {
            this._loadMap(mapId, resolve);
        });
    }

    static async _loadTemplate(mapId) {
        const map = await this._loadMapAsync(mapId);

        for (const event of map.events) {
            if (event) {
                this.factoryTemplates[event.name.trim()] = event;
            }
        }
    }

    static async _loadTemplates() {
        const templates = EventFactoryParams.templates;

        if (templates.length === 0) {
            throw new Error('DK_Event_Factory: no templates!');
        }

        for (const mapId of templates) {
            await this._loadTemplate(mapId);
        }
    }

    static isReady() {
        return this._isReady || false;
    }

    static _getEventIndexes(mapId) {
        let indexes = $gameEventFactory.eventFactoryIndexes[mapId];

        if (!indexes) {
            const map = this._loadMap(mapId);

            indexes = [];

            for (const event of map.events) {
                if (event) {
                    indexes.push(event.id);
                }
            }

            $gameEventFactory.eventFactoryIndexes[mapId] = indexes;
        }

        return indexes;
    }

    static _getFreeId(mapId) {
        const events = this.getFactoryEvents(mapId);
        const indexes = this._getEventIndexes(mapId);
        let currentId = 1;

        while (true) {
            const event = events[currentId];

            if (indexes.includes(currentId)) {
                currentId++;
                continue;
            }

            /* if there is no original event or remove command */
            if (!event || event.type === 'remove') {
                return currentId;
            }

            currentId++;
        }
    }

    static getFactoryEvents(mapId) {
        let events = $gameEventFactory.eventFactory[mapId];

        if (!events) {
            events = {};

            $gameEventFactory.eventFactory[mapId] = events;

            const indexes = this._getEventIndexes(mapId);

            for (const index of indexes) {
                events[index] = new EventFactoryCommonCommand();
            }
        }

        return events;
    }

    // main methods

    static createEvent(name, x, y, variableId) {
        variableId = variableId || EventFactoryParams.defaultVariable;

        if (!this.factoryTemplates[name]) {
            throw new Error(`Cannot find an event with name "${name}" on the template maps!`);
        }

        const mapId = $gameMap.mapId();
        const events = this.getFactoryEvents(mapId);
        const freeId = this._getFreeId(mapId);
        const command = new EventFactoryCreateCommand(freeId, name, x, y);

        events[freeId] = command;

        if (variableId) {
            $gameVariables.setValue(variableId, freeId);
        }

        if (SceneManager._scene instanceof Scene_Map) {
            command.executeCurrentMap();
            $gameMap.refreshTileEvents();
        }

        return freeId;
    }

    static removeEvent(eventId) {
        eventId = eventId || $gameVariables.value(EventFactoryParams.defaultVariable);

        const mapId = $gameMap.mapId();
        const events = this.getFactoryEvents(mapId);
        const indexes = this._getEventIndexes(mapId);
        const command = new EventFactoryRemoveCommand(eventId);

        /* in case original event existed - keep remove command, otherwise we don't need command */
        if (indexes.indexOf(eventId) !== -1) {
            events[eventId] = command;
        } else {
            delete events[eventId];
        }

        if (SceneManager._scene instanceof Scene_Map) {
            command.executeCurrentMap();
            $gameMap.refreshTileEvents();
        }
    }

    static replaceEvent(name, eventId) {
        eventId = eventId || $gameVariables.value(EventFactoryParams.defaultVariable);

        if (!this.factoryTemplates[name]) {
            throw new Error(`Cannot find an event with name "${name}" on the template maps!`);
        }

        const mapId = $gameMap.mapId();
        const events = this.getFactoryEvents(mapId);
        const indexes = this._getEventIndexes(mapId);
        const command = new EventFactoryReplaceCommand(eventId, name);

        /* in case original event existed - keep replace command, otherwise we just store creation command */
        if (indexes.indexOf(eventId) !== -1) {
            events[eventId] = command;
        } else {
            events[eventId] = new EventFactoryCreateCommand(eventId, name, events[eventId].x, events[eventId].y);
        }

        if (SceneManager._scene instanceof Scene_Map) {
            command.executeCurrentMap();
            $gameMap.refreshTileEvents();
        }
    }

}

// properties

Object.defineProperties(EventFactory, {

    factoryTemplates: { value: {} }

});

// commands

class EventFactoryCommonCommand {

    constructor() {
        this.initialize.apply(this, arguments);
    }

    // properties

    get type() {
        return null;
    }

    // initialize methods

    initialize(id, name, x, y) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
    }

    // methods

    extendEvent(options = {}) {
        const name = this.name.trim();

        if (!EventFactory.factoryTemplates[name]) {
            throw new Error(`Cannot find an event with name "${name}" on the template maps!`);
        }

        const event = JsonEx.makeDeepCopy(EventFactory.factoryTemplates[name]);

        if (event.note) {
            DataManager.extractMetadata(event);
        }

        for (const key in options) {
            const value = options[key];

            event[key] = value;
        }

        return event;
    }

    execute(events) {}

    executeCurrentMap() {}

    _createSprite(event) {
        const eventSprite = new Sprite_Character(event);
        const spriteset = SceneManager._scene._spriteset;

        spriteset._characterSprites.push(eventSprite);
        spriteset._tilemap.addChild(eventSprite);
    }

    _removeSprite(oldEvent) {
        const spriteset = SceneManager._scene._spriteset;
        const sprites = spriteset._characterSprites;
        const index = sprites.findIndex(
            sprite => sprite._character._eventId === oldEvent._eventId);

        if (index >= 0) {
            const sprite = sprites[index];

            sprites.splice(index, 1);

            if (sprite.parent) {
                sprite.parent.removeChild(sprite);
            }

            if (Utils.RPGMAKER_NAME === 'MV') {
                sprite._animationSprites.forEach((animation) => {
                    animation.remove();
                });

                sprite._animationSprites = [];
            } else {
                spriteset._animationSprites.forEach((animation) => {
                    const index = animation.targetObjects.indexOf(sprite._character);

                    if (index >= 0) {
                        animation.targetObjects.splice(index, 1);

                        if (animation.targetObjects.length === 0) {
                            spriteset.removeAnimation(animation);
                        }
                    }
                });
            }
        }
    }

}

class EventFactoryCreateCommand extends EventFactoryCommonCommand {

    // properties

    get type() {
        return 'create';
    }

    // methods

    execute(events) {
        events[this.id] = this.extendEvent({
            id: this.id,
            x: this.x,
            y: this.y
        });
    }

    executeCurrentMap() {
        this.execute($dataMap.events);

        const newEvent = new Game_Event($gameMap.mapId(), this.id);

        $gameMap._events[this.id] = newEvent;

        this._createSprite(newEvent);
    }

}

class EventFactoryRemoveCommand extends EventFactoryCommonCommand {

    // properties

    get type() {
        return 'remove';
    }

    // methods

    execute(events) {
        delete events[this.id];
    }

    executeCurrentMap() {
        const oldEvent = $gameMap._events[this.id];

        delete $gameMap._events[this.id];

        oldEvent && this._removeSprite(oldEvent);
    }

}

class EventFactoryReplaceCommand extends EventFactoryCommonCommand {

    // properties

    get type() {
        return 'replace';
    }

    // methods

    execute(events) {
        const event = events[this.id];

        events[this.id] = this.extendEvent({
            id: this.id,
            x: event.x,
            y: event.y
        });
    }

    executeCurrentMap() {
        const oldEvent = $gameMap._events[this.id];

        if (!oldEvent) {
            return;
        }

        this._removeSprite(oldEvent);

        $dataMap.events[this.id] = this.extendEvent({
            id: this.id,
            x: oldEvent.x,
            y: oldEvent.y
        });

        const newEvent = new Game_Event($gameMap.mapId(), this.id);

        $gameMap._events[this.id] = newEvent;

        this._createSprite(newEvent);
    }

}

//===========================================================================
// Hacks for JsonEx encode/decode. Makes visibility for classes in window
//===========================================================================

window.EventFactory = EventFactory;
window.EventFactoryCommonCommand = EventFactoryCommonCommand;
window.EventFactoryCreateCommand = EventFactoryCreateCommand;
window.EventFactoryRemoveCommand = EventFactoryRemoveCommand;
window.EventFactoryReplaceCommand = EventFactoryReplaceCommand;

//===========================================================================
// Scene_Boot
//===========================================================================

const EventFactory_Scene_Boot_initialize = Scene_Boot.prototype.initialize;
Scene_Boot.prototype.initialize = function() {
    EventFactory_Scene_Boot_initialize.apply(this, arguments);
    EventFactory.initialize();
};

const EventFactory_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    return EventFactory_Scene_Boot_isReady.apply(this, arguments)
        && EventFactory.isReady();
};

//===========================================================================
// DataManager
//===========================================================================

const EventFactory_DataManager_setupNewGame = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
	EventFactory_DataManager_setupNewGame.apply(this, arguments);
	$gameEventFactory = new EventFactory();
};

const EventFactory_DataManager_onLoad = DataManager.onLoad;
DataManager.onLoad = function(object) {
    EventFactory_DataManager_onLoad.apply(this, arguments);

    if (object === $dataMap) {
        const mapId = $gamePlayer.isTransferring() ?
            $gamePlayer.newMapId() : $gameMap.mapId();

        if (mapId > 0) {
            const commands = EventFactory.getFactoryEvents(mapId) || {};

            for (const index in commands) {
                const command = commands[index];

                command.execute(object.events);
            }
        }
    }
};

const EventFactory_DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = EventFactory_DataManager_makeSaveContents.apply(this, arguments);

    contents.gameEventFactory = $gameEventFactory;

    return contents;
};

const EventFactory_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    EventFactory_DataManager_extractSaveContents.apply(this, arguments);

    if (contents.gameEventFactory) {
        $gameEventFactory = contents.gameEventFactory;
    }
};
