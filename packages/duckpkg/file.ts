import { decode, encode } from 'msgpack-lite'

export class Dependency {
    constructor(
        public name: string,
        public version?: string
    ) {}
    acceptable(dep: Dependency) {
        if (!dep.version || !this.version) return true;
        if (dep.version !== this.version) return false;
        return true;
    }
}

export class Package {
    constructor(
        public name: string,
        public version: string,
        public dependencies: Dependency[],
        public tarball: Uint8Array,
        public configScript?: string
    ) {}
}

export interface Dependency_JSON {
    name: string;
    version?: string;
}

export interface Package_JSON {
    name: string;
    version: string;
    dependencies: Dependency_JSON[];
    tarball: string; // path
    configScript?: string;
}

const header = 'DKPK'.split('').map(x => x.charCodeAt(0));
export function read(buf: Uint8Array): Package {
    /*const start = buf.find((value, index, obj) => {
        return obj[index] === header[0] &&
            obj[index+1] === header[1] &&
            obj[index+2] === header[2] &&
            obj[index+3] === header[3]
    })
    if (!start) throw 'invalid format';*/

    const [ name, version, dependenciesRaw, tarball, configScript ] = decode(buf);
    const dependencies = dependenciesRaw.map((x: [string, string]) => new Dependency(...x));
    return new Package(
        name, version,
        dependencies,
        tarball,
        configScript
    )
}

export function make(pkg: Package): Uint8Array {
    return encode([
        pkg.name, pkg.version,
        pkg.dependencies.map(x => [x.name, x.version]),
        pkg.tarball,
        pkg.configScript
    ])
}