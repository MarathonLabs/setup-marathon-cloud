import { Octokit } from '@octokit/action';

const REPO_OWNER = 'MarathonLabs';
const REPO = 'marathon-cloud-cli';

export function isLatestVersion(version: string): boolean {
  const v = version.toLowerCase();
  return v === 'latest' || v === '*' || v === '';
}

export async function resolveLatestVersion(): Promise<string> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      'GITHUB_TOKEN is not set, unable to resolve the latest version of marathon-cloud'
    );
  }

  const octokit = new Octokit();
  const { data } = await octokit.repos.getLatestRelease({
    owner: REPO_OWNER,
    repo: REPO,
  });
  return data.tag_name;
}

export function releaseArtifactURL(paths: string[]): string {
  return `https://github.com/${REPO_OWNER}/${REPO}/releases/download/${paths.join(
    '/'
  )}`;
}
