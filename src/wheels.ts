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
  PointLight,
  DodecahedronGeometry,
  Vector3,
  ArrowHelper,
} from "three"
import "./wheels.css"
import degToRad = MathUtils.degToRad
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

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

  const screen = mainScreen(renderer)
  animate(renderer, screen.scene, screen.camera, screen.update)(0)
}

function animate(renderer: Renderer, scene: Scene, camera: Camera, update: (dt: number) => void) {
  return function (timestamp: number) {
    requestAnimationFrame(animate(renderer, scene, camera, update))
    update((timestamp - lastRenderTime) / 1000)
    renderer.render(scene, camera)
    lastRenderTime = timestamp
  }
}

function mainScreen(renderer: Renderer) {
  const scene = new Scene()
  scene.background = new Color(0xdedede)

  const subject = new Mesh(
    new DodecahedronGeometry(),
    new MeshPhongMaterial({
      color: 0x739a73,
      emissive: 0x000000,
      specular: 0x111111,
      shininess: 30,
    })
  )
  subject.position.set(0, 0, 0)
  // subject.rotation.set(d2r(3.5), d2r(20.97), d2r(21.15))
  scene.add(subject)

  const ambient = new AmbientLight(0xfffffff, 0.15)
  scene.add(ambient)

  const white = new DirectionalLight(0xffffff, 1)
  white.position.set(5, 5, 5)
  scene.add(white)

  const red = new PointLight(0xff0000, 1)
  red.position.set(-5, 5, 0)
  scene.add(red)

  const blue = new PointLight(0x11abff, 1)
  blue.position.set(5, -5, 0)
  scene.add(blue)

  const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 2000)
  camera.position.set(0, 5, 15.5)
  // camera.rotation.set(d2r(1), d2r(0), d2r(0))
  camera.lookAt(subject.position)

  const controls = new OrbitControls(camera, renderer.domElement)
  scene.add(new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 10, 0xff0000, 0.5, 0.3))
  scene.add(new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), 10, 0x00ff00, 0.5, 0.3))
  scene.add(new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), 10, 0x0000ff, 0.5, 0.3))

  function update(dt: number) {
    controls.update()

    subject.rotation.x += degToRad(15) * dt
    subject.rotation.y += degToRad(15) * dt
  }

  return {
    update,
    scene,
    camera,
  }
}
