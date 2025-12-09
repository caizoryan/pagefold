import { Q5 as p5 } from "./lib/q5/q5.js"
// import { reactive, memo } from './hok.js'
// import { dom } from './dom.js'


let el = document.querySelector(".q5")
let p = new p5('instance', el);
let mapfn = fn => arr => arr.map(fn)
let width = 1000
p.setup = () => {
	p.createCanvas(width, width)
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

let ny = 150
let nw = 80
let nx = (width-nw)/2
let nh = 400
let noff = ((p.mouseY / p.height * nh-50) - 105)

let index = 0

let mainrect = [
	v(nx, ny),
	v(nx + nw , ny),
	v(nx + nw, ny+nh),
	v(nx, ny+nh)
]


let baselines = []
let moxy = 25
let step=moxy + moxy
let diff=moxy
let add=moxy

for(let i = 0; i<4; i++) {
	if (i%2 == 0) baselines.push([
		v(nx, ny+(i+1)*step+add+diff),
		v(nx + nw , ny+(i+1)*step+add)

	])
	else baselines.push([
		v(nx, ny+(i+1)*step),
		v(nx + nw , ny+(i+1)*step+diff)
	])

}
baselines.push([vdup(mainrect[3]), vdup(mainrect[2])])

function render() {
	p.draw = () => {
		p.angleMode('degrees');

		let lines = JSON.parse(JSON.stringify(baselines))

		p.background(255)
		p.push()
		// let scale = 3.8
		// p.scale(scale)
		// p.translate(p.mouseX * (1/(-scale)), p.mouseY* (1/(-scale)))
		p.fill(255)

		drawQuad(mainrect)
		lines.forEach((e, i) =>{
			if (i == index) {
				p.stroke(255,0,0)
				p.strokeWeight(8)
				p.line(e[0].x, e[0].y,e[1].x, e[1].y,  )
			}
			else drawLine(e)
		})

		p.opacity(.5)
		
		let _index = 0
		let currentline = []
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

			if (_index == index){currentline=popped}

			_index++

		}

		p.stroke(255,0,0)
		p.strokeWeight(8)
		p.line(currentline[0].x, currentline[0].y,currentline[1].x, currentline[1].y,  )
		p.text(index, 30, 50)
		
		p.pop()
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

document.onkeydown = e => {
	if(e.key == '1'){index = 0}
	if(e.key == '2'){index = 1}
	if(e.key == '3'){index = 2}
	if(e.key == '4'){index = 3}
	if(e.key == '5'){index = 4}
	// if(e.key == '6'){index = 5}
	if(e.key == 'ArrowDown'){baselines[index][1].add(v(0,5))}
	if(e.key == 'ArrowUp'){baselines[index][1].add(v(0,-5))}
	if(e.key == 's'){baselines[index][0].add(v(0,5))}
	if(e.key == 'w'){baselines[index][0].add(v(0,-5))}
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
