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

		let sx = 20
		let w = 450
		let sh = 100
		let h = 250
		let s = ((p.mouseY / p.height * w-50) - 105)
		let x = ((p.mouseX / p.width * w))

		// Create p5.Vector objects.
		let tomirror = [
			v(sx, sh),
			v(x + (s / 2), sh),
			v(x - (s / 2), sh+h),
			v(sx, sh+h)
		]

		let another = [
			tomirror[1],
			v(x + (s / 2) - 100, sh),
			v(x - (s / 2) - 50, sh+h),
			tomirror[2],
		]

		let fullpage = [
			v(sx, sh),
			v(w, sh),
			v(w, sh+h),
			v(sx, sh+h)
		]


		let v0 = v(tomirror[1].x, tomirror[1].y);
		let v1 = v(tomirror[2].x, tomirror[2].y);

		p.background(255)
		p.fill(255, 0, 0)
		drawQuad(fullpage)

		let slope = (v0.y - v1.y) / (v0.x - v1.x)
		let angle = p.atan(slope)
		let inverse = (1 / slope) * -1

		p.opacity(.8)

		let f = tomirror.reduce((acc, e) => {
			let otherside = reflectPoint(e, [v0,v1])
			p.circle(otherside.x, otherside.y, 5)
			p.circle(e.x, e.y, 5)
			acc.push(otherside)
			return acc
		}, [])
		let f2 = another.reduce((acc, e) => {
			let otherside = reflectPoint(e, [v0,v1])
			p.circle(otherside.x, otherside.y, 5)
			p.circle(e.x, e.y, 5)
			acc.push(otherside)
			return acc
		}, [])

		p.fill(205)
		drawQuad(tomirror)
		p.fill(255, 150, 150)
		let cutf = [
			f[1],
			f2[1],
			f2[2],
			f[2],
		]
		// drawQuad(f)
		drawQuad(cutf)
		p.textSize(35)
		tomirror.map((e, i) => {p.text(i, e.x, e.y)})

		p.fill(255, 250, 150)
		let back = [
			f2[1],
			f[0],
			f[3],
			f2[2],
		]

		// drawQuad(back)
		let f3 = back.reduce((acc, e) => {
			let otherside = reflectPoint(e, [f2[1], f2[2]], -1)
			p.circle(otherside.x, otherside.y, 5)
			p.circle(e.x, e.y, 5)
			acc.push(otherside)
			return acc
		}, [])

		drawQuad(f3)
		f3.map((e, i) => {p.text(i, e.x, e.y)})
	}
}

function reflectPoint(point, mirror, side=1){
	let slope = (mirror[0].y - mirror[1].y) / (mirror[0].x - mirror[1].x)
	// let angle = p.atan(slope)
	let inverse = (1 / slope) * -1
	let beyond = v(point.x + 1, point.y + inverse)
	let pointt = intersect_point(mirror[0], mirror[1], point, beyond)
	let distance = point.dist(pointt)
	let otherside = addtopoint(pointt.x, pointt.y, inverse, distance * side)
	return otherside
}

function addtopoint(x0, y0, m, d, side = 1) {
	// Length of direction vector (1, m)
	let L = p.sqrt(1 + m * m);

	// New point
	let x1 = x0 + (d / L)*side;
	let y1 = y0 + ((m * d) / L)*side;

	return v(x1, y1);
}

function subtractDistanceFromPoint(x, y, m, d) {
  // Normalize direction vector (1, m)
  let len = Math.sqrt(1 + m * m);

  // Unit direction vector
  let ux = 1 / len;
  let uy = m / len;

  // Move *backwards* distance d
  let x2 = x - d * ux;
  let y2 = y - d * uy;

  return v(x2, y2);
}

function intersect_point(point1, point2, point3, point4) {
	const ua = ((point4.x - point3.x) * (point1.y - point3.y) -
		(point4.y - point3.y) * (point1.x - point3.x)) /
		((point4.y - point3.y) * (point2.x - point1.x) -
			(point4.x - point3.x) * (point2.y - point1.y));

	const x = point1.x + ua * (point2.x - point1.x);
	const y = point1.y + ua * (point2.y - point1.y);

	return v(x, y)
}
