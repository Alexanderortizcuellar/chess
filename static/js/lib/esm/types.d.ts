export declare type ClockMode = 'Delay' | 'Bronstein' | 'Fischer' | 'Hourglass';
export declare type ClockStatus = 'ready' | 'live' | 'paused' | 'done';
export interface ClockStage {
    i?: number;
    time: [number, number];
    move?: number;
    increment: number;
    mode: ClockMode;
}
export interface ClockState {
    name?: string;
    move: [number, number];
    remainingTime: [number, number];
    lastPlayer?: 0 | 1;
    log: [number[], number[]];
    status: ClockStatus;
    stage: [ClockStage, ClockStage];
    timestamp?: number;
    stages: ClockStage[];
    white?: 0 | 1;
}
export interface ClockInterface {
    name?: string;
    stages?: ClockStage[];
    updateInterval?: number;
    callback?(state: ClockState): void;
}
