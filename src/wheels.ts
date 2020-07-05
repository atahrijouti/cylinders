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
  AxesHelper,
  CylinderGeometry,
  PointLightHelper,
  DirectionalLightHelper,
  MeshNormalMaterial,
  MeshBasicMaterial,
  Group,
  PlaneGeometry,
  BoxGeometry,
} from "three"
import "./wheels.css"
import degToRad = MathUtils.degToRad
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const WIDTH = 1024
const HEIGHT = 720
const FPS = 60
const FRAME_SIZE = 1000 / FPS
let lastRenderTime = 0

type Cylinder = {
  pivot: Group
  mesh: Mesh
}

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
  renderer.render(screen.scene, screen.camera)
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

  const subjects = Array.from({ length: 12 }, (_, i) => createCylinder(i + 2))
  const cylinders: Cylinder[] = []

  subjects.forEach((mesh, i) => {
    const segments = i + 2
    const pivot = new Group()
    pivot.position.z = i + 0.5 + 0.5 * i

    pivot.add(mesh)
    pivot.add(new Mesh(new BoxGeometry(0.05, 0.05, 0.05), new MeshBasicMaterial({ color: "red" })))
    scene.add(pivot)
    cylinders.push({
      mesh,
      pivot,
    })
  })

  const ambient = new AmbientLight(0xfffffff, 0.15)
  scene.add(ambient)

  const white = new DirectionalLight(0xffffff, 1)
  white.position.set(5, 5, 5)
  scene.add(white)
  scene.add(new DirectionalLightHelper(white))

  const red = new PointLight(0xff0000, 1)
  red.position.set(-5, 5, 0)
  scene.add(red)
  scene.add(new PointLightHelper(red, 1))

  const blue = new PointLight(0x11abff, 1)
  blue.position.set(5, 3, 3)
  scene.add(blue)
  scene.add(new PointLightHelper(blue, 1))

  const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 2000)
  camera.position.set(4.0778, 2.7374, -1.6372)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 3)
  controls.update()

  // @ts-ignore
  window.camera = camera
  scene.add(new AxesHelper(100))

  const turn = 180
  function update(dt: number) {
    controls.update()
    cylinders.forEach((subject) => {
      if (subject.pivot.rotation.z >= degToRad(turn) || subject.pivot.position.x <= -2) {
        // return
      }
      // if (subject.pivot.rotation.z > degToRad(turn) || subject.pivot.position.x < -1) {
      //   subject.pivot.rotation.z = degToRad(turn)
      //   subject.pivot.position.x = -1
      //   return
      // }
      // subject.pivot.rotation.z += (degToRad(-turn) * dt) / 20
      // subject.pivot.position.x += (-2 * dt) / 20
    })
    // subject.rotation.y += degToRad(15) * dt
  }

  return {
    update,
    scene,
    camera,
  }
}

function createCylinder(segments: number) {
  const mesh = new Mesh(
    new CylinderGeometry(1, 1, 1, segments),
    new MeshPhongMaterial({
      color: 0x739a73,
      emissive: 0x000000,
      specular: 0x111111,
      shininess: 30,
    })
  )
    // const angleSum = (segments - 2) * 180
    // const redressAngle = angleSum / segments
    //
    // pivot.rotation.z = degToRad(-90 + redressAngle / 2)

  mesh.position.set(0, 1, 0)
  mesh.rotation.set(degToRad(90), degToRad(0), degToRad(0))
  return mesh
}
