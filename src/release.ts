import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import { platform } from 'os';
import path from 'path';
import { releaseArtifactURL } from './gh';
import { sha256File } from './hash';

const TOOL_NAME = 'marathon-cloud';

export type Platform =
  | 'universal-apple-darwin'
  | 'x86_64-unknown-linux-gnu'
  | 'x86_64-unknown-linux-musl'
  | 'aarch64-unknown-linux-gnu'
  | 'aarch64-unknown-linux-musl'
  | 'arm-unknown-linux-gnueabihf'
  | 'arm-unknown-linux-musleabihf'
  | 'i686-unknown-linux-gnu'
  | 'i686-unknown-linux-musl'
  | 'x86_64-pc-windows-gnu'
  | 'x86_64-pc-windows-msvc'
  | 'i686-pc-windows-msvc';

function resolvePlatform(): Platform {
  const platform = process.platform;
  const arch = process.arch;
  if (platform === 'darwin') {
    return 'universal-apple-darwin';
  } else if (platform === 'linux' && arch === 'x64') {
    return 'x86_64-unknown-linux-gnu';
  } else if (platform === 'linux' && arch === 'arm64') {
    return 'aarch64-unknown-linux-gnu';
  } else if (platform === 'win32' && arch === 'x64') {
    return 'x86_64-pc-windows-msvc';
  } else {
    throw new Error(`Unsupported platform: ${platform}_${arch}`);
  }
}

export interface BinaryArtifact {
  // version is the SemVer of the release.
  readonly version: string;
  // platform is the platform of the artifact.
  readonly platform: Platform;
  // artifactName is the name of the artifact.
  readonly artifactName: string;
  // artifactUrl is the URL of the artifact.
  readonly artifactUrl: string;
  // checksumUrl is the SHA256 checksum URL of the artifact.
  readonly checksumUrl: string;
}

// getReleaseArtifact retrieves a release artifact with specified version and platform.
// platform is resolved automatically if not specified.
export function getReleaseArtifact(
  version: string,
  platform?: Platform,
): BinaryArtifact {
  platform = platform || resolvePlatform();
  const extension = resolveExtension(platform);

  const artifactName = `${TOOL_NAME}-v${version}-${platform}.${extension}`;

  return {
    version,
    platform,
    artifactName,
    artifactUrl: releaseArtifactURL([version, artifactName]),
    checksumUrl: releaseArtifactURL([version, `checksums.txt`]),
  };
}

function resolveBinaryPath(artifact: BinaryArtifact, dir: string): string {
  if (artifact.platform.startsWith('win')) {
    return path.join(dir, 'marathon-cloud.exe');
  } else {
    return path.join(dir, 'marathon-cloud');
  }
}

async function verifyChecksum(
  artifactPath: string,
  artifactName: string,
  checksumPath: string,
) {
  const actualChecksum = await sha256File(artifactPath);
  core.debug(
    `calculated sha256 checksum of ${artifactName}: ${actualChecksum}`,
  );

  // format:
  //  {checksum}  {filename}
  const checksumLines = fs
    .readFileSync(checksumPath, 'utf8')
    .toString()
    .split('\n')
    .map((l: string) => l.split(/\s+/));
  const expectedChecksum = checksumLines.find(
    (l) => l[1].trim() === artifactName,
  );
  if (!expectedChecksum) {
    throw new Error(
      `No checksum found for ${artifactName} from ${checksumPath}`,
    );
  }

  if (expectedChecksum[0] !== actualChecksum) {
    throw new Error(
      `Checksum mismatch: expected ${expectedChecksum[0]}, got ${actualChecksum}`,
    );
  }
}

// downloadAndCache downloads the artifact and caches it.
// Returns the path to the cached artifact.
async function downloadAndCache(artifact: BinaryArtifact): Promise<string> {
  const artifactZipball = await tc.downloadTool(artifact.artifactUrl);
  core.debug(`Downloaded ${artifact.artifactUrl} to ${artifactZipball}`);

  const artifactChecksum = await tc.downloadTool(artifact.checksumUrl);
  core.debug(`Downloaded ${artifact.checksumUrl} to ${artifactChecksum}`);

  await verifyChecksum(
    artifactZipball,
    artifact.artifactName,
    artifactChecksum,
  );
  core.debug(`Verified checksum of ${artifactZipball}`);

  const extractedPath = platform.name.startsWith('win')
    ? await tc.extractZip(artifactZipball)
    : await tc.extractTar(artifactZipball);
  core.debug(`Extracted ${artifactZipball} to ${extractedPath}`);
  const archiveName = fs.readdirSync(extractedPath)[0];
  const archivePath = path.join(extractedPath, archiveName);

  const cachedDir = await tc.cacheDir(archivePath, TOOL_NAME, artifact.version);
  const rv = resolveBinaryPath(artifact, cachedDir);
  core.debug(`Cached ${TOOL_NAME} to ${rv}`);

  return rv;
}

// setupArtifact prepares the tool binary and adds it to PATH.
export async function setupArtifact(
  artifact: BinaryArtifact,
  skipCache?: boolean,
) {
  let cachedDir = '';

  if (!skipCache) {
    cachedDir = tc.find(TOOL_NAME, artifact.version);
  }

  let binaryPath: string;

  if (cachedDir) {
    binaryPath = resolveBinaryPath(artifact, cachedDir);
    core.debug(`Found cached ${TOOL_NAME} at ${binaryPath}`);
  } else {
    binaryPath = await downloadAndCache(artifact);
    core.debug(`Downloaded and cached ${TOOL_NAME} to ${binaryPath}`);
  }

  core.addPath(path.dirname(binaryPath));
  core.info(`Added ${binaryPath} to PATH`);
}

function resolveExtension(platform: Platform): string {
  switch (platform) {
    case 'x86_64-pc-windows-gnu':
    case 'x86_64-pc-windows-msvc':
    case 'i686-pc-windows-msvc':
      return 'zip';
    default:
      return 'tar.gz';
  }
}
