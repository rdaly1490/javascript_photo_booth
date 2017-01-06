const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const takePhotoButton = document.querySelector('#take-photo');

function takePhoto() {
	console.log('click');
}

takePhotoButton.addEventListener('click', takePhoto);