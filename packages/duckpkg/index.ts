import * as fs from '@duckos-apps/fs';
import { read, make, Package, Package_JSON, Dependency_JSON, Dependency } from './file';
import * as path from 'path';
import * as pako from 'pako'
self.window = self;

import untar from 'js-untar'

//import Yargs from 'yargs'

export async function main(argv: string[]) {
    /*await Yargs(undefined as never, argv[0])
        .scriptName(argv[0])
        //@ts-ignore
        .command('read [file]', 'Read a .dkpk header and output as JSON to stdout', (yargs) => {
            return yargs.positional('file', {
                describe: 'File to read',
                type: 'string'
            })
        }, async argv => {
            if (!argv.file) return api.fd.write(1, 'duckpkg: need file\n');
            if (!await fs.exists(argv.file)) api.fd.write(1, "duckpkg: file doesn't exist\n");
            const file = await fs.readFileBuffer(argv.file)
            try {
                const pkg = read(Buffer.from(file));
                api.fd.write(1, JSON.stringify({
                    name: pkg.name,
                    version: pkg.version,
                    configScript: pkg.configScript,
                    dependencies: pkg.dependencies.map(x => { return { name: x.name, version: x.version } })
                }, null, 2));
            } catch (err) {
                api.fd.write(1, 'duckpkg: ' + (err as string).toString());
            }
        })
        .wrap(null)
        .strict()
        .demandCommand()
        .version('v0.0.1')
        .parseAsync()*/
    if (argv[1] === 'read') {
        const filep = argv[2];
        if (!filep) return api.fd.write(1, 'duckpkg: need file\n');
        if (!await fs.exists(filep)) return api.fd.write(1, "duckpkg: file doesn't exist\n");
        const file_raw = await fs.readFileBuffer(filep)
        const file = pako.inflate(file_raw);
        try {
            const pkg = read(file);
            api.fd.write(1, JSON.stringify({
                name: pkg.name,
                version: pkg.version,
                configScript: pkg.configScript,
                dependencies: pkg.dependencies.map(x => { return { name: x.name, version: x.version } })
            }, null, 2)+"\n");
        } catch (err) {
            api.fd.write(1, 'duckpkg: ' + (err as string).toString()+'\n');
        }
    }
    if (argv[1] === 'create') { // for testing
        /*const [ name, version, configScript ] = argv.slice(2);
        if (!name || !version) return api.fd.write(1, "duckpkg: missing argument\n")
        const pkg = new Package(name, version, [], new Uint8Array(10), configScript);
        const data = make(pkg);
        //console.log(data);
        await fs.writeFile("out.dkpk", data);*/
        const filep = argv[2];
        if (!filep) return api.fd.write(1, "duckpkg: needs file\n");
        const file = path.resolve(await api.fs.getwd(), filep);
        if (!await fs.exists(filep)) return api.fd.write(1, "duckpkg: file does not exist")
        const out = argv[3] || './out.dkpk';
        const filedata: Package_JSON = JSON.parse(await fs.readFile(path.resolve(await api.fs.getwd(), file)));
        api.fd.write(1, 'creating package...\n')
        const pkg = new Package(
            filedata.name, filedata.version,
            filedata.dependencies.map(x => new Dependency(x.name, x.version)),
            await fs.readFileBuffer(path.resolve(await api.fs.getwd(), filedata.tarball)),
            filedata.configScript && await fs.readFile(path.resolve(await api.fs.getwd(), filedata.configScript))
        );
        const data = make(pkg);
        api.fd.write(1, 'compressing...\n');
        const compressed = await pako.deflate(data);
        await fs.writeFile(out, compressed);
    }
    if (argv[1] === "tar") {
        const filep = argv[2];
        if (!filep) return api.fd.write(1, 'duckpkg: need file\n');
        if (!await fs.exists(filep)) return api.fd.write(1, "duckpkg: file doesn't exist\n");
        const file_raw = await fs.readFileBuffer(filep)
        const file = await pako.inflate(file_raw);
        try {
            const pkg = read(file);
            api.fd.write(1, pkg.tarball);
        } catch (err) {
            api.fd.write(1, 'duckpkg: ' + (err as string).toString()+'\n');
        }
    }
    if (argv[1] === "install") {
        const filep = argv[2];
        if (!filep) return api.fd.write(1, 'duckpkg: need file\n');
        if (!await fs.exists(filep)) return api.fd.write(1, "duckpkg: file doesn't exist\n");
        api.fd.write(1, "reading file\n");
        const file_raw = await fs.readFileBuffer(filep);
        api.fd.write(1, "inflating\n");
        const file = await pako.inflate(file_raw);
        try {
            api.fd.write(1, "parsing decompressed\n");
            const pkg = read(file);
            api.fd.write(1, "installing: " + pkg.name + " " + pkg.version + "\n");
            let lePromises: Promise<void>[] = [];
            let names: string[] = [];
            await untar(pkg.tarball.buffer)
                .progress((extractedFile: any) => {
                    /*if (extractedFile.name.endsWith('/')) {
                        if (!await fs.exists(extractedFile.name)) {
                            api.fd.write(1, "creating folder: " + extractedFile.name+"\n");
                            //await fs.mkdir("/"+extractedFile.name);
                            const pathSegments = extractedFile.name.split('/');
                            let fpath = [''];
                            for (const seg of pathSegments) {
                                fpath.push(seg);
                                if (!await fs.exists(fpath.join('/'))) await fs.mkdir()
                            }
                            return;
                        }
                        return;
                    }*/
                    if (names.includes(extractedFile.name)) return;
                    names.push(extractedFile.name);
                    lePromises.push((async () => {
                        //console.log(JSON.stringify(extractedFile))
                        //console.log(extractedFile.name, extractedFile.type)
                        const pathSegments = extractedFile.name.split('/').slice(0, -1);
                        let fpath = []
                        for (const seg of pathSegments) {
                            fpath.push(seg);
                            
                            if (!await fs.exists(fpath.join('/'))) {
                                api.fd.write(1, "creating folder: " + fpath.join('/')+"\n");
                                await fs.mkdir(fpath.join('/'));
                            }
                        }
                        if (extractedFile.type === "5") return;
                        if (await fs.exists("/"+extractedFile.name)) return;
                        api.fd.write(1, "creating file: " + extractedFile.name+"\n");
                        //console.log(extractedFile.buffer);
                        await fs.writeFile("/"+extractedFile.name, extractedFile.buffer);
                    })().catch(err => console.error(err, extractedFile.name)))
                })
            await Promise.all(lePromises)
        } catch (err) {
            api.fd.write(1, 'duckpkg: ' + (err as string).toString()+'\n');
            console.error(err);
        }
    }
}