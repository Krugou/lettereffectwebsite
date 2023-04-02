const video = document.createElement('video');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
    })
    .catch((error) => {
        console.error('Error accessing webcam:', error);
    });

function render() {
    // Capture the current frame from the webcam
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the pixel data for the current frame
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Loop through the pixels and create the matrix effect
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;
        const character = String.fromCharCode(0x2581 + Math.floor(brightness / 16));
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillText(character, (i / 4) % canvas.width, Math.floor(i / (4 * canvas.width)) * 16);
    }

    // Call the render function again on the next frame
    requestAnimationFrame(render);
}

// Start the render loop
requestAnimationFrame(render);