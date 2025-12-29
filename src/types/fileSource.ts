// File source types for different storage backends

export type FileSourceType = 'local' | 'ssh' | 's3' | 'r2' | 'gdocs' | 'turso';

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

export interface GoogleDocsCredentials {
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  folderIds?: string[]; // Array of Google Drive folder IDs to sync
  isAuthenticated: boolean;
}

export interface TursoDBCredentials {
  endpoint: string;
  authToken?: string;
  database?: string;
  enableGoogleDocsSync?: boolean; // If true, Turso DB is used to enable Google Docs sync
}

export interface FileSource {
  id: string;
  name: string;
  type: FileSourceType;
  credentials?: SSHCredentials | S3Credentials | R2Credentials | GoogleDocsCredentials | TursoDBCredentials;
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

export interface GoogleDocsFileSource extends FileSource {
  type: 'gdocs';
  credentials: GoogleDocsCredentials;
}

export interface TursoDBFileSource extends FileSource {
  type: 'turso';
  credentials: TursoDBCredentials;
}

export type AnyFileSource = LocalFileSource | SSHFileSource | S3FileSource | R2FileSource | GoogleDocsFileSource | TursoDBFileSource;
