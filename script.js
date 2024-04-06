let scanMode = false;

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageUrl = event.target.result;
    const img = document.createElement('img');
    img.src = imageUrl;
    document.getElementById('imageContainer').innerHTML = '';
    document.getElementById('imageContainer').appendChild(img);

    document.getElementById('scanButton').disabled = false;

    img.addEventListener('click', function(event) {
      if (scanMode) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        extractColorFromPixel(img, x, y);
      }
    });
  };
  reader.readAsDataURL(file);
});

document.getElementById('scanButton').addEventListener('click', function() {
  scanMode = !scanMode;
  if (scanMode) {
    document.getElementById('scanButton').innerText = 'Stop';
  } else {
    document.getElementById('scanButton').innerText = 'Scan';
  }
});

function extractColorFromPixel(img, x, y) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0, img.width, img.height);

  const pixelData = context.getImageData(x, y, 1, 1).data;
  const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
  document.getElementById("colorsList").innerHTML += `<p style='background-color : ${color}'>colorCode : ${color} </p>`
  copyToClipboard(color);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    Swal.fire({
      icon: 'success',
      title: 'Color copied!',
      showConfirmButton: false,
      timer: 1500
    });
  }, function(err) {
    console.error('Could not copy text: ', err);
  });
}
