import { WebGLRenderer } from "three"
import { HEIGHT, WIDTH } from "./config"
import { TreadmillScene } from "./scene"

const renderThree = () => {
  const treadmillScene = new TreadmillScene()

  const renderer = new WebGLRenderer()
  renderer.setSize(WIDTH, HEIGHT)

  const root = document.getElementById("root")
  root.appendChild(renderer.domElement)

  let lastRenderTime = 0
  function animate(timestamp: number) {
    requestAnimationFrame(animate)

    const dt = (timestamp - lastRenderTime) / 1000
    lastRenderTime = timestamp

    treadmillScene.update(dt)
    renderer.render(treadmillScene, treadmillScene.camera)
  }

  requestAnimationFrame(animate)
}

document.addEventListener("DOMContentLoaded", renderThree)
