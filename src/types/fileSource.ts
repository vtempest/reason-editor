// File source types for different storage backends

export type FileSourceType = 'local' | 'ssh' | 's3' | 'r2';

export interface SSHCredentials {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  basePath?: string;
}

export interface S3Credentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string;
  basePath?: string;
}

export interface R2Credentials {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  basePath?: string;
}

export interface FileSource {
  id: string;
  name: string;
  type: FileSourceType;
  credentials?: SSHCredentials | S3Credentials | R2Credentials;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocalFileSource extends FileSource {
  type: 'local';
  credentials: undefined;
}

export interface SSHFileSource extends FileSource {
  type: 'ssh';
  credentials: SSHCredentials;
}

export interface S3FileSource extends FileSource {
  type: 's3';
  credentials: S3Credentials;
}

export interface R2FileSource extends FileSource {
  type: 'r2';
  credentials: R2Credentials;
}

export type AnyFileSource = LocalFileSource | SSHFileSource | S3FileSource | R2FileSource;
