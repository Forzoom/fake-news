import {
    now,
} from './date';

export function increasing(val, startTimestamp, duration = 10800) {
    let diff = now() - startTimestamp;
    duration *= 1000;
    diff = diff < 0 ? 0 : diff;
    return Math.min(Math.max(parseInt(val * Math.log((diff / duration) * (Math.E - 1) + 1)), 0), 1 * val);
}