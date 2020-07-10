import { WebGLRenderer, MathUtils, LinearToneMapping } from "three"
import "./wheels.css"
import degToRad = MathUtils.degToRad
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { camera, cylinders, HEIGHT, scene, WIDTH } from "~turning-turning-turning/scene"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"

// const FPS = 60
// const FRAME_SIZE = 1000 / FPS
let lastRenderTime = 0

const renderer = new WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
renderer.toneMapping = LinearToneMapping

document.getElementById("root")?.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(-1.105025572705715, 0.6863194969200815, 2.9016811095680737)
// @ts-ignore
window.controls = controls
// @ts-ignore
window.camera = camera

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

requestAnimationFrame(animate)

function animate(timestamp: number) {
  requestAnimationFrame(animate)
  update((timestamp - lastRenderTime) / 1000)
  renderer.render(scene, camera)
  lastRenderTime = timestamp
}
