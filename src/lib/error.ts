// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

export class CloudManifestError extends Error {
  public response: Response;

  constructor(res: Response) {
    super('Could not get manifests from cloud manifest service');
    this.name = this.constructor.name;
    this.response = res;
  }
}

export class SearchUploadError extends Error {
  public response: Response;

  constructor(res: Response) {
    super(`Got error response from search upload URL (${res.status})`);
    this.name = this.constructor.name;
    this.response = res;
  }
}

export class S3UploadError extends Error {
  public response: Response;

  constructor(res: Response) {
    super(`S3 upload failed (${res.status}`);
    this.name = this.constructor.name;
    this.response = res;
  }
}
