export class EventEmitter {
    static createErrorEvent(error) {
        return { error };
    }
}

export class EventReceiver {
    constructor(worker) {
        this.worker = worker;
        this.subscribers = {
            error: []
        };

        this.init();
    }

    on(event, fn) {
        if (this.subscribers[event]) {
            this.subscribers[event].push(fn);
        }
    }

    init() {
        this.worker.onmessage = (event) => {
            if (event.data.error) {
                this.subscribers.error.forEach(fn => fn(event.data.error));
            }
        };
    }

    clear() {
        this.subscribers.error = [];
    }
}
