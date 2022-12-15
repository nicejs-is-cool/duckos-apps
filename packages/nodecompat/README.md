# nodecompat
Node.js compatibility layer for duckOS.
### Implementation status
| Module        | Implemented |
|---------------|-------------|
| process       | Yes         |
| os            | Yes         |
| buffer        | Yes         |
| events        | Yes         |
| assert        | No          |
| stream        | Untested    |
| fs            | No          |
| child_process | No          |
| crypto        | No          |
| dgram         | No          |
| path          | No          |
| readline      | No          |
| net           | No          |
| console       | No          |
| repl          | No          |

### Usage
You can import node APIs like node's internal modules for example,
```js
import { process } from '@duckos-apps/nodecompat';
```
and in the future (not implemented rn) if don't want to load the entire module you could use:
```js
import { process } from '@duckos-apps/nodecompat/process';
```
(both should be tree-shakeable anyway)
Though the second approach can be useful if you need to use webpack's `ProvidePlugin`