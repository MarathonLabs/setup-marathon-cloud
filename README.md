# MarathonLabs/setup-marathon-cloud

This action helps you to setup [marathon-cloud][] in your GitHub Actions workflow.

## Action Inputs

|          Name           | Description                                                                                                                             | Default  | Example |
| :---------------------: | --------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
|  `version` (optional)   | The version of to use. Please see the following section [marathon-cloud version](#marathon-cloud-version) for details.                  | `latest` | `0.3.11` |
| `skip-cache` (optional) | Skip discovering the marathon-cloud from cache. By setting this to true will force to download the marathon-cloud from GitHub releases. | `false`  | `true`  |

## Usage Examples

### Basic

```yaml
- uses: MarathonLabs/setup-marathon-cloud@1.0.0
  with:
    version: "0.3.11"
```

### Use Latest Version

> **NOTE**
> We recommend to use a specific version of marathon-cloud to have consistent behavior.
> If you choose to use latest with v1 action then it will use latest supported version for v1 which is 0.3.11

```yaml
- uses: MarathonLabs/setup-marathon-cloud@1.0.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    version: "latest"
```

### Skip Cache

> **NOTE**
> This option is designed for testing purpose.

```yaml
- uses: MarathonLabs/setup-marathon-cloud@1.0.0
  with:
    version: "0.3.11"
    skip-cache: "true"
```

## marathon-cloud version

If the `version` is not set, or is one of `latest` or `*`, the action will try to use the latest version of marathon-cloud.
For `v1` action the latest supported version is 0.3.11. Any version starting with 1.0.0 will be incompatible.

Support matrix:
| action version  |  cli version supported | `latest` version |
|---------------- | ---------------------- | ---------------- |
|       v2        | 1.0.0..2.0.0           | not supported    |
|       v1        | <1.0.0                 | 0.3.11           |


However, due to the GitHub API rate limiting settings, this action requires to pass in the `GITHUB_TOKEN` to the environment variable. If this environment variable is not set, one will see error similar to the following:

```
Run MarathonLabs/setup-marathon-cloud@{version}
/home/runner/work/_actions/MarathonLabs/setup-marathon-cloud/{version}/lib/index.js:14812
            throw new Error('GITHUB_TOKEN is not set, unable to resolve the latest version of marathon-cloud');
```

> **NOTE**
> To ensure consistent behavior, it is recommended to specify the version of marathon-cloud to use. We can find the full list of available versions at [marathon-cloud releases][].

[marathon-cloud]: https://github.com/MarathonLabs/marathon-cloud-cli
[marathon-cloud releases]: https://github.com/MarathonLabs/marathon-cloud-cli/releases

### Developing

The action source is located at [/src](/src). The action is written in TypeScript and compiled to a single javascript file with [`ncc`][ncc]. It's expected to checkin `lib/index.js` to the repository.

To setup the development environment, run the following commands:

```bash
$ npm install
```

To build the action script, run the following command:

```bash
$ npm run build
```

To test the action, we can use the workflow [Test workflow](https://github.com/MarathonLabs/setup-marathon-cloud/actions/workflows/test-marathon-cloud.yaml) to trigger a build.

[ncc]: https://github.com/vercel/ncc

## LICENSE

MIT
