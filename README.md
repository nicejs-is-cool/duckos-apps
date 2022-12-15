# duckos-apps
A monorepo to host all my newer[^1] duckOS applications.
This project is triple-licensed under GPL2.0, MIT[^2] and [BrowserFS' license](https://github.com/jvilk/BrowserFS/blob/a96aa2d417995dac7d376987839bc4e95e218e06/LICENSE).
### Packages in this monorepo
- [`@duckos-apps/apiw`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/apiw) (GPL2.0)
- `BrowserFS` ([BrowserFS' license](https://github.com/jvilk/BrowserFS/blob/a96aa2d417995dac7d376987839bc4e95e218e06/LICENSE)) (still figuring out how to build on newer node versions)
- [`@duckos-apps/duckpkg`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/duckpkg) (GPL2.0)
- [`@duckos-apps/fs`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/fs) (GPL2.0)
- `js-untar` (MIT) (again figuring out how to build)
- [`@duckos-apps/mkpkg`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/mkpkg) (GPL2.0)
- [`@duckos-apps/snek`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/snek) (GPL2.0)
- [`@duckos-apps/minichalk`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/minichalk) (MIT)
- [`@duckos-apps/nodecompat`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/nodecompat) (GPL2.0)
### Cloning
```bash
git clone --recursive https://github.com/nicejs-is-cool/duckos-apps.git
```
or
```bash
git clone --recursive git@github.com:nicejs-is-cool/duckos-apps.git
```
[^3]
### Building
First, of all obligatory
```bash
pnpm install
```
You can build a individual app with:
```bash
npx nx build <PACKAGE-NAME>
```
[^4] [^5]
### Notes
[^1]: Newer as in excluding [tsh](https://github.com/nicejs-is-cool/tsh) because that one is gonna take a little longer to be added here.
[^2]: Package `js-untar` is licensed under MIT.
[^3]: `--recursive` is not required if you don't want the submodules (`BrowserFS`).
[^4]: You can use `build:prod` if you want to build for production (*assuming the package supports it)
[^5]: Packages may have a additional build script so please check their README too.