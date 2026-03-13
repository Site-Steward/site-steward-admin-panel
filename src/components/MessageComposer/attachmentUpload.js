export async function uploadSelectedFiles({
  files,
  api,
  onAttachmentQueued,
  onProgress,
  onUploaded,
  onError,
}) {
  for (const file of files) {
    const localId = crypto.randomUUID();

    onAttachmentQueued({
      localId,
      filename: file.name,
      progress: 0,
      status: "uploading",
    });

    try {
      const { asset_id: assetId, signed_put_url: signedPutUrl } = await api.createAsset({
        filename: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
      });

      await uploadFileWithProgress({
        file,
        signedPutUrl,
        onProgress: (progress) => onProgress(localId, progress),
      });

      await api.completeAsset(assetId);
      onUploaded(localId, assetId);
    } catch {
      onError(localId);
    }
  }
}

function uploadFileWithProgress({ file, signedPutUrl, onProgress }) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      const percentComplete = Math.round((event.loaded / event.total) * 100);
      onProgress(percentComplete);
    });

    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }

      reject(new Error(`Upload failed with status ${request.status}`));
    });

    request.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    request.open("PUT", signedPutUrl);

    if (file.type) {
      request.setRequestHeader("Content-Type", file.type);
    }

    request.send(file);
  });
}