import { validateMajorVersion } from "./semver";

test('versionValidation', () => {
  ['1', '1.0.0', '1.2.3'].forEach((v) => {
    expect(validateMajorVersion(v, '1')).toBe(true);
  });

  ['0', '0.1.0', '0.3.3'].forEach((v) => {
    expect(validateMajorVersion(v, '1')).toBe(false);
  });
});
