/**
 * Fields in a request to get a Signed URL request
 */
export interface CreateSignedURLRequest {
  Bucket: string,
  Key: string,
  Expires: string
}
