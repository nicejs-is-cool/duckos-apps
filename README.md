# duckos-apps
A monorepo to host all my newer duckOS applications.
This project is triple-licensed under GPL2.0, MIT and [BrowserFS' license](https://github.com/jvilk/BrowserFS/blob/a96aa2d417995dac7d376987839bc4e95e218e06/LICENSE).
### Packages in this monorepo
- [`@duckos-apps/apiw`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/apiw) (GPL2.0)
- `BrowserFS` ([BrowserFS' license](https://github.com/jvilk/BrowserFS/blob/a96aa2d417995dac7d376987839bc4e95e218e06/LICENSE)) (still figuring out how to build on newer node versions)
- [`@duckos-apps/duckpkg`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/duckpkg) (GPL2.0)
- [`@duckos-apps/fs`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/fs) (GPL2.0)
- `js-untar` (MIT) (again figuring out how to build)
- [`@duckos-apps/mkpkg`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/mkpkg) (GPL2.0)
- [`@duckos-apps/snek`](https://github.com/nicejs-is-cool/duckos-apps/tree/main/packages/snek) (GPL2.0)
### Cloning
```bash
git clone --recursive https://github.com/nicejs-is-cool/duckos-apps.git
```
or
```bash
git clone --recursive git@github.com:nicejs-is-cool/duckos-apps.git
```
### Building
First, of all obligatory
```bash
pnpm install
```
You can build a individual app with:
```bash
npx nx build <PACKAGE-NAME>
```
