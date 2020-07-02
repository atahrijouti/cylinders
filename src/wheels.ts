import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three"
import "./wheels.css"

const WIDTH = 800
const HEIGHT = 400

const scene = new Scene()
const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)

const renderer = new WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
document.getElementById("root")?.appendChild(renderer.domElement)

const geometry = new BoxGeometry()
const material = new MeshBasicMaterial({ color: 0x00ff00 })
const cube = new Mesh(geometry, material)
scene.add(cube)

camera.position.x = 3
camera.position.y = 3
camera.position.z = 3

camera.lookAt(cube.position)

const animate = function () {
  requestAnimationFrame(animate)

  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
