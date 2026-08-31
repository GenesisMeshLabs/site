import raw from './build-signature.json';

/**
 * Build attestation emitted by `scripts/sign-build.mjs` as a prebuild step.
 * `keyId` and `publicKey` are present only when the build was actually signed,
 * so the UI must branch on `signed` before claiming anything.
 */
export type BuildSignature = {
  signed: boolean;
  digest: string;
  builtAt: string;
  algorithm: string;
  keyId?: string;
  publicKey?: string;
};

export const buildSignature = raw as BuildSignature;
