export function WindowEvents(id: number) {
    return {
        async *[Symbol.asyncIterator]() {
            while (true) {
                const eVENT = await api.window.nextEvent(id);
                yield eVENT;
            }
        }
    }
}
export function Print(text: string) {
    return api.fd.write(1, text+"\n");
}
export namespace Environ {
    export function Get(name: string) {
        return api.environ.get(name);
    }
    export function Set(name: string, value: string) {
        return api.environ.set(name, value);
    }
}
