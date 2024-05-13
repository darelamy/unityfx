export const getFileExt = (fileName: string): string => {
  const extIndex = fileName.lastIndexOf(".");

  return fileName.substring(extIndex + 1);
};
