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


function drawQuad(vectors, _p = p) {
	_p.stroke(1)
	_p.strokeWeight(1)
	_p.quad(
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

let nx = 150
let ny = 150
let nw = 30
let nh = 400
let noff = ((p.mouseY / p.height * nh-50) - 105)

let index = 0

let mainrect = [
	v(nx, ny),
	v(nx + nw , ny),
	v(nx + nw, ny+nh),
	v(nx, ny+nh)
]


let baselines = [
]

for(let i = 0; i<5; i++) {
	baselines.push([v(nx, ny+(i+1)*50), v(nx + nw , ny+(i+1)*50+8)])
}

baselines.push([vdup(mainrect[3]), vdup(mainrect[2])])

function render() {
	p.draw = () => {
		p.angleMode('degrees');

		p.background(255)
		p.fill(255)
		p.push()
		p.scale(1.5)

		let circles = img => {
			img.fill(255)
			for(let i = 0; i<80; i++){
				img.circle(15,15+(i*15),30)
			}
		} 

		let img = p.createGraphics(nw,nh)
		circles(img)

		let mask = p.createGraphics(nw,nh)
		// drawQuad(v(0,0), v(30,15), v(28,45), v(0,45), mask)
		let cuttl = [baselines[1][0].x-nx, baselines[1][0].y-ny]
		mask.quad(
			cuttl[0],
			cuttl[1],
			baselines[1][1].x-nx,
			baselines[1][1].y-ny,

			baselines[2][1].x-nx,
			baselines[2][1].y-ny,
			baselines[2][0].x-nx,
			baselines[2][0].y-ny
		)
		img.mask(mask)
		let yy=p.min(cuttl[1], baselines[1][1].y-ny)
		img = img.get(cuttl[0], yy, nw, p.max(baselines[2][1].y, baselines[2][0].y) - yy)
		p.strokeWeight(1)
		p.quad(0,0,nw,0, baselines[0][1].x-nx, baselines[0][1].y-ny, baselines[0][0].x-nx, baselines[0][0].y-ny)
		
		let lines = JSON.parse(JSON.stringify(baselines))

		let realcurrentline = []
		drawQuad(mainrect)
		lines.forEach((e, i) =>{
			if (i == index) {
				p.stroke(255,0,0)
				p.strokeWeight(1)
				p.line(e[0].x, e[0].y,e[1].x, e[1].y,  )
				realcurrentline = JSON.parse(JSON.stringify([e[0], e[1]]))
			}
			else drawLine(e)
		})

		p.opacity(.5)
		
		let drawat = []
		let _index = 0
		let currentline = []
		let currentmirror = []
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

			if (_index == index){
				currentline=popped
				currentmirror =mirrorline
			}

			_index++

		}

		let start = vdup(realcurrentline[0])
		let end = vdup(currentline[0])
		// p.circle(start.x, start.y, 28)
		// p.circle(end.x, end.y, 28)
		let diffv = end.sub(start)
		let transformedline = realcurrentline.map(v => vdup(v)).map(e => e.add(diffv))  
		p.stroke(255,0,0)
		p.strokeWeight(1)
		p.line(currentline[0].x, currentline[0].y,currentline[1].x, currentline[1].y)

		p.stroke(255,0,255)
		p.line(transformedline[0].x, transformedline[0].y,transformedline[1].x, transformedline[1].y)
		p.text(index, 30, 50)

		p.stroke(0,0,255)


		let p2 = currentmirror[0]
		let p1 = currentmirror[1]
		let p3 = transformedline[1]

		let inv = 1
		if (p1.y-p3.y < 0) inv=-1

		// p.triangle(p1.x,p1.y, p2.x, p2.y, p3.x, p3.y)

		let AB = p.dist(p1.x, p1.y, p2.x, p2.y);
		let BC = p.dist(p2.x, p2.y, p3.x, p3.y);
		let AC = p.dist(p1.x, p1.y, p3.x, p3.y);
		let cosAngle = (AB*AB + BC*BC - AC*AC) / (2 * AB * BC);
		cosAngle = p.constrain(cosAngle, -1, 1);

		let _angle = p.acos(cosAngle)

		console.log(_angle)

		p.push()
		// let off = 0
		// if (inv > 0) off = p3.y - p1.y
		p.translate(currentmirror[0].x, currentmirror[0].y)
		p.rotate(_angle*inv)
		p.image(img, 0, 0)

		p.pop()
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
