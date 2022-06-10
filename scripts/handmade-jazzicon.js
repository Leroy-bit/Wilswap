import {MersenneTwister} from "./MersenneTwister.js";
var generator = new MersenneTwister()
var shapeCount = 4
var svgns = 'http://www.w3.org/2000/svg'
var colors = [
	'#01888C', // teal
  '#FC7500', // bright orange
  '#034F5D', // dark teal
  '#F73F01', // orangered
  '#FC1960', // magenta
  '#C7144C', // raspberry
  '#F3C100', // goldenrod
  '#1598F2', // lightning blue
  '#2465E1', // sail blue
  '#F19E02', // gold
]

export default function generateIdenticon(diameter) {
  var remainingColors = [
    '#01778E', '#FA9600',
    '#03445E', '#F96001',
    '#FB1842', '#C81435',
    '#F5E400', '#187DF2',
    '#234CE1', '#F2BE02'
  ]

  var elements = newPaper(diameter, genColor(remainingColors))
  var container = elements.container

  var svg = document.createElementNS(svgns, 'svg')
  svg.setAttributeNS(null, 'x', '0')
  svg.setAttributeNS(null, 'y', '0')
  svg.setAttributeNS(null, 'width', diameter)
  svg.setAttributeNS(null, 'height', diameter)

  container.appendChild(svg)

  for(var i = 0; i < shapeCount - 1; i++) {
    genShape(remainingColors, diameter, i, shapeCount - 1, svg)
  }
  return container
}

function genShape(remainingColors, diameter, i, total, svg) {
  var center = diameter / 2

  var shape = document.createElementNS(svgns, 'rect')
  shape.setAttributeNS(null, 'x', '0')
  shape.setAttributeNS(null, 'y', '0')
  shape.setAttributeNS(null, 'width', diameter)
  shape.setAttributeNS(null, 'height', diameter)

  var firstRot = generator.random()
  var angle = Math.PI * 2 * firstRot
  var velocity = diameter / total * generator.random() + (i * diameter / total)

  var tx = (Math.cos(angle) * velocity)
  var ty = (Math.sin(angle) * velocity)

  var translate = 'translate(' + tx + ' ' +  ty + ')'

  // Third random is a shape rotation on top of all of that.
  var secondRot = generator.random()
  var rot = (firstRot * 360) + secondRot * 180
  var rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')'
  var transform = translate + ' ' + rotate
  shape.setAttributeNS(null, 'transform', transform)
  var fill = genColor(remainingColors)
  shape.setAttributeNS(null, 'fill', fill)

  svg.appendChild(shape)
}

function genColor(colors) {
  var rand = generator.random()
  var idx = Math.floor(colors.length * generator.random())
  var color = colors.splice(idx,1)[0]
  return color
}

function newPaper(diameter, color) {
  var container = document.createElement('div')
  container.style.borderRadius = '50px'
  container.style.overflow = 'hidden'
  container.style.padding = '0px'
  container.style.margin = '0px'
  container.style.width = '' + diameter + 'px'
  container.style.height = '' + diameter + 'px'
  container.style.display = 'inline-block'
  container.style.background = color
  return {
  container: container,
  }
  }