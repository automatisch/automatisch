import path from 'path';

const MIME_TO_EXT = {
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/mp4': 'mp4',
  'audio/aac': 'aac',
  'audio/flac': 'flac',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'application/mxf': 'mxf',
};

function normalizeUrl(url) {
  // Google Drive share links → direct download
  const gdriveFileMatch = url.match(
    /drive\.google\.com\/file\/d\/([^/]+)/
  );
  if (gdriveFileMatch) {
    return `https://drive.google.com/uc?export=download&id=${gdriveFileMatch[1]}`;
  }

  const gdriveOpenMatch = url.match(
    /drive\.google\.com\/open\?id=([^&]+)/
  );
  if (gdriveOpenMatch) {
    return `https://drive.google.com/uc?export=download&id=${gdriveOpenMatch[1]}`;
  }

  const gdriveUcIdMatch = url.match(
    /drive\.google\.com\/uc\?.*id=([^&]+)/
  );
  if (gdriveUcIdMatch && !url.includes('export=download')) {
    return `https://drive.google.com/uc?export=download&id=${gdriveUcIdMatch[1]}`;
  }

  // Dropbox: ?dl=0 → ?dl=1
  if (url.includes('dropbox.com/') && url.includes('dl=0')) {
    return url.replace('dl=0', 'dl=1');
  }

  return url;
}

function parseContentDisposition(header) {
  if (!header) return null;
  const match = header.match(/filename\*?=(?:UTF-8''|")?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1].trim()) : null;
}

function extFromMime(mimeType) {
  if (!mimeType) return null;
  const base = mimeType.split(';')[0].trim().toLowerCase();
  return MIME_TO_EXT[base] || null;
}

function fileNameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const base = path.basename(pathname);
    if (base && path.extname(base)) return base;
  } catch {
    // ignore
  }
  return null;
}

function isGoogleDriveUrl(url) {
  return url.includes('drive.google.com/');
}

function extractGdriveConfirmToken(html) {
  // Google Drive shows a virus scan confirmation page for large files
  // The confirm token is in a form action URL or a direct link
  const confirmMatch = html.match(/confirm=([0-9A-Za-z_-]+)/);
  if (confirmMatch) return confirmMatch[1];

  // Also check for the "download anyway" link with uuid token
  const uuidMatch = html.match(/uuid=([0-9A-Za-z_-]+)/);
  if (uuidMatch) return uuidMatch[1];

  return null;
}

const downloadFile = async ($, url) => {
  const directUrl = normalizeUrl(url);

  let response = await $.http.get(directUrl, {
    responseType: 'arraybuffer',
  });

  // Handle Google Drive virus scan confirmation page for large files
  if (isGoogleDriveUrl(directUrl)) {
    const contentType = (response.headers || {})['content-type'] || '';
    if (contentType.includes('text/html')) {
      const html = Buffer.from(response.data).toString('utf-8');
      const confirmToken = extractGdriveConfirmToken(html);
      if (confirmToken) {
        const confirmedUrl = `${directUrl}&confirm=${confirmToken}`;
        response = await $.http.get(confirmedUrl, {
          responseType: 'arraybuffer',
        });
      }
    }
  }

  const buffer = Buffer.from(response.data);
  const headers = response.headers || {};

  const contentType = headers['content-type'] || headers['Content-Type'];
  const contentDisposition =
    headers['content-disposition'] || headers['Content-Disposition'];

  // Determine MIME type
  const rawMime = contentType ? contentType.split(';')[0].trim() : null;
  const mimeType =
    rawMime && rawMime !== 'application/octet-stream' && rawMime !== 'text/html'
      ? rawMime
      : 'application/octet-stream';

  // Determine filename
  const dispositionName = parseContentDisposition(contentDisposition);
  const urlName = fileNameFromUrl(url);
  const ext = extFromMime(mimeType) || (urlName ? path.extname(urlName).slice(1) : 'bin');
  const fileName = dispositionName || urlName || `media.${ext}`;

  return { buffer, mimeType, fileName };
};

export default downloadFile;
