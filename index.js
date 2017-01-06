const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const takePhotoButton = document.querySelector('#take-photo');

function takePhoto() {
	console.log('click');
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
getVideo();
takePhotoButton.addEventListener('click', takePhoto);