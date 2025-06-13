// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

export const onPreBuild = function ({ netlifyConfig }) {
  const host = process.env.DEPLOY_PRIME_URL;
  netlifyConfig.build.environment.OVERRIDE_MANIFEST_RECOVERY_BASE_URL = `${host}/.netlify/functions/manifest-recovery`;
};
