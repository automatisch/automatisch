import * as React from 'react';
import slugify from 'slugify';

export default function useDownloadJsonAsFile() {
  const handleDownloadJsonAsFile = React.useCallback(
    function handleDownloadJsonAsFile({ contents, name }) {
      const stringifiedContents = JSON.stringify(contents, null, 2);

      const slugifiedName = slugify(name, {
        lower: true,
        strict: true,
        replacement: '-',
      });

      const fileBlob = new window.Blob([stringifiedContents], {
        type: 'application/json',
      });

      const fileObjectUrl = window.URL.createObjectURL(fileBlob);

      const temporaryDownloadLink = document.createElement('a');
      temporaryDownloadLink.href = fileObjectUrl;
      temporaryDownloadLink.download = slugifiedName;

      temporaryDownloadLink.click();
    },
    [],
  );

  return handleDownloadJsonAsFile;
}
