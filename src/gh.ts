const REPO_OWNER = 'MarathonLabs';
const REPO = 'marathon-cloud-cli';

export function releaseArtifactURL(paths: string[]): string {
  return `https://github.com/${REPO_OWNER}/${REPO}/releases/download/${paths.join(
    '/',
  )}`;
}
