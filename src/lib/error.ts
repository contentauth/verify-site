// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

export class RemoteManifestError extends Error {
  public response: Response;

  constructor(res: Response) {
    super('Could not fetch remote manifest');
    this.name = this.constructor.name;
    this.response = res;
  }
}

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
