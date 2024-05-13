export const formatFileSize = (size: number): string => {
  const sizeInKB = size / 1024;

  if (sizeInKB < 1024) return `${sizeInKB.toFixed(2)} КБ`;
  else return `${(sizeInKB / 1024).toFixed(2)} МБ`;
};
