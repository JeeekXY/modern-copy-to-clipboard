declare function copy(
  value:
    | string
    | {
        [type: string]: string | Blob | Promise<string | Blob>
      },
): Promise<void>

export default copy
