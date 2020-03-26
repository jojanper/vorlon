const ERROR = 'error';
const CONFIG = 'config';
const WORKER_ERROR = 'worker-error';

export const EVENTS = {
    // Error occured in the decoder
    ERROR,

    // Configuration event
    CONFIG,

    // Worker error
    WORKER_ERROR
};

export class EventEmitter {
    static createErrorEvent(error) {
        return { error };
    }
}

export class EventReceiver {
    constructor(worker) {
        this.worker = worker;

        this.subscribers = {};
        this.subscribers[ERROR] = [];
        this.subscribers[WORKER_ERROR] = [];
        this.subscribers[CONFIG] = [];

        this.init();
    }

    on(event, fn) {
        if (this.subscribers[event]) {
            this.subscribers[event].push(fn);
        }
    }

    init() {
        // For Node worker
        if (this.worker.on) {
            this.worker.on('message', this.sendEvent.bind(this));
        }

        // For browsers
        this.worker.onmessage = this.sendEvent.bind(this);

        // Handle worker errors (these are fatal in nature and should happen only in rare occations)
        this.worker.onerror = (err) => {
            err.preventDefault();
            this.subscribers[WORKER_ERROR].forEach(fn => fn(err));
        };
    }

    clear() {
        this.subscribers[ERROR] = [];
        this.subscribers[CONFIG] = [];
    }

    sendEvent(event) {
        if (event.data.error) {
            this.subscribers[ERROR].forEach(fn => fn(event.data.error));
        } else if (event.data.config) {
            this.subscribers[CONFIG].forEach(fn => fn(event.data.config));
        } else {
            throw new Error(event.data);
        }
    }
}
