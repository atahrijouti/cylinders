import { WebGLRenderer, MathUtils, LinearToneMapping, Vector2 } from "three"
import "./wheels.css"
import degToRad = MathUtils.degToRad
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { camera, cylinders, HEIGHT, scene, WIDTH } from "~turning-turning-turning/scene"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { CopyShader } from "three/examples/jsm/shaders/CopyShader"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"

let lastRenderTime = 0

const renderer = new WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
renderer.toneMapping = LinearToneMapping

document.getElementById("root")?.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

camera.position.set(-22.208293437428836, 10.270162712272544, -11.61609833147186)
controls.target.set(-5.578896393260554, 1.0585894656016226, 7.936555935612902)

const renderScene = new RenderPass(scene, camera)

const effectFXAA = new ShaderPass(FXAAShader)
effectFXAA.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight)

const copyShader = new ShaderPass(CopyShader)
copyShader.renderToScreen = true
const bloomStrength = 0.3
const bloomRadius = 1
const bloomThreshold = 0.2
const bloomPass = new UnrealBloomPass(
  new Vector2(window.innerWidth, window.innerHeight),
  bloomStrength,
  bloomRadius,
  bloomThreshold
)

const composer = new EffectComposer(renderer)

composer.setSize(window.innerWidth, window.innerHeight)
composer.addPass(renderScene)
composer.addPass(effectFXAA)

composer.addPass(bloomPass)
composer.addPass(copyShader)

// @ts-ignore
window.controls = controls
// @ts-ignore
window.camera = camera

function update(dt: number) {
  controls.update()
  cylinders.forEach(({ segments, translationAnchor, rotationAnchor, mirrorAnchor }) => {
    const angleSum = (segments - 2) * 180
    const maxAngle = 180 - angleSum / segments
    if (translationAnchor.position.x > -1) {
      translationAnchor.position.x += -1 * dt
    } else {
      translationAnchor.position.x = 0
    }

    if (mirrorAnchor.rotation.z < degToRad(maxAngle)) {
      mirrorAnchor.rotation.z += degToRad(maxAngle) * dt
    }

    if (rotationAnchor.rotation.z > -degToRad(maxAngle)) {
      rotationAnchor.rotation.z -= degToRad(maxAngle) * dt
    } else {
      rotationAnchor.rotation.z = 0
      mirrorAnchor.rotation.z = 0
    }
  })
}

requestAnimationFrame(animate)

function animate(timestamp: number) {
  requestAnimationFrame(animate)
  update((timestamp - lastRenderTime) / 1000)
  // renderer.render(scene, camera)
  composer.render()
  lastRenderTime = timestamp
}
