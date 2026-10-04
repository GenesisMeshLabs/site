/** Public destinations shared by the apex components. */
export const LINKS = {
  docs: 'https://docs.genesismesh.org',
  quickstart: 'https://docs.genesismesh.org/quickstart.html',
  operatorGuide: 'https://docs.genesismesh.org/operators/index.html',
  rfc002: 'https://docs.genesismesh.org/rfcs/rfc-002-recognition-treaties.html',
  hub: 'https://www.genesismesh.org',
  sdks: 'https://www.genesismesh.org/sdks',
  concepts: 'https://www.genesismesh.org/concepts/how-genesis-mesh-works/foundation',
  liveMesh: 'https://mesh.genesismesh.org',
  github: 'https://github.com/GenesisMeshLabs',
  repo: 'https://github.com/GenesisMeshLabs/genesismesh',
} as const;

/** Commands that work from a plain PyPI install (verified on a clean machine). */
export const INSTALL_COMMANDS = 'pip install genesis-mesh\ngenesis-mesh init\ngenesis-mesh na start';
