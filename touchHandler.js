const INFO		= document.getElementById('touchInfo');
const CANVAS 	= document.getElementById('touchCanvas');
const CONTEXT	= CANVAS.getContext('2d');
const PI2		= Math.PI * 2;
var WIDTH = document.getElementById('body').offsetWidth;
var HEIGHT = document.getElementById('body').offsetHeight;
//
//class TouchHandler {
//	// CONSTRUCTOR
//	constructor() {
//		this.cache = new Array();
//	}
//	
//	// GETTERS
//	
//	// METHODS
//	add(touch) {
//		for (let i = 0 ; i < this.cache.length ; i++) {
//			if (this.cache[i].identifier === touch.identifier)
//		}
//	}
//	
//	// STATIC METHODS
//}



document.ontouchstart	= ontouchstart_handler;
document.ontouchend		= ontouchend_handler;
document.ontouchmove	= ontouchmove_handler;
document.ontouchcancel	= ontouchcancel_handler;

function ontouchstart_handler(ev) {
	// LOG START
	// NB DE TOUCHES
	// IDENTIFIANTS
	// CANVAS DRAW ELLIPSE DE TOUCHE
	for (let i = 0 ; i < ev.touches.length ; i++) {
		showInfo('start', ev.touches[i], '.touches');
	}
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		showInfo('start', ev.changedTouches[i], '.changedTouches');
		drawTouch(ev.changedTouches[i], 'rgba(0,0,255,0.8)')
	}
	for (let i = 0 ; i < ev.targetTouches.length ; i++) {
		showInfo('start', ev.targetTouches[i], '.targetTouches');
	}
}
function ontouchend_handler(ev) {
	// LOG END
	for (let i = 0 ; i < ev.touches.length ; i++) {
		showInfo('end', ev.touches[i], '.touches');
	}
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		showInfo('end', ev.changedTouches[i], '.changedTouches');
		drawTouch(ev.changedTouches[i], 'rgba(255,0,0,0.8)')
	}
	for (let i = 0 ; i < ev.targetTouches.length ; i++) {
		showInfo('end', ev.targetTouches[i], '.targetTouches');
	}
}
function ontouchmove_handler(ev) {
	// LOG MOVE
	// NB DE TOUCHES
	// IDENTIFIANTS
	// SI DEUX TOUCHES: DISTANCE ENTRE EUX EN PIXELS, COEFFICIENT DIRECTEUR
	for (let i = 0 ; i < ev.touches.length ; i++) {
		showInfo('move', ev.touches[i], '.touches');
	}
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		showInfo('move', ev.changedTouches[i], '.changedTouches');
		drawTouch(ev.changedTouches[i], 'rgba(0,255,0,0.1)')
	}
	for (let i = 0 ; i < ev.targetTouches.length ; i++) {
		showInfo('move', ev.targetTouches[i], '.targetTouches');
	}
}
function ontouchcancel_handler(ev) {
	// LOG CANCEL
	for (let i = 0 ; i < ev.touches.length ; i++) {
		showInfo('cancel', ev.touches[i], '.touches');
	}
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		showInfo('cancel', ev.changedTouches[i], '.changedTouches');
		drawTouch(ev.changedTouches[i], 'rgba(255,255,0,0.3)')
	}
	for (let i = 0 ; i < ev.targetTouches.length ; i++) {
		showInfo('cancel', ev.targetTouches[i], '.targetTouches');
	}
}

function showInfo(handler, touch, type) {
	// Get touchDOM
	let id = 'touch-' + handler + touch.identifier;
	let touchDOM   = document.getElementById(id);
	if (touchDOM === null) {
		touchDOM	= document.createElement('div');
		touchDOM.id	= id;
		document.getElementById(handler).appendChild(touchDOM);
	}
	
	// InnerHTML info
	let pDOM = touchDOM.getElementsByClassName(type);
	if (pDOM.length !== 0) {
		pDOM[0].remove();
	}
	pDOM = document.createElement('p');
	pDOM.setAttribute('class', type);
	touchDOM.appendChild(pDOM);

	pDOM.innerHTML = 	'id: ' + touch.identifier + ' - ' + type + '<br>' +
						'screen: ' + touch.screenX + ' ; ' + touch.screenY + '<br>' +
						'client: ' + touch.clientX + ' ; ' + touch.clientY + '<br>' +
						'radius: ' + touch.radiusX + ' ; ' + touch.radiusY + ' - rotation: ' + touch.rotationAngle + ' - force: ' + touch.force;
}

function drawTouch(touch, color) {
	CONTEXT.fillStyle   = color;
	CONTEXT.strokeStyle = 'rgba(0,0,0,0.3)';
	CONTEXT.beginPath();
	console.log(touch.clientX + ' ; ' + touch.clientY)
	CONTEXT.ellipse(touch.clientX, touch.clientY, touch.radiusX, touch.radiusY, touch.rotationAngle, 0, PI2);
	CONTEXT.stroke();
	CONTEXT.fill();
}

// Resize function
function resize() {
	WIDTH = document.getElementById('body').offsetWidth;
	HEIGHT = document.getElementById('body').offsetHeight;
	resizeCanvas(CANVAS);

	function resizeCanvas(canvas) {
		CANVAS.width = WIDTH;
		CANVAS.height = HEIGHT;
	}
}

// ONLOAD EVENT
window.onload = function() {
	// CANVAS resized & HUD set
	resize();
	window.addEventListener('resize', function() {resize();}, false);
}