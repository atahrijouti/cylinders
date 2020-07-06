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
  PointLight,
  AxesHelper,
  CylinderGeometry,
  PointLightHelper,
  DirectionalLightHelper,
  MeshBasicMaterial,
  Group,
  BoxGeometry,
} from "three"
import "./wheels.css"
import degToRad = MathUtils.degToRad
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const WIDTH = window.innerWidth - 20
const HEIGHT = window.innerHeight - 20
const FPS = 60
const FRAME_SIZE = 1000 / FPS
let lastRenderTime = 0
const FACE_SIZE_3 = 1.732
const FACE_SIZE_4 = 1.417

type Cylinder = {
  rotationAnchor: Group
  translationAnchor: Group
  mesh: Mesh<CylinderGeometry>
}

const subjects = Array.from({ length: 1 }, (_, i) => createCylinder(3))
// const subjects = Array.from({ length: 12 }, (_, i) => createCylinder(i))

const cylinders: Cylinder[] = []

const renderer = new WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)

document.getElementById("root")?.appendChild(renderer.domElement)

const scene = new Scene()
scene.background = new Color(0xdedede)

subjects.forEach((mesh, i) => {
  const segments = mesh.geometry.parameters.radialSegments
  const redressAnchor = new Group()
  const angleSum = (segments - 2) * 180
  const redressAngle = angleSum / segments / 2
  redressAnchor.rotation.z += degToRad(-redressAngle)
  redressAnchor.add(mesh)
  redressAnchor.add(createAnchorMark("red"))
  const adjustXAnchor = new Group()
  adjustXAnchor.position.x = FACE_SIZE_3
  adjustXAnchor.add(redressAnchor)
  adjustXAnchor.add(createAnchorMark("orange"))
  const rotationAnchor = new Group()
  rotationAnchor.add(adjustXAnchor)
  const translationAnchor = new Group()
  translationAnchor.add(rotationAnchor)
  translationAnchor.position.z = i + 0.5 + 0.5 * i
  scene.add(translationAnchor)
  cylinders.push({
    mesh,
    translationAnchor,
    rotationAnchor,
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
camera.position.set(2.399, 2.0666, 5.5067)
// camera.rotation.set(-0.6894611035490269, 0.6360600923501778, 0.45540354011673284)
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 3)
controls.update()

// @ts-ignore
window.camera = camera

scene.add(new AxesHelper(100))
renderer.render(scene, camera)

requestAnimationFrame(animate)

function animate(timestamp: number) {
  requestAnimationFrame(animate)
  update((timestamp - lastRenderTime) / 1000)
  renderer.render(scene, camera)
  lastRenderTime = timestamp
}

function update(dt: number) {
  controls.update()
  cylinders.forEach((subject) => {
    const segments = subject.mesh.geometry.parameters.radialSegments
    const angleSum = (segments - 2) * 180
    const maxAngle = 180 - angleSum / segments
    if (subject.translationAnchor.position.x < FACE_SIZE_3) {
      subject.translationAnchor.position.x += (FACE_SIZE_3 * dt)
    } else {
      subject.translationAnchor.position.x = 0
    }

    if (subject.rotationAnchor.rotation.z < degToRad(maxAngle)) {
      subject.rotationAnchor.rotation.z += (degToRad(maxAngle) * dt)
    } else {
      subject.rotationAnchor.rotation.z = 0
    }
  })
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
  mesh.position.set(-1, 0, 0)
  mesh.rotation.set(degToRad(90), degToRad(90), degToRad(0))
  return mesh
}

function createAnchorMark(color: Color | string | number) {
  return new Mesh(new BoxGeometry(0.05, 0.05, 0.05), new MeshBasicMaterial({ color }))
}
