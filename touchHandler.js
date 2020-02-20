const INFO		= document.getElementById('touchInfo');
const CANVAS 	= document.getElementById('touchCanvas');
const CONTEXT	= CANVAS.getContext('2d');
const PI2		= Math.PI * 2;
var WIDTH		= document.getElementById('body').offsetWidth;
var HEIGHT		= document.getElementById('body').offsetHeight;
var CENTER_X	= Math.floor(WIDTH  / 2);
var CENTER_Y	= Math.floor(HEIGHT / 2);
var DPR			= window.devicePixelRatio;

document.ontouchstart	= ontouchstart_handler;
document.ontouchend		= ontouchend_handler;
document.ontouchmove	= ontouchmove_handler;
document.ontouchcancel	= ontouchcancel_handler;

function quadrant(cos, sin) {
	if (sin > 0) {
		return Math.acos(cos)
	} else {
		return 2 * Math.PI - Math.acos(cos)
	}
}

function rad_to_deg(value) {
	return value / Math.PI * 180;
}



// CODE FOR TOUCH PURPOSES
var CACHE_TOUCHES = {
	list: new Array(),
	prevTouches: new Array(),
	minDist: 10,
	length: 0,
	center: {x: 0, y: 0},
	add: function(touch) {
		this.list.push(touch);
		this.prevTouches.push(touch);
		this.length += 1;
		if (this.length === 2) {
			this.center = this.getCenter(this.list[0], this.list[1]);
		}
	},
	remove: function(touch) {
		for (let i = 0 ; i < this.length ; i++) {
			if (this.list[i].identifier === touch.identifier) {
				this.list.splice(i,1);
				this.prevTouches.splice(i,1);
				this.length -= 1;
				if (this.length === 2) {
					this.center = this.getCenter(this.list[0], this.list[1]);
				}
				break;
			}
		}
	},
	getCenter: function(touchA, touchB) {
		return {x: Math.floor((touchA.clientX + touchB.clientX) / 2),
			    y: Math.floor((touchA.clientY + touchB.clientY) / 2)}
	},
	swipeDirection: function(curTouch) {
		// Should be called if and only if length === 1
		let center		= this.getCenter(curTouch, this.prevTouches[0]);
		let swipeAngle	= curTouch.angle(center.x, center.y);
		let swipeDist	= curTouch.radius(center.x, center.y) * 2;
		if (swipeDist > this.minDist) {
			this.prevTouches[0] = curTouch;
			return {angle: swipeAngle, dist: swipeDist}
		}
		return null
	}
};

Touch.prototype.radius	= function(centerX, centerY) {
	return Math.hypot(this.clientX - centerX, centerY - this.clientY)
}

Touch.prototype.angle	= function (centerX, centerY) {
	let hypot = this.radius(centerX, centerY);
	if (hypot === 0) {
		return 0
	} else {
		return quadrant((this.clientX - centerX) / hypot, (centerY - this.clientY) / hypot)
	}
}



function ontouchstart_handler(ev) {
	let touchList = ev.changedTouches;
	for (let i = 0 ; i < touchList.length ; i++) {
		CACHE_TOUCHES.add(ev.changedTouches[i])
	}
	// LOG START
	// NB DE TOUCHES
	// IDENTIFIANTS
	// CANVAS DRAW ELLIPSE DE TOUCHE
	showInfo('start', ev, '');
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		drawTouch(ev.changedTouches[i], 'rgba(0,0,255,0.8)')
	}
}
function ontouchend_handler(ev) {
	let touchList = ev.changedTouches;
	for (let i = 0 ; i < touchList.length ; i++) {
		CACHE_TOUCHES.remove(touchList[i]);
	}
	// LOG END
	showInfo('end', ev, '');
	for (let i = 0 ; i < ev.changedTouches.length ; i++) {
		drawTouch(ev.changedTouches[i], 'rgba(255,0,0,0.8)')
	}
}
function ontouchmove_handler(ev) {
	// SINGLE TOUCH (ie SWIPE)
	if (CACHE_TOUCHES.length === 1) {
		let touch	= ev.changedTouches[0];
		let swipe	= CACHE_TOUCHES.swipeDirection(touch);
		if (swipe !== null) {
			let text	= 'Swipe angle: ' + rad_to_deg(swipe.angle) + '° - value: ' + swipe.dist;
			showInfo('move', ev, text);
		}
	}
	// DOUBLE TOUCH
	if (CACHE_TOUCHES.length === 2) {
		// ATTENTION ON PEUT AVOIR UN SEUL CHANGEDTOUCHES ONMOVE MAIS PLUSIEURS ONSTART
		console.log('soon');
		showInfo('move', ev, 'ROTATE OR ZOOM ATM')
		
		// ROTATE
		
		// ZOOM INOUT (angle touchA + 180 ~ angle touchB && touchA_ini ~ touchA_fin)
	}
	
	// LOG MOVE
	// NB DE TOUCHES
	// IDENTIFIANTS
	// SI DEUX TOUCHES: DISTANCE ENTRE EUX EN PIXELS, COEFFICIENT DIRECTEUR
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

function showInfo(handler, ev, textAdd) {
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
		text += 'id: ' + touch.identifier + ' | ' + touch.clientX + ' ; ' + touch.clientY + '<br>' +
				'distance: ' + touch.radius(CENTER_X, CENTER_Y) + '<br>' +
				'angle: ' + rad_to_deg(touch.angle(CENTER_X, CENTER_Y)) + '<br>'
	}
	if (ev.changedTouches.length === 2) {
		let touchA = ev.changedTouches[0];
		let touchB = ev.changedTouches[1];
		let distance = Math.hypot(touchB.clientX - touchA.clientX, touchB.clientY - touchA.clientY);
		let directorCoeff = (touchA.clientY - touchB.clientY) / (touchA.clientX - touchB.clientX);
		text += 'distance: ' + distance + 'px' + ' | coeff: ' + directorCoeff + '<br>';
		
	}
	pDOM.innerHTML = text + textAdd;
}

function drawTouch(touch, color) {
	CONTEXT.fillStyle   = color;
	CONTEXT.strokeStyle = 'rgba(0,0,0,0.3)';
	CONTEXT.beginPath();
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
		CANVAS.width = WIDTH * DPR;
		CANVAS.height = HEIGHT * DPR;
		CONTEXT.scale(DPR, DPR);
	}
	
	draw_circle(50,50,20,'rgba(255,255,0,0.3)');
	draw_circle(100,50,10,'rgba(0,255,255,0.3)');
	draw_circle(50,100,5,'rgba(255,0,255,0.3)');
}

// ONLOAD EVENT
window.onload = function() {
	// CANVAS resized & HUD set
	resize();
	window.addEventListener('resize', function() {resize();}, false);
}

// ON CONSERVE UNIQUEMENT .changedTouches (pas .touches ni .targetTouches) car seul élément conservé par chaque event.
// ON CONSERVE UNIQUEMENT .clientX .clientY.

function draw_circle(x,y,r, color) {
	CONTEXT.beginPath();
	CONTEXT.arc(x, y, r, 0, PI2)
	CONTEXT.fillStyle = color;
	CONTEXT.fill();
	CONTEXT.closePath()
	
	CONTEXT.font = '12px Arial';
	CONTEXT.fillStyle = 'rgba(0,0,0,1)';
	CONTEXT.textBaseline = 'middle';
	CONTEXT.textAlign = 'center';
	CONTEXT.fillText(r + 'px', x, y);
}
