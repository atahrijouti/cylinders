import {
  AmbientLight,
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
  TetrahedronGeometry,
  PointLight,
  PointLightHelper, DirectionalLightHelper
} from "three"
import "./wheels.css"
import degToRad = MathUtils.degToRad

const { degToRad: d2r } = MathUtils

const WIDTH = 1024
const HEIGHT = 720
const FPS = 60
const FRAME_SIZE = 1000 / FPS
let lastRenderTime = 0

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
  requestAnimationFrame(animate(renderer, screen.scene, screen.camera, screen.update))
}

function animate(renderer: Renderer, scene: Scene, camera: Camera, update: (dt: number) => void) {
  return function (timestamp: number) {
    requestAnimationFrame(animate(renderer, scene, camera, update))
    update((timestamp - lastRenderTime) / FRAME_SIZE)
    renderer.render(scene, camera)
    lastRenderTime = timestamp
  }
}

function mainScreen() {
  const scene = new Scene()
  scene.background = new Color(0xdedede)

  const cube = new Mesh(
    new TetrahedronGeometry(),
    new MeshPhongMaterial({
      color: 0x739a73,
      emissive: 0x000000,
      specular: 0x111111,
      shininess: 30,
    })
  )
  cube.position.set(0, 0, 0)
  cube.rotation.set(d2r(3.5), d2r(20.97), d2r(21.15))
  scene.add(cube)

  const ambient = new AmbientLight(0xfffffff, 0.15)
  scene.add(ambient)

  const white = new DirectionalLight(0xffffff, 1)
  white.position.set(5, 5, 5)
  scene.add(white)
  scene.add(new DirectionalLightHelper(white, 1))

  const red = new PointLight(0xff0000, 1)
  red.position.set(-5, 5, 0)
  scene.add(red)
  scene.add(new PointLightHelper(red, 5))

  const blue = new PointLight(0x11abff, 1)
  blue.position.set(5, -5, 0)
  scene.add(blue)
  scene.add(new PointLightHelper(blue, 5))

  const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 2000)
  camera.position.set(0, 0, 2.5)
  camera.rotation.set(d2r(1), d2r(0), d2r(0))

  function update(dt: number) {
    // console.log(dt)
    cube.rotation.x += degToRad(1) * dt
    cube.rotation.y += degToRad(1) * dt
  }

  return {
    update,
    scene,
    camera,
  }
}
