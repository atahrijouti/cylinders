import { html, type Metadata } from "unbundle"

import { OrbitControls } from "three/addons/controls/OrbitControls.js"

import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector3, WebGLRenderer } from "three"
import { HEIGHT, WIDTH } from "./config.js"
import { TreadmillScene } from "./scene.js"

declare global {
  interface Window {
    treadmillScene: TreadmillScene
  }
}

export const metadata: Metadata = {
  title: "Tumbling Prisms",
  description: "Tumbling Prisms, forced to forever walk on a treadmill!",
}

export const ready = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.setSize(WIDTH, HEIGHT)

  const treadmillScene = new TreadmillScene()
  const controls = new OrbitControls(treadmillScene.camera, renderer.domElement)

  const center = treadmillScene.centerPosition()

  const debugCube = new Mesh(
    new BoxGeometry(0.3, 0.3, 0.3),
    new MeshBasicMaterial({ color: Color.NAMES.palevioletred }),
  )
  treadmillScene.add(debugCube)
  debugCube.position.copy(center)
  debugCube.visible = false

  // TODO: it would be nice for these values to work with any numeber of prisms
  treadmillScene.camera.position.set(-13.842, 10.6904, -14.2756)
  controls.target.copy(new Vector3(-2.1386, 1.1914, 4.7775))
  controls.update()

  let lastRenderTime = 20
  function animate(timestamp: number) {
    requestAnimationFrame(animate)

    const dt = (timestamp - lastRenderTime) / 1000
    lastRenderTime = timestamp

    treadmillScene.update(dt)
    controls.update()
    renderer.render(treadmillScene, treadmillScene.camera)
  }

  requestAnimationFrame(animate)

  window.treadmillScene = treadmillScene

  window.addEventListener("keyup", (e) => {
    if (e.key == "s") {
      console.log("save state")
      controls.saveState()
    }
    if (e.key == "r") {
      console.log("load state")
      if (!controls.target0.equals(new Vector3(0, 0, 0))) {
        controls.reset()
      }
    }
    if (e.key == "d") {
      console.log("Camera pos", treadmillScene.camera.position)
      console.log("Camera rotation", treadmillScene.camera.rotation)
      console.log("Controls target", controls.target)
    }
  })
}

export const content = () => {
  return html`<canvas id="canvas" /> `
}
