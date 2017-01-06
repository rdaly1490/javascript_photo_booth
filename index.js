const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const filterButtons = document.querySelectorAll('.filter-button')
const takePhotoButton = document.querySelector('.take-photo');
let photosTaken = 0;
let currentFilter = 'noFilters';

function takePhoto() {
	// play camera click sound
	snap.currentTime = 0;
	snap.play();

	photosTaken++;
	const base64Photo = canvas.toDataURL('image/jpeg');
	const downloadLink = document.createElement('a');
	downloadLink.href = base64Photo;
	// sets file name on download
	downloadLink.setAttribute('download', `JS_Photobooth_img${photosTaken}`);
	downloadLink.innerHTML = `<img src=${base64Photo} alt="user image ${photosTaken}" />`;
	strip.insertBefore(downloadLink, strip.firstChild);
}

function getVideo() {
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
		.then(localMediaStream => {
			// need to convert localMediaStream into something video player can understand
			video.src = window.URL.createObjectURL(localMediaStream);
			video.play();
		})
		.catch(err => {
			console.error('Error Connecting to Webcam: ', err);
			alert('We need to access your webcam for this to work...duh');
		});
}

function paintToCanvas() {
	// canvas and video el dimensions need to be the same
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;

	// every so often draw the current image to the canvas
	// return interval in case I need to clear it later
	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);

		// take the pixels out
		let pixels = ctx.getImageData(0, 0, width, height);
		
		// mess with their RGB values
		if (currentFilter !== 'noFilters') {
			const currentFilterFn = window[currentFilter];
			pixels = currentFilterFn(pixels);
		}

		// put the updated pixels back
		ctx.putImageData(pixels, 0, 0);
	}, 16);
}

function updateFilterType() {
	currentFilter = this.dataset.filter
}

////////////////// Filters //////////////////
// The values inside redEffect & rgbSplit are random ones I think look good

function redEffect(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 100 // R 
		pixels.data[i + 1] = pixels.data[i + 1] - 50 // G
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // B
		// not gonna mess with alpha, just remmeber thats why += 4
		// pixels.data[i + 3] // A
	}
	return pixels;
}

function rgbSplit(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i - 150] = pixels.data[i + 0] // R 
		pixels.data[i + 200] = pixels.data[i + 1] // G
		pixels.data[i - 150] = pixels.data[i + 2] // B
	}
	return pixels;
}

function greenScreen(pixels) {
	const levels = {};

	document.querySelectorAll('.rgb input').forEach((input) => {
		levels[input.name] = input.value;
	});

	for (i = 0; i < pixels.data.length; i += 4) {
		const red = pixels.data[i + 0];
		const green = pixels.data[i + 1];
		const blue = pixels.data[i + 2];
		const alpha = pixels.data[i + 3];

		if (red >= levels.rmin
		&& green >= levels.gmin
		&& blue >= levels.bmin
		&& red <= levels.rmax
		&& green <= levels.gmax
		&& blue <= levels.bmax) {
			// set 4th pixel (i.e. Alpha) to totally transparent
			pixels.data[i + 3] = 0;
		}
	}
	return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
takePhotoButton.addEventListener('click', takePhoto);
filterButtons.forEach(button => button.addEventListener('click', updateFilterType));

