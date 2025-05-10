let img = new Image();
let imgLoaded = false;
let tileCanvases = [];

document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    img.src = URL.createObjectURL(file);
    img.onload = () => { imgLoaded = true; };
  }
});

document.getElementById('splitBtn').addEventListener('click', function() {
  const rows = parseInt(document.getElementById('rows').value);
  const cols = parseInt(document.getElementById('cols').value);
  const tilesDiv = document.getElementById('tiles');
  tilesDiv.innerHTML = '';
  tileCanvases = [];

  if (!imgLoaded) {
    alert('Please upload an image first!');
    return;
  }

  const tileWidth = Math.floor(img.width / cols);
  const tileHeight = Math.floor(img.height / rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const canvas = document.createElement('canvas');
      canvas.width = tileWidth;
      canvas.height = tileHeight;
      canvas.className = 'tile-canvas';
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        c * tileWidth, r * tileHeight, tileWidth, tileHeight, // source
        0, 0, tileWidth, tileHeight // destination
      );
      tilesDiv.appendChild(canvas);
      tileCanvases.push({canvas, row: r, col: c});
    }
  }

  document.getElementById('downloadZipBtn').disabled = false;
});

document.getElementById('downloadZipBtn').addEventListener('click', function() {
  if (tileCanvases.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('tiles');
  // Collect promises for each tile's blob
  const promises = tileCanvases.map(({canvas, row, col}, idx) => {
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        // Name each file by its row and column
        folder.file(`tile_r${row+1}_c${col+1}.png`, blob);
        resolve();
      }, 'image/png');
    });
  });

  Promise.all(promises).then(() => {
    zip.generateAsync({type: "blob"}).then(function(content) {
      saveAs(content, "image_tiles.zip");
    });
  });
});
