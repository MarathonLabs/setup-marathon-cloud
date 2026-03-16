import { debug, getInput, setFailed } from '@actions/core';
import { getReleaseArtifact, setupArtifact } from './release';
import { validateMajorVersion } from './semver';

const inputNameVersion = 'version';
const inputNameSkipCache = 'skip-cache';

async function main() {
  const version = getInput(inputNameVersion);
  const skipCache = getInput(inputNameSkipCache) === 'true';
  debug(`version: ${version} skip-cache: ${skipCache}`);
  if (validateMajorVersion(version, '1')) {
    const artifact = getReleaseArtifact(version);
    debug(`Resolved artifact: ${JSON.stringify(artifact)}`);

    await setupArtifact(artifact, skipCache);
  } else {
    setFailed(
      `Unsupported cli version ${version}. This action supports version ${1}`,
    );
  }
}

try {
  main();
} catch (e) {
  setFailed((e as { message: string }).message);
}
