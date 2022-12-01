# apiw
Simple API wrapper for duckOS, so I don't have to rewrite half of the codebase because @paperluigis removed a api. 
(Not finished)
## Documentation
- `api.Print(text: string): void`
Print to stdout.
- `api.Environ.Get(name: string): Promise<string>`
Get `name` environment variable.
- `api.Environ.Set(name: string, value: string): Promise<void>`
Set `name` environment variable to `value`.