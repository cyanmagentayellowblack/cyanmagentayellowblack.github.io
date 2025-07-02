(function() {
function showError(id, msg) {
  var el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 5000);
}
function clearError(id) {
  var el = document.getElementById(id);
  el.textContent = "";
  el.classList.add('hidden');
}
function formatSizeMB(bytes) { return (bytes / (1024 * 1024)).toFixed(4); }
function formatSizeMb(bits) { return (bits / (1024 * 1024)).toFixed(6); }

function arrayBufferToBase64(buffer) {
  var binary = '', bytes = new Uint8Array(buffer);
  for (var i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// ---- ENCODER ----
var currentBase64 = "", currentFileName = "base64.txt", lastEncodedSize = 0;
document.getElementById('fileInput').addEventListener('change', function(e) {
  handleEncodeFiles(e.target.files);
});
document.getElementById('encodeSection').addEventListener('dragover', function(e) {
  e.preventDefault(); this.classList.add('dragover');
});
document.getElementById('encodeSection').addEventListener('dragleave', function(e) {
  e.preventDefault(); this.classList.remove('dragover');
});
document.getElementById('encodeSection').addEventListener('drop', function(e) {
  e.preventDefault(); this.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    document.getElementById('fileInput').files = e.dataTransfer.files;
    handleEncodeFiles(e.dataTransfer.files);
  }
});
function handleEncodeFiles(files) {
  clearError('encodeError');
  if (!files || files.length === 0) return;
  if (files.length === 1) {
    var file = files[0];
    currentFileName = file.name.replace(/\.[^/.]+$/, "") + "_base64.txt";
    var reader = new FileReader();
    reader.onload = function(e) {
      var base64String = arrayBufferToBase64(e.target.result);
      document.getElementById('output').value = base64String;
      currentBase64 = base64String;
      lastEncodedSize = file.size;
      document.getElementById('downloadBtn').disabled = false;
      document.getElementById('copyBtn').disabled = false;
      document.getElementById('encodeInfo').textContent =
        "Original file size: " + formatSizeMB(file.size) + " MB (" + formatSizeMb(file.size * 8) + " Mb)";
      document.getElementById('encodeSizeDetails').textContent =
        file.size + " bytes (" + (file.size * 8) + " bits)";
      document.getElementById('encodeSizeToggle').classList.remove('hidden');
      document.getElementById('encodeSizeDetails').classList.add('hidden');
      document.getElementById('encodeSizeToggle').textContent = "Show bytes/bits";
    };
    reader.onerror = function(){ showError('encodeError', 'Failed to read file.'); };
    reader.readAsArrayBuffer(file);
  } else {
    Array.prototype.forEach.call(files, function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var base64String = arrayBufferToBase64(e.target.result);
        var blob = new Blob([base64String], { type: "text/plain" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace(/\.[^/.]+$/, "") + "_base64.txt";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
      reader.onerror = function(){ showError('encodeError', 'Failed to read file: ' + file.name); };
      reader.readAsArrayBuffer(file);
    });
    document.getElementById('output').value = "";
    document.getElementById('encodeInfo').textContent = "Batch encoding complete. Each file downloaded as Base64.";
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('copyBtn').disabled = true;
  }
}
document.getElementById('downloadBtn').onclick = function() {
  var blob = new Blob([currentBase64], { type: "text/plain" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = currentFileName;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
document.getElementById('copyBtn').onclick = function() {
  navigator.clipboard.writeText(currentBase64);
  alert("Base64 copied to clipboard!");
};
document.getElementById('encodeSizeToggle').onclick = function() {
  var details = document.getElementById('encodeSizeDetails');
  if (details.classList.contains('hidden')) {
    details.classList.remove('hidden'); this.textContent = "Hide bytes/bits";
  } else {
    details.classList.add('hidden'); this.textContent = "Show bytes/bits";
  }
};

// ---- DECODER ----
var lastDecodedBlob = null, lastMimeType = "application/octet-stream", lastBase64String = "", lastFileName = "", lastDecodedSize = 0, mediaShown = false;
function detectMimeType(bytes) {
  if (bytes.length > 3 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return "image/png";
  if (bytes.length > 2 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return "image/jpeg";
  if (bytes.length > 5 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return "image/gif";
  if (bytes.length > 1 && bytes[0] === 0x42 && bytes[1] === 0x4D) return "image/bmp";
  if (bytes.length > 8 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  if (bytes.length > 2 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return "audio/mp3";
  if (bytes.length > 10 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return "video/mp4";
  if (bytes.length > 3 && bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) return "video/webm";
  if (bytes.length > 11 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x41 && bytes[10] === 0x56 && bytes[11] === 0x45) return "audio/wav";
  if (bytes.length > 3 && bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) return "audio/ogg";
  if (bytes.length > 3 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
  return "application/octet-stream";
}
function extensionFromMime(mime) {
  if (mime.startsWith("image/png")) return ".png";
  if (mime.startsWith("image/jpeg")) return ".jpg";
  if (mime.startsWith("image/gif")) return ".gif";
  if (mime.startsWith("image/bmp")) return ".bmp";
  if (mime.startsWith("image/webp")) return ".webp";
  if (mime.startsWith("audio/mp3")) return ".mp3";
  if (mime.startsWith("audio/wav")) return ".wav";
  if (mime.startsWith("audio/ogg")) return ".ogg";
  if (mime.startsWith("video/mp4")) return ".mp4";
  if (mime.startsWith("video/webm")) return ".webm";
  if (mime.startsWith("application/pdf")) return ".pdf";
  return ".bin";
}
function hideAllPreviews() {
  document.getElementById('mediaPreview').style.display = "none";
  document.getElementById('audioPreview').style.display = "none";
  document.getElementById('videoPreview').style.display = "none";
  document.getElementById('pdfPreview').style.display = "none";
  document.getElementById('imageDimensions').textContent = "";
  mediaShown = false;
  document.getElementById('showMediaBtn').textContent = "Show Media";
}
document.getElementById('decodeSection').addEventListener('dragover', function(e) {
  e.preventDefault(); this.classList.add('dragover');
});
document.getElementById('decodeSection').addEventListener('dragleave', function(e) {
  e.preventDefault(); this.classList.remove('dragover');
});
document.getElementById('decodeSection').addEventListener('drop', function(e) {
  e.preventDefault(); this.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    document.getElementById('base64FileInput').files = e.dataTransfer.files;
    handleDecodeFiles(e.dataTransfer.files);
  }
});
document.getElementById('base64FileInput').addEventListener('change', function(e) {
  handleDecodeFiles(e.target.files);
});
function handleDecodeFiles(files) {
  clearError('decodeError');
  if (!files || files.length === 0) return;
  if (files.length === 1) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('base64Input').value = e.target.result.trim();
    };
    reader.onerror = function(){ showError('decodeError', 'Failed to read file.'); };
    reader.readAsText(file);
  } else {
    Array.prototype.forEach.call(files, function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var base64String = e.target.result.trim().replace(/\s+/g, '');
          var binary = atob(base64String);
          var bytes = new Uint8Array(binary.length);
          for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          var mime = detectMimeType(bytes);
          var fileName = file.name.replace(/\.[^/.]+$/, "") + extensionFromMime(mime);
          var blob = new Blob([bytes], { type: mime });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = fileName;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err) { showError('decodeError', "Error decoding file: " + file.name); }
      };
      reader.onerror = function(){ showError('decodeError', "Failed to read file: " + file.name); };
      reader.readAsText(file);
    });
    document.getElementById('base64Input').value = "";
    document.getElementById('decodeInfo').textContent = "Batch decoding complete. Each file downloaded.";
    document.getElementById('showMediaBtn').style.display = "none";
    document.getElementById('downloadDecodedBtn').style.display = "none";
  }
}
document.getElementById('decodeBtn').onclick = function() {
  hideAllPreviews();
  document.getElementById('showMediaBtn').style.display = "none";
  document.getElementById('downloadDecodedBtn').style.display = "none";
  document.getElementById('decodeSizeToggle').classList.add('hidden');
  document.getElementById('decodeSizeDetails').classList.add('hidden');
  clearError('decodeError');
  var base64String = document.getElementById('base64Input').value.trim();
  if (!base64String) { showError('decodeError', "Please paste a raw Base64 string or upload a file."); return; }
  base64String = base64String.replace(/\s+/g, '');
  try {
    var binary = atob(base64String);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    lastDecodedSize = bytes.length;
    var mime = detectMimeType(bytes);
    lastMimeType = mime;
    lastDecodedBlob = new Blob([bytes], { type: mime });
    lastBase64String = base64String;
    lastFileName = "decoded_file" + extensionFromMime(mime);
    document.getElementById('decodeInfo').textContent =
      "Decoded file size: " + formatSizeMB(bytes.length) + " MB (" + formatSizeMb(bytes.length * 8) + " Mb) | File type: " + mime + " | File name: " + lastFileName;
    document.getElementById('decodeSizeDetails').textContent =
      bytes.length + " bytes (" + (bytes.length * 8) + " bits)";
    document.getElementById('decodeSizeToggle').classList.remove('hidden');
    document.getElementById('decodeSizeToggle').textContent = "Show bytes/bits";
    if (mime.startsWith("image/") || mime.startsWith("audio/") || mime.startsWith("video/") || mime === "application/pdf") {
      document.getElementById('showMediaBtn').style.display = "inline-block";
      document.getElementById('showMediaBtn').textContent = "Show Media";
    }
    document.getElementById('downloadDecodedBtn').style.display = "inline-block";
  } catch (e) { showError('decodeError', "Error decoding Base64: " + e.message); }
};
document.getElementById('decodeSizeToggle').onclick = function() {
  var details = document.getElementById('decodeSizeDetails');
  if (details.classList.contains('hidden')) {
    details.classList.remove('hidden'); this.textContent = "Hide bytes/bits";
  } else {
    details.classList.add('hidden'); this.textContent = "Show bytes/bits";
  }
};
document.getElementById('showMediaBtn').onclick = function() {
  if (!mediaShown) {
    if (!lastBase64String || !lastMimeType) return;
    if (lastMimeType.startsWith("image/")) {
      var img = document.getElementById('mediaPreview');
      img.src = "data:" + lastMimeType + ";base64," + lastBase64String;
      img.style.display = "block";
      img.onload = function() {
        document.getElementById('imageDimensions').textContent =
          "Image dimensions: " + img.naturalWidth + " x " + img.naturalHeight + " px";
      };
    } else if (lastMimeType.startsWith("audio/")) {
      var audio = document.getElementById('audioPreview');
      audio.src = "data:" + lastMimeType + ";base64," + lastBase64String;
      audio.style.display = "block";
    } else if (lastMimeType.startsWith("video/")) {
      var video = document.getElementById('videoPreview');
      video.src = "data:" + lastMimeType + ";base64," + lastBase64String;
      video.style.display = "block";
    } else if (lastMimeType === "application/pdf") {
      var pdf = document.getElementById('pdfPreview');
      pdf.src = "data:" + lastMimeType + ";base64," + lastBase64String;
      pdf.style.display = "block";
    }
    mediaShown = true;
    this.textContent = "Hide Media";
  } else {
    hideAllPreviews();
  }
};
document.getElementById('downloadDecodedBtn').onclick = function() {
  if (!lastDecodedBlob || !lastFileName) return;
  var url = URL.createObjectURL(lastDecodedBlob);
  var a = document.createElement('a');
  a.href = url; a.download = lastFileName;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
document.getElementById('pasteBase64Btn').onclick = async function() {
  try {
    var text = await navigator.clipboard.readText();
    document.getElementById('base64Input').value = "";
    document.getElementById('base64Input').value = text;
    autoPreviewOnPaste(text);
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Base64 pasted from clipboard!");
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function(permission) {
          if (permission === "granted") new Notification("Base64 pasted from clipboard!");
          else alert("Base64 pasted from clipboard!");
        });
      } else { alert("Base64 pasted from clipboard!"); }
    } else { alert("Base64 pasted from clipboard!"); }
  } catch (e) { showError('decodeError', "Could not paste from clipboard: " + e.message); }
};
document.getElementById('base64Input').addEventListener('paste', function(e) {
  setTimeout(function() { autoPreviewOnPaste(e.target.value); }, 10);
});
function autoPreviewOnPaste(text) {
  hideAllPreviews();
  document.getElementById('showMediaBtn').style.display = "none";
  document.getElementById('downloadDecodedBtn').style.display = "none";
  document.getElementById('decodeSizeToggle').classList.add('hidden');
  document.getElementById('decodeSizeDetails').classList.add('hidden');
  clearError('decodeError');
  var base64String = text.trim();
  if (!base64String) return;
  base64String = base64String.replace(/\s+/g, '');
  try {
    var binary = atob(base64String);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    var mime = detectMimeType(bytes);
    if (mime.startsWith("image/") || mime.startsWith("audio/") || mime.startsWith("video/") || mime === "application/pdf") {
      lastMimeType = mime;
      lastBase64String = base64String;
      document.getElementById('showMediaBtn').style.display = "inline-block";
      document.getElementById('showMediaBtn').textContent = "Show Media";
    }
  } catch (e) { }
}
})();