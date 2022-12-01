# duckos-apps
A monorepo to host all my newer duckOS applications.
This project is triple-licensed under GPL2.0, MIT and BrowserFS' license.
### Packages in this monorepo
- `@duckos-apps/apiw` (GPL2.0)
- `BrowserFS` (BrowserFS' license) (still figuring out how to build on newer node versions)
- `@duckos-apps/duckpkg` (GPL2.0)
- `@duckos-apps/fs` (GPL2.0)
- `js-untar` (MIT) (again figuring out how to build)
- `@duckos-apps/mkpkg` (GPL2.0)
- `@duckos-apps/snek` (GPL2.0)
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
