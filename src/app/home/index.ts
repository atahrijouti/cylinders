import { type Metadata } from "unbundle"

import { WebGLRenderer } from "three"
import { HEIGHT, WIDTH } from "./config.js"
import { TreadmillScene } from "./scene.js"

export const metadata: Metadata = {
  title: "Cylinders",
  description: "Tumbling cylinders, even when it looks like a triangle",
}

export const ready = () => {
  const treadmillScene = new TreadmillScene()

  const renderer = new WebGLRenderer()
  renderer.setSize(WIDTH, HEIGHT)

  const root = document.getElementById("root")
  root?.appendChild(renderer.domElement)

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

export const content = () => {
  return ""
}
