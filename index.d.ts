export function attachMetadataCopyContent(
  htmlText: string,
  copyContent: string
): string

export function getMetadataCopyContent(
  htmlText: string
): string

export function extractMetadataCopyContent(
  htmlText: string
): [string, string] // [pureHtmlText, metadata]

export interface CopyData {
  [format: string]: string | Blob | Promise<Blob>
}

declare function copy(value: string | CopyData): Promise<void>
export default copy
