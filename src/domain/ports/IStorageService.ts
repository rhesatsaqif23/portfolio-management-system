export interface IStorageService {
  uploadFile(bucket: string, path: string, file: File | ArrayBuffer): Promise<string>
  deleteFile(bucket: string, path: string): Promise<void>
  getPublicUrl(bucket: string, path: string): string
}
