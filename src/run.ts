import * as core from '@actions/core';
import { getReleaseArtifact, setupArtifact } from './release';
import { validateMajorVersion } from './semver';

const inputNameVersion = 'version';
const inputNameSkipCache = 'skip-cache';

async function main() {
  const version = core.getInput(inputNameVersion);
  const skipCache = core.getInput(inputNameSkipCache) === 'true';
  core.debug(`version: ${version} skip-cache: ${skipCache}`);
  if (validateMajorVersion(version, '1')) {
    const artifact = await getReleaseArtifact(version);
    core.debug(`Resolved artifact: ${JSON.stringify(artifact)}`);

    await setupArtifact(artifact, skipCache);
  } else {
    core.setFailed(
      `Unsupported cli version ${version}. This action supports version ${1}`,
    );
  }
}

try {
  main();
} catch (e) {
  core.setFailed((e as { message: string }).message);
}
