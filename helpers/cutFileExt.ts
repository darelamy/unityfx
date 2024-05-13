export const cutFileExt = (fileName: string): string => {
  const extIndex = fileName.lastIndexOf(".");

  return fileName.substring(0, extIndex);
};
