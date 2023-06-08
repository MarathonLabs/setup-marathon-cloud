import * as core from '@actions/core';
import { getReleaseArtifact, setupArtifact } from './release';

const inputNameVersion = 'version';
const inputNameSkipCache = 'skip-cache';

async function main() {
  const version = core.getInput(inputNameVersion);
  const skipCache = core.getInput(inputNameSkipCache) === 'true';
  core.debug(`version: ${version} skip-cache: ${skipCache}`);

  const artifact = await getReleaseArtifact(version);
  core.debug(`Resolved artifact: ${JSON.stringify(artifact)}`);

  await setupArtifact(artifact, skipCache);
}

try {
  main();
} catch (e) {
  core.setFailed((e as { message: string }).message);
}
