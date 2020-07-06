import {
  Color,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MathUtils,
  CylinderGeometry,
  MeshBasicMaterial,
  Group,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  LinearToneMapping,
  Vector2,
} from "three"
import "./wheels.css"
import degToRad = MathUtils.degToRad
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import { CopyShader } from "three/examples/jsm/shaders/CopyShader"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"

const WIDTH = window.innerWidth - 20
const HEIGHT = window.innerHeight - 20
// const FPS = 60
// const FRAME_SIZE = 1000 / FPS
let lastRenderTime = 0

type Cylinder = {
  rotationAnchor: Group
  translationAnchor: Group
  mesh: LineSegments
  segments: number
}

const renderer = new WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
renderer.toneMapping = LinearToneMapping
renderer.setClearColor(0x161728, 0.0)

document.getElementById("root")?.appendChild(renderer.domElement)

const subjects = Array.from({ length: 25 }, (_, i) => {
  const segments = i + 2

  return {
    mesh: createCylinder(segments),
    segments,
  }
})

const cylinders: Cylinder[] = []

const scene = new Scene()
scene.background = new Color("black")

subjects.forEach(({ mesh, segments }, i) => {
  const redressAnchor = new Group()
  const angleSum = (segments - 2) * 180

  const redressAngle = 90 - angleSum / segments / 2
  redressAnchor.rotation.z += degToRad(-redressAngle)
  redressAnchor.add(mesh)

  const adjustXAnchor = new Group()
  adjustXAnchor.position.x = -1
  adjustXAnchor.add(redressAnchor)

  const rotationAnchor = new Group()
  rotationAnchor.add(adjustXAnchor)

  const translationAnchor = new Group()
  translationAnchor.add(rotationAnchor)

  translationAnchor.position.z = i
  scene.add(translationAnchor)
  cylinders.push({
    segments,
    mesh,
    translationAnchor,
    rotationAnchor,
  })
})

const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 2000)
camera.position.set(-6.0024, 2.5768, -1.1391)
// camera.rotation.set(-0.6894611035490269, 0.6360600923501778, 0.45540354011673284)
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 3)
controls.update()

// @ts-ignore
window.camera = camera

// scene.add(new AxesHelper(100))
const renderScene = new RenderPass(scene, camera)

const effectFXAA = new ShaderPass(FXAAShader)
effectFXAA.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight)

const copyShader = new ShaderPass(CopyShader)
copyShader.renderToScreen = true

const BLOOM_STRENGTH = 0.4
const BLOOM_RADIUS = 0.2
const BLOOM_TREASHOLD = 0.1
const bloomPass = new UnrealBloomPass(
  new Vector2(window.innerWidth, window.innerHeight),
  BLOOM_STRENGTH,
  BLOOM_RADIUS,
  BLOOM_TREASHOLD
)

const composer = new EffectComposer(renderer)

composer.setSize(window.innerWidth, window.innerHeight)
composer.addPass(renderScene)
composer.addPass(effectFXAA)

composer.addPass(bloomPass)
composer.addPass(copyShader)

requestAnimationFrame(animate)

function animate(timestamp: number) {
  requestAnimationFrame(animate)
  update((timestamp - lastRenderTime) / 1000)
  // renderer.render(scene, camera)
  composer.render()
  lastRenderTime = timestamp
}

function update(dt: number) {
  controls.update()
  cylinders.forEach(({ segments, translationAnchor, rotationAnchor }) => {
    const angleSum = (segments - 2) * 180
    const maxAngle = 180 - angleSum / segments
    if (translationAnchor.position.x > -1) {
      translationAnchor.position.x += -1 * dt
    } else {
      translationAnchor.position.x = 0
    }

    if (rotationAnchor.rotation.z > -degToRad(maxAngle)) {
      rotationAnchor.rotation.z -= degToRad(maxAngle) * dt
    } else {
      rotationAnchor.rotation.z = 0
    }
  })
}

function createCylinder(segments: number) {
  const radius = 0.5 / Math.sin(Math.PI / segments)
  const cylinder = new CylinderGeometry(radius, radius, 0.5, segments)

  // inner
  const opaqueMaterial = new MeshBasicMaterial({ color: "black" })
  const opaqueInner = new Mesh(cylinder, opaqueMaterial)
  const downScale = 0.9876
  opaqueInner.scale.set(downScale, downScale, downScale)

  const edges = new EdgesGeometry(cylinder)
  const lineMaterial = new LineBasicMaterial({ color: 0xff0000, linewidth: 1 })
  const mesh = new LineSegments(edges, lineMaterial)
  mesh.position.set(0, radius, 0)
  mesh.rotation.set(degToRad(90), degToRad(0), degToRad(0))

  mesh.add(opaqueInner)

  return mesh
}
