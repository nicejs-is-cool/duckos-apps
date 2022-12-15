import { EventEmitter } from 'events';
import { Buffer } from 'buffer'
class ReadableStream extends EventEmitter {
    readableFlowing = false;
    constructor() {
        super();
        this.resume();
    }
    private _timer_id: number = -1;
    private buffer: number[] = [];
    private _read(am: number) {
        if (this.readableFlowing) return null;
        /*let a = this.buffer.pop();
        if (!a) return null;
        let newbuf = a.subarray(0, am);
        if (newbuf.length > 0) this.buffer.push(newbuf);
        return newbuf;*/
        let newbuf: number[] = [];
        for (let i = 0; i < am; i++) {
            let res = this.buffer.pop();
            if (!res) break;
            newbuf.push(res);
        }
        if (newbuf.length === 0) return null;
        return Buffer.from(newbuf);
    }
    public read(am: number) {
        if (this.readableFlowing) return null;
        return this._read(am);
    }
    pause() {
        this.readableFlowing = false;
        this.emit('pause');
        clearInterval(this._timer_id);
    }
    resume() {
        if (this.readableFlowing) throw new Error('already resumed');
        this.emit('resume');
        this.readableFlowing = true;
        //@ts-ignore
        this._timer_id = setInterval(() => {
            this._flowingmode_pop();
        }, 100);

    }
    _push2ibuf(buf: Buffer) {
        const arr = [...buf];
        //this.buffer.push.apply(this.buffer, arr);
        for (const a of arr) {
            this.buffer.push(a);
        }
    }
    _flowingmode_pop() {
        const toemit: number[] = [];
        for (let i = 0; i < 65535; i++) {
            const res = this.buffer.pop();
            if (!res) break;
            toemit.push(res);
        }
        if (toemit.length > 0) this.emit('data', Buffer.from(toemit));
    }
    pipe(stream: ReadableStream) {
        if (!this.readableFlowing) throw new Error('stream must be in readable flowing mode to pipe');
        this.on('data', (buf: Buffer) => {
            stream._push2ibuf(buf);
        })
    }
}
class WritableStream extends EventEmitter {
    private ended = false;
    private corked = false;
    private buffer: (Buffer | string)[] = [];
    public writable = true;
    constructor(public on_write?: (data: Buffer) => void) {
        super();
    }
    private _write(data: Buffer | string) {
        if (this.ended) throw new Error('stream ended');
        const ldata = typeof data === "string" ? Buffer.from(data) : data;
        if (this.on_write) this.on_write(ldata);
        else; this.buffer.push(ldata);
    }
    write(data: Buffer | string) {
        if (this.corked) return this.buffer.push(data);
        return this._write(data);
    }
    cork() {
        this.corked = true;
    }
    uncork() {
        if (!this.corked) throw new Error('not corked');
        for (const buf of this.buffer) {
            this._write(buf);
        }
        this.corked = false;
    }
    end(data?: Buffer | string) {
        if (data) this.write(data);
        this.ended = true;
    }
}
export namespace stream {
    export const readable = ReadableStream;
    export const writable = WritableStream;
}
export namespace process {
    export const stdin = new ReadableStream();
    export const stdout = new WritableStream();
    export const stderr = new WritableStream();
    export const version = "v17.3.1";
    export const versions = {
        node: '17.3.1',
        v8: '9.6.180.15-node.12',
        uv: '1.42.0',
        zlib: '1.2.11',
        brotli: '1.0.9',
        ares: '1.18.1',
        modules: '102',
        nghttp2: '1.45.1',
        napi: '8',
        llhttp: '6.0.4',
        openssl: '3.0.1+quic',
        cldr: '40.0',
        icu: '70.1',
        tz: '2021a3',
        unicode: '14.0',
        ngtcp2: '0.1.0-DEV',
        nghttp3: '0.1.0-DEV'
    }
    export function uptime() {
        return performance.now();
    }
    export function kill(pid: number) {
        return api.proc.kill(pid);
    }
    export function exit() {
        throw new Error('not implemented: process.exit');
    }
    export let pid: number = -1;
    export const platform = "linux";
    export const arch = "wasm32";
    export let env = {};
    export function memoryUsage() {
        return {
            rss: 0,
            heapTotal: 1,
            heapUsed: 0,
            external: 0,
            arrayBuffers: 0
        }
    }
    /**
     * **note:** this must be set manually by the main function
     */
    export let argv = [];
}
api.proc.getpid().then(x => {
    process.pid = x;
})
api.environ.list().then(x => {
    process.env = x;
})
export namespace os {
    export const EOL = '\n';
    export function endianness() {
        return 'LE';
    }
    export function version() {
        return 'DuckOS';
    }
    export function tmpdir() {
        return '/tmp';
    }
    export function hostname() {
        return 'duckos';
    }
    export function platform() { return 'wasm32' };
    export function arch() { return 'wasm32' };
}
export * as buffer from 'buffer';
export const events = EventEmitter;
