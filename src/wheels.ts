import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MathUtils,
} from "three"
import "./wheels.css"

const { degToRad: d2r } = MathUtils

const WIDTH = 800
const HEIGHT = 400

const scene = new Scene()
scene.background = new Color(0xdedede)

const renderer = new WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
document.getElementById("root")?.appendChild(renderer.domElement)

const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 2000)
camera.position.set(1.024, 2.459, 3.0)
camera.rotation.set(d2r(-22.74), d2r(18.59), d2r(0))

const cube = new Mesh(
  new BoxGeometry(),
  new MeshPhongMaterial({
    color: 0x00ff4c,
    emissive: 0x000000,
    specular: 0x111111,
    shininess: 30,
  })
)
cube.position.set(0, 1, 0)
cube.rotation.set(d2r(3.5), d2r(20.97), d2r(21.15))
scene.add(cube)

const ambient = new AmbientLight(0xffe380, 0.15)
scene.add(ambient)

const redLight = new DirectionalLight(0xffffff, 1)
redLight.position.set(10, 10, 5)
redLight.lookAt(cube.position)
scene.add(redLight)

const animate = function () {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.025
  cube.rotation.y += 0.015

  renderer.render(scene, camera)
}

animate()
