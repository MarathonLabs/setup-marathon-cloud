import * as core from '@actions/core';
const REPO_OWNER = 'MarathonLabs';
const REPO = 'marathon-cloud-cli';

export function isLatestVersion(version: string): boolean {
  const v = version.toLowerCase();
  return v === 'latest' || v === '*' || v === '';
}

export async function resolveLatestVersion(): Promise<string> {
  core.warning(
    `setup-marathon-cloud@v1 supports marathon-cloud cli up to 0.3.X. To use marathon-cloud cli v1+ use setup-marathon-cloud@v2`
  );
  return "0.3.11"
}

export function releaseArtifactURL(paths: string[]): string {
  return `https://github.com/${REPO_OWNER}/${REPO}/releases/download/${paths.join(
    '/'
  )}`;
}
