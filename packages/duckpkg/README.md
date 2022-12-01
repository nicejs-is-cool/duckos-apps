# duckpkg
Basically duckOS' version of `dpkg`
### Commands
- `duckpkg install <path>`
Will install the .DKPK file at `<path>`.
- `duckpkg read <path>`
Read .DKPK metadata at `<path>`.
- `duckpkg tar <path>`
Extract tarball from the .DKPK file.
- `duckpkg create <package-json-path> <output-path>`
Creates a .DKPK from a [package.json](#packagejson-format) and tarball.
### package.json format
A `package.json` file should look this:
```json
{
    "name": "name of the package",
    "version": "1.0.0",
    "dependencies": [
        {
            "name": "dependency",
            "version": "1.0.0"
        }
    ],
    "tarball": "./relative/path/to/tarball.tar",
    "configScript": "./this/is/optional.sh"
}
```
**Note:** The specified tarball *MUST* not be compressed if it is, `duckpkg` will vent.  
Oh and, the `version` in the dependencies is optional[^1].
### Implementation status
- [ ] Dependency checks
- [x] Package creator
- [x] Tar extractor
- [x] .dkpk installation
- [x] Metadata reader
- [x] package.json format
### Notes
[^1]: Dependency checks [are not](#implementation-status) implemented yet