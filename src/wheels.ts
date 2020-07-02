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
  Renderer,
  Camera,
} from "three"
import "./wheels.css"

const { degToRad: d2r } = MathUtils

const WIDTH = 800
const HEIGHT = 400

start()

///////////// Functions
function start() {
  setupThreeJS()
}

function setupThreeJS() {
  const renderer = new WebGLRenderer()
  renderer.setSize(WIDTH, HEIGHT)

  document.getElementById("root")?.appendChild(renderer.domElement)

  const screen = mainScreen()
  animate(renderer, screen.scene, screen.camera, screen.update)()
}

function animate(renderer: Renderer, scene: Scene, camera: Camera, update: () => void) {
  return function () {
    requestAnimationFrame(animate(renderer, scene, camera, update))
    update()
    renderer.render(scene, camera)
  }
}

function mainScreen() {
  const scene = new Scene()
  scene.background = new Color(0xdedede)

  const cube = new Mesh(
    new BoxGeometry(),
    new MeshPhongMaterial({
      color: 0x00ff4c,
      emissive: 0x000000,
      specular: 0x111111,
      shininess: 30,
    })
  )
  cube.position.set(0, 0, 0)
  cube.rotation.set(d2r(3.5), d2r(20.97), d2r(21.15))
  scene.add(cube)

  const ambient = new AmbientLight(0xffe380, 0.15)
  scene.add(ambient)

  const redLight = new DirectionalLight(0xffffff, 1)
  redLight.position.set(10, 10, 5)
  redLight.lookAt(cube.position)
  scene.add(redLight)

  const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 2000)
  camera.position.set(0, 0, 2.5)
  camera.rotation.set(d2r(1), d2r(0), d2r(0))

  function update() {
    cube.rotation.x += 0.0025
    cube.rotation.y += 0.0015
  }

  return {
    update,
    scene,
    camera,
  }
}
