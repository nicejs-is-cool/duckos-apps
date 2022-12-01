// Node CLI for making packages (because copying all the shit over to duckOS is way too painful)
import * as fs from 'fs/promises';
import { make, Package, Package_JSON, Dependency_JSON, Dependency } from '@duckos-apps/duckpkg/file';
import { deflate } from 'pako';

const argv = process.argv.slice(2);
(async () => {
    const duck: Package_JSON = JSON.parse(await fs.readFile(argv[0], "utf-8"));
    const pkg = new Package(
        duck.name, duck.version,
        duck.dependencies.map(a => new Dependency(a.name, a.version)),
        await fs.readFile(duck.tarball),
        duck.configScript && await fs.readFile(duck.configScript, "utf-8")
    );
    const data = make(pkg);
    const compressed = await deflate(data);
    await fs.writeFile(argv[1] || "./out.dkpk", compressed);
})()