export function validateMajorVersion(versionString: string, supported: string): boolean {
  const majorVersion = versionString.split('.')[0];
  return majorVersion === supported;
}
