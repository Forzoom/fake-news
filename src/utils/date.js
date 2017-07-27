const date = new Date();
const time = date.valueOf();

export function toTimestamp(val) {
    let timestamp = val;
    if (typeof val === 'string') {
        if (val.indexOf('-') >= 0) {
            const tmp = val.split(' ');
            const date = tmp[0].split('-');
            const time = tmp[1].split(':');
            console.log(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
            timestamp = (new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2])).valueOf();
        } else {
            timestamp = (new Date(timestamp)).valueOf();
        }
    }
    return timestamp;
}

export function now() {
    return time;
}