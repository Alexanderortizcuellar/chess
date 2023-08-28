"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
__exportStar(require("./types"), exports);
var UPDATE_INTERVAL = 100;
/** Chess clock */
var Clock = /** @class */ (function () {
    function Clock(_a) {
        var _b = _a.name, name = _b === void 0 ? hourglass.name : _b, _c = _a.stages, stages = _c === void 0 ? hourglass.stages : _c, _d = _a.updateInterval, updateInterval = _d === void 0 ? UPDATE_INTERVAL : _d, callback = _a.callback;
        this._move = [0, 0];
        this._log = [[], []];
        this._status = 'ready';
        this._name = name;
        this._stages = stages.map(function (e, i) { return (__assign({ i: i }, e)); });
        this._stage = [this._stages[0], this._stages[0]];
        this._remainingTime = __spreadArray([], __read(this._stages[0].time));
        this._updateInterval = updateInterval;
        this._callback = callback;
    }
    Clock.prototype.reset = function (_a) {
        var _b = _a === void 0 ? {} : _a, name = _b.name, stages = _b.stages;
        if (name !== undefined && stages !== undefined) {
            this._stages = stages.map(function (e, i) { return (__assign({ i: i }, e)); });
            this._name = name;
        }
        this._log = [[], []];
        this._move = [0, 0];
        this._stage = [this._stages[0], this._stages[0]];
        this._remainingTime = __spreadArray([], __read(this._stages[0].time));
        this._lastPlayer = undefined;
        this._status = 'ready';
        this._timestamp = undefined;
        this._white = undefined;
        this._invokeCallback();
    };
    /** Pauses clock. */
    Clock.prototype.pause = function () {
        if (this._status !== 'live' || this._lastPlayer === undefined)
            return;
        if (this._interval !== undefined)
            clearInterval(this._interval);
        this._record(this._other(this._lastPlayer));
        this._status = 'paused';
        this._invokeCallback();
    };
    /** Resumes paused clock. */
    Clock.prototype.resume = function () {
        var _this = this;
        if (this._status !== 'paused')
            return;
        this._timestamp = Date.now();
        this._interval = setInterval(function () {
            if (_this._lastPlayer !== undefined)
                _this._tick(_this._other(_this._lastPlayer));
        }, this._updateInterval);
        this._status = 'live';
        this._invokeCallback();
    };
    /** Adds time to a player. */
    Clock.prototype.addTime = function (player, time) {
        this._addTime(player, time);
        this._invokeCallback();
    };
    /** Ends player's turn (push button). */
    Clock.prototype.push = function (player) {
        var _this = this;
        if (this._status === 'done' || this._status === 'paused')
            return false;
        if (this._lastPlayer === player)
            return false;
        if (this._status === 'ready')
            this._status = 'live';
        if (this._interval !== undefined)
            clearInterval(this._interval);
        if (this._timestamp === undefined)
            this._white = this._other(player);
        this._lastPlayer = player;
        var done = this._record(player);
        if (done)
            return false;
        this._logMove(player);
        this._fischer(player);
        this._bronstein(player);
        this._updateStage(player);
        this._log[this._other(player)].push(0);
        this._interval = setInterval(function () {
            _this._tick(_this._other(player));
        }, this._updateInterval);
        this._invokeCallback();
        return true;
    };
    Object.defineProperty(Clock.prototype, "state", {
        /** Returns clock's state. */
        get: function () {
            return {
                name: this._name,
                remainingTime: this._remainingTime,
                move: this._move,
                stage: this._stage,
                lastPlayer: this._lastPlayer,
                log: this._log,
                status: this._status,
                timestamp: this._timestamp,
                stages: this._stages,
                white: this._white,
            };
        },
        enumerable: false,
        configurable: true
    });
    Clock.prototype._fischer = function (player) {
        if (this._stage[player].mode === 'Fischer')
            this._remainingTime[player] += this._stage[player].increment || 0;
    };
    Clock.prototype._bronstein = function (player) {
        if (this._stage[player].mode === 'Bronstein') {
            var spent = this._log[player][this._log[player].length - 1] || 0;
            var increment = this._stage[player].increment || 0;
            var add = Math.min(spent, increment);
            this._remainingTime[player] += add;
        }
    };
    Clock.prototype._addTime = function (player, time) {
        this._remainingTime[player] += time;
    };
    Clock.prototype._invokeCallback = function () {
        if (this._callback)
            this._callback(this.state);
    };
    Clock.prototype._logMove = function (player) {
        this._move[player]++;
    };
    Clock.prototype._updateStage = function (player) {
        var _this = this;
        var newStage = this._stages.find(function (e) { return e.move === _this._move[player]; });
        if (newStage) {
            this._addTime(player, newStage.time[player]);
            this._stage[player] = newStage;
        }
    };
    Clock.prototype._record = function (player) {
        var before = this._timestamp;
        var after = (this._timestamp = Date.now());
        if (before !== undefined) {
            var diff = after - before;
            this._log[player][this._log[player].length - 1] += diff;
            if (this._stage[player].mode === 'Delay') {
                this._withDelay(player, diff);
            }
            else {
                this._addTime(player, -diff);
                if (this._stage[player].mode === 'Hourglass')
                    this._addTime(this._other(player), diff);
            }
        }
        if (this._remainingTime[player] <= 0) {
            this._remainingTime[player] = 0;
            this._status = 'done';
            return true;
        }
        return false;
    };
    Clock.prototype._withDelay = function (player, diff) {
        var delay = this._stage[player].increment || 0;
        var elapsed = this._log[player][this._log[player].length - 1];
        if (elapsed - diff > delay) {
            this._addTime(player, -diff);
            return;
        }
        if (elapsed > delay) {
            this._addTime(player, -(elapsed - delay));
        }
    };
    Clock.prototype._tick = function (player) {
        if (this._status !== 'live')
            return;
        this._record(player);
        this._invokeCallback();
    };
    Clock.prototype._other = function (player) {
        return player === 1 ? 0 : 1;
    };
    /** Add/replace a config in configs store. */
    Clock.setConfig = function (name, stages) {
        Clock._Configs.set(name, stages);
    };
    /** Delete a config by name in configs store. */
    Clock.deleteConfig = function (name) {
        Clock._Configs.delete(name);
    };
    /** Get a config by name from configs store. */
    Clock.getConfig = function (name) {
        var stages = Clock._Configs.get(name);
        if (!stages)
            return;
        return {
            name: name,
            stages: stages,
        };
    };
    /** List config names from configs store. */
    Clock.listConfigNames = function () {
        return __spreadArray([], __read(Clock._Configs.keys()));
    };
    /** List config entries from configs store. */
    Clock.listConfigEntries = function () {
        return __spreadArray([], __read(Clock._Configs.entries()));
    };
    Clock._Configs = new Map();
    return Clock;
}());
exports.Clock = Clock;
var hourglass = {
    name: 'Hourglass 1',
    stages: [
        {
            time: [60000, 60000],
            mode: 'Hourglass',
            increment: 0,
        },
    ],
};
Clock.setConfig(hourglass.name, hourglass.stages);
Clock.setConfig('Fischer Blitz 5|0', [
    {
        time: [300000, 300000],
        mode: 'Fischer',
        increment: 0,
    },
]);
Clock.setConfig('Fischer Rapid 5|5', [
    {
        time: [300000, 300000],
        mode: 'Fischer',
        increment: 5000,
    },
]);
Clock.setConfig('Fischer Rapid 10|5', [
    {
        time: [600000, 600000],
        mode: 'Fischer',
        increment: 5000,
    },
]);
Clock.setConfig('Delay Bullet 1|2', [
    {
        time: [60000, 60000],
        mode: 'Delay',
        increment: 2000,
    },
]);
Clock.setConfig('Bronstein Bullet 1|2', [
    {
        time: [60000, 60000],
        mode: 'Bronstein',
        increment: 2000,
    },
]);
Clock.setConfig('Tournament 40/120|5, 60|5', [
    {
        time: [7200000, 7200000],
        mode: 'Delay',
        increment: 5000,
    },
    {
        move: 40,
        time: [3600000, 3600000],
        mode: 'Delay',
        increment: 5000,
    },
]);
