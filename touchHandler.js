const INFO		= document.getElementById('touchInfo');
const CANVAS 	= document.getElementById('touchCanvas');
const CONTEXT	= CANVAS.getContext('2d');
const PI2		= Math.PI * 2;
var WIDTH = document.getElementById('body').offsetWidth;
var HEIGHT = document.getElementById('body').offsetHeight;

document.ontouchstart	= ontouchstart_handler;
document.ontouchend		= ontouchend_handler;
document.ontouchmove	= ontouchmove_handler;
document.ontouchcancel	= ontouchcancel_handler;

function ontouchstart_handler(ev) {
	// LOG START
	// NB DE TOUCHES
	// IDENTIFIANTS
	// CANVAS DRAW ELLIPSE DE TOUCHE
	showInfo('start', ev);
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		drawTouch(ev.changedTouches[i], 'rgba(0,0,255,0.8)')
	}
}
function ontouchend_handler(ev) {
	// LOG END
	showInfo('end', ev);
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		drawTouch(ev.changedTouches[i], 'rgba(255,0,0,0.8)')
	}
}
function ontouchmove_handler(ev) {
	// LOG MOVE
	// NB DE TOUCHES
	// IDENTIFIANTS
	// SI DEUX TOUCHES: DISTANCE ENTRE EUX EN PIXELS, COEFFICIENT DIRECTEUR
	showInfo('move', ev);
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		drawTouch(ev.changedTouches[i], 'rgba(0,255,0,0.1)')
	}
}
function ontouchcancel_handler(ev) {
	// LOG CANCEL
	showInfo('cancel', ev);
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		drawTouch(ev.changedTouches[i], 'rgba(255,255,0,0.8)')
	}
}

function showInfo(handler, ev) {
	// Get touchDOM
	let id = 'touch-' + handler;
	let touchDOM   = document.getElementById(id);
	if (touchDOM === null) {
		touchDOM	= document.createElement('div');
		touchDOM.id	= id;
		document.getElementById(handler).appendChild(touchDOM);
	}
	
	// InnerHTML info
	let pDOM = touchDOM.childNodes;
	if (pDOM.length !== 0) {
		pDOM[0].remove();
	}
	pDOM = document.createElement('p');
	touchDOM.appendChild(pDOM);
	
	let text = '';
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		let touch = ev.changedTouches[i];
		text += 'id: ' + touch.identifier + ' | ' + touch.clientX + ' ; ' + touch.clientY + '<br>'
	}
	if (ev.changedTouches.length === 2) {
		let touchA = ev.changedTouches[0];
		let touchB = ev.changedTouches[1];
		let distance = Math.hypot(touchB.clientX - touchA.clientX, touchB.clientY - touchA.clientY);
		let directorCoeff = (touchA.clientY - touchB.clientY) / (touchA.clientX - touchB.clientX);
		text += 'distance: ' + distance + 'px' + ' | coeff: ' + directorCoeff;
		
	}
	pDOM.innerHTML = text;
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

// ON CONSERVE UNIQUEMENT .changedTouches (pas .touches ni .targetTouches) car seul élément conservé par chaque event.
// ON CONSERVE UNIQUEMENT .clientX .clientY.