const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const takePhotoButton = document.querySelector('#take-photo');
let photosTaken = 0;

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
	}, 16);
}

getVideo();

takePhotoButton.addEventListener('click', takePhoto);
video.addEventListener('canplay', paintToCanvas);