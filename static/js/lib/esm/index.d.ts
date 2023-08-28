import type { ClockInterface, ClockStage, ClockState } from './types';
export * from './types';
/** Chess clock */
export declare class Clock {
    private _name?;
    private _move;
    private _remainingTime;
    private _lastPlayer?;
    private _log;
    private _status;
    private _stage;
    private _white?;
    private _stages;
    private _updateInterval;
    private _callback?;
    private _timestamp?;
    private _interval?;
    constructor({ name, stages, updateInterval, callback, }: ClockInterface);
    /** Resets clock to initial or new config. */
    reset(): void;
    reset({ name, stages }: {
        name: string;
        stages: ClockStage[];
    }): void;
    /** Pauses clock. */
    pause(): void;
    /** Resumes paused clock. */
    resume(): void;
    /** Adds time to a player. */
    addTime(player: 0 | 1, time: number): void;
    /** Ends player's turn (push button). */
    push(player: 0 | 1): boolean;
    /** Returns clock's state. */
    get state(): ClockState;
    private _fischer;
    private _bronstein;
    private _addTime;
    private _invokeCallback;
    private _logMove;
    private _updateStage;
    private _record;
    private _withDelay;
    private _tick;
    private _other;
    private static _Configs;
    /** Add/replace a config in configs store. */
    static setConfig(name: string, stages: ClockStage[]): void;
    /** Delete a config by name in configs store. */
    static deleteConfig(name: string): void;
    /** Get a config by name from configs store. */
    static getConfig(name: string): {
        name: string;
        stages: ClockStage[];
    } | undefined;
    /** List config names from configs store. */
    static listConfigNames(): string[];
    /** List config entries from configs store. */
    static listConfigEntries(): [string, ClockStage[]][];
}
