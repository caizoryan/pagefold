import { Q5 as p5 } from "./lib/q5/q5.js"
// import { reactive, memo } from './hok.js'
// import { dom } from './dom.js'


let el = document.querySelector(".q5")
let p = new p5('instance', el);
let mapfn = fn => arr => arr.map(fn)
p.setup = () => {
	p.createCanvas(600, 600)
}

let oninit = []
setTimeout(() => oninit.forEach(fn => fn()), 50)
oninit.push(() => { render() })

let v = (x, y) => p.createVector(x, y)

let vdup = v => p.createVector(v.x, v.y)


function drawQuad(vectors) {
	p.stroke(1)
	p.strokeWeight(1)
	p.quad(
		...vectors.reduce((acc, e) => acc.concat([e.x, e.y]), [])
	)
}

let drawPoint = (v) => p.point(v.x, v.y)
let drawCircle = (v, r) => p.circle(v.x, v.y, r)
p.angleMode('degrees')

function render() {
	p.draw = () => {
		p.angleMode('degrees');
		let s = ((p.mouseY / p.height * 200) - 105)
		let x = ((p.mouseX / p.width * 150))

		// Create p5.Vector objects.
		let tomirror = [v(0, 0),
		v(x + (s / 2), 0),
		v(x - (s / 2), 100),
		v(0, 100)]

		let fullpage = [v(0, 0),
		v(200, 0),
		v(200, 100),
		v(0, 100)]


		let v0 = v(tomirror[1].x, tomirror[1].y);
		let v1 = v(tomirror[2].x, tomirror[2].y);

		p.background(255)
		p.push()
		p.translate(70, 150)
		p.fill(255, 0, 0)
		drawQuad(fullpage)

		// draw line
		p.line(v0.x, v0.y, v1.x, v1.y)
		// circle(v0.x, v0.y, 10)
		// circle(v1.x, v1.y, 10)


		let midpoint = v((v1.x + v0.x) / 2, (v1.y + v0.y) / 2)
		// circle(midpoint.x, midpoint.y, 10)
		let slope = (v0.y - v1.y) / (v0.x - v1.x)
		let angle = p.atan(slope)
		p.text(angle * -1, 15, 350)
		let inverse = (1 / slope) * -1

		// draw a line with a slope inverse of slop
		// and y intercept of.... middle


		p.opacity(.8)
		let f = tomirror.reduce((acc, e) => {
			let otherside = reflectPoint(e, [v0,v1], inverse)
			// p.circle(otherside.x, otherside.y, 15)
			// p.circle(e.x, e.y, 5)
			acc.push(otherside)
			return acc
		}, [])
		p.fill(205)
		drawQuad(tomirror)
		p.fill(255, 150, 150)
		drawQuad(f)

		// line(midpoint.x, midpoint.y, midpoint.x+150, midpoint.y+(150*inverse))



		p.pop()

	}
}

function reflectPoint(point, mirror, inverse){
	let beyond = v(point.x + 1, point.y + inverse)
	let pointt = intersect_point(mirror[0], mirror[1], point, beyond)
	let distance = point.dist(pointt)
	let otherside = addtopoint(pointt.x, pointt.y, inverse, distance)
	return otherside
}
function drawArrow(base, vec, myColor, rot = 0, x = 0) {
	p.push();
	p.stroke(myColor);
	p.strokeWeight(1);
	p.translate(base.x, base.y);
	p.translate(x, 0);
	p.rotate(rot);
	p.line(0, 0, vec.x, vec.y);
	// let arrowSize = 7;
	// p.translate(vec.mag() - arrowSize, 0);
	// p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	p.pop();
}
function drawTransQuad(base, quad, myColor, rot = 0, x = 0) {
	p.push();
	p.stroke(myColor);
	p.strokeWeight(1);
	p.translate(base.x, 0);
	p.translate(x, base.y);
	p.rotate(rot);
	drawQuad(quad)
	p.pop();
}

function addtopoint(x0, y0, m, d) {
	// Length of direction vector (1, m)
	let L = p.sqrt(1 + m * m);

	// New point
	let x1 = x0 + d / L;
	let y1 = y0 + (m * d) / L;

	return v(x1, y1);
}

// function drawQuad(vectors) {
// 	stroke(1)
// 	strokeWeight(1)
// 	quad(
// 		...vectors.reduce((acc, e) => acc.concat([e.x, e.y]), [])
// 	)
// }


function intersect_point(point1, point2, point3, point4) {
	const ua = ((point4.x - point3.x) * (point1.y - point3.y) -
		(point4.y - point3.y) * (point1.x - point3.x)) /
		((point4.y - point3.y) * (point2.x - point1.x) -
			(point4.x - point3.x) * (point2.y - point1.y));

	const ub = ((point2.x - point1.x) * (point1.y - point3.y) -
		(point2.y - point1.y) * (point1.x - point3.x)) /
		((point4.y - point3.y) * (point2.x - point1.x) -
			(point4.x - point3.x) * (point2.y - point1.y));

	const x = point1.x + ua * (point2.x - point1.x);
	const y = point1.y + ua * (point2.y - point1.y);

	return v(x, y)
}
