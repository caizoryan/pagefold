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
function drawLine(vectors) {
	p.stroke(1)
	p.strokeWeight(1)
	p.line(
		...vectors.reduce((acc, e) => acc.concat([e.x, e.y]), [])
	)
}

let drawPoint = (v) => p.point(v.x, v.y)
let drawCircle = (v, r) => p.circle(v.x, v.y, r)
p.angleMode('degrees')

function render() {
	p.draw = () => {
		p.angleMode('degrees');

		let nx = 150
		let ny = 150
		let nw = 100
		let nh = 400
		let noff = ((p.mouseY / p.height * nh-50) - 105)

		let tomirror = [
			v(nx, ny),
			v(nx + nw , ny),
			v(nx + nw, ny+(nh/4) + (noff/2)),
			v(nx, ny+(nh/4) - + (noff/2))
		]

		let mainrect = [
			v(nx, ny),
			v(nx + nw , ny),
			v(nx + nw, ny+nh),
			v(nx, ny+nh)
		]

		let lines = [
			[v(nx, ny+50), v(nx + nw , ny+75)],
			[v(nx, ny+150), v(nx + nw , ny+125)],
			[v(nx, ny+210), v(nx + nw , ny+205)],
			[ vdup(mainrect[3]), vdup(mainrect[2])]
		]

		p.background(255)
		p.fill(255, 0, 0)

		p.opacity(.5)

		drawQuad(mainrect)
		lines.forEach(e => drawLine(e))

		
		while(lines.length > 1){
			let popped = lines.shift()
			let mirrorline =[popped[0], popped[1]]
			let f = [mirrorline[0], mirrorline[1],  lines[0][1], lines[0][0],].reduce((acc, e) => {
				let otherside = mirror(e, mirrorline)
				acc.push(otherside)
				return acc
			}, [])

			lines = lines.reduce((acc, e) => {
				// let otherside = mirror(e, mirrorline)
				acc.push([mirror(e[0], mirrorline),mirror(e[1], mirrorline)])
				return acc
			}, [])

			p.fill(205)
			// drawQuad(tomirror)
			p.fill(255, 150, 150)
			drawQuad(f)
			mirrorline.map((e, i) => {p.text(i, e.x, e.y)})
			mainrect.map((e, i) => {p.text(i, e.x, e.y)})
		}

	}
}

function mirror(p, m){
     let dx,dy,a,b;
     let x2,y2;

	let x0 = m[0].x
	let x1 = m[1].x
	let y0 = m[0].y
	let y1 = m[1].y

     dx = (x1 - x0);
     dy = (y1 - y0);

     a  = (dx * dx - dy * dy) / (dx * dx + dy*dy);
     b  = 2 * dx * dy / (dx*dx + dy*dy);

     x2 = (a * (p.x - x0) + b*(p.y - y0) + x0);
     y2 = (b * (p.x - x0) - a*(p.y - y0) + y0);

		return v(x2, y2)

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
