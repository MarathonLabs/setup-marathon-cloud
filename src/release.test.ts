import { getReleaseArtifact } from './release';

test('getReleaseArtifact', () => {
  expect(
    getReleaseArtifact('1.0.0', 'universal-apple-darwin').artifactUrl,
  ).toBe(
    'https://github.com/MarathonLabs/marathon-cloud-cli/releases/download/1.0.0/marathon-cloud-v1.0.0-universal-apple-darwin.tar.gz',
  );
  expect(
    getReleaseArtifact('1.0.0', 'x86_64-unknown-linux-gnu').artifactUrl,
  ).toBe(
    'https://github.com/MarathonLabs/marathon-cloud-cli/releases/download/1.0.0/marathon-cloud-v1.0.0-x86_64-unknown-linux-gnu.tar.gz',
  );
  expect(
    getReleaseArtifact('1.0.0', 'aarch64-unknown-linux-gnu').artifactUrl,
  ).toBe(
    'https://github.com/MarathonLabs/marathon-cloud-cli/releases/download/1.0.0/marathon-cloud-v1.0.0-aarch64-unknown-linux-gnu.tar.gz',
  );
  expect(
    getReleaseArtifact('1.0.0', 'x86_64-pc-windows-msvc').artifactUrl,
  ).toBe(
    'https://github.com/MarathonLabs/marathon-cloud-cli/releases/download/1.0.0/marathon-cloud-v1.0.0-x86_64-pc-windows-msvc.zip',
  );
});
