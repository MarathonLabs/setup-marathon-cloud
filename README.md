# MarathonLabs/setup-marathon-cloud

This action helps you to setup [marathon-cloud][] in your GitHub Actions workflow.

## Action Inputs

|          Name           | Description                                                                                                                             | Default  | Example |
| :---------------------: | --------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
|  `version` (required)   | The version of to use. Please see the following section [marathon-cloud version](#marathon-cloud-version) for details.                  |          | `1.0.0` |
| `skip-cache` (optional) | Skip discovering the marathon-cloud from cache. By setting this to true will force to download the marathon-cloud from GitHub releases. | `false`  | `true`  |

## Usage Examples

### Basic

```yaml
- uses: MarathonLabs/setup-marathon-cloud@2
  with:
    version: "1.0.0"
```

### Skip Cache

> **NOTE**
> This option is designed for testing purpose.

```yaml
- uses: MarathonLabs/setup-marathon-cloud@2
  with:
    version: "1.0.0"
    skip-cache: "true"
```

## marathon-cloud version


Support matrix:
| action version  |  cli version supported | `latest` version |
|---------------- | ---------------------- | ---------------- |
|       v2        | 1.0.0..2.0.0           | not supported    |
|       v1        | <1.0.0                 | 0.3.11           |

Action version `2` supports cli version with major version `1`;
Action version `1` supports cli versions up to 0.3.11. Any version starting with 1.0.0 will be incompatible.

You can find the full list of available versions at [marathon-cloud releases][].

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
