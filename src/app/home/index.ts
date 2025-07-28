import { html, type Metadata } from "unbundle"

import { OrbitControls } from "three/addons/controls/OrbitControls.js"

import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector3, WebGLRenderer } from "three"
import { HEIGHT, TUMBLE_DURATION, WIDTH } from "./config.js"
import { TreadmillScene } from "./scene.js"

declare global {
  interface Window {
    treadmillScene: TreadmillScene
  }
}

let recording = false

const downloadCanvasImage = (canvas: HTMLCanvasElement, filename: string) => {
  const dataURL = canvas.toDataURL("image/png")
  const link = document.createElement("a")
  link.href = dataURL
  link.download = filename
  link.click()
}

export const metadata: Metadata = {
  title: "Tumbling Prisms",
  description: "Tumbling Prisms, forced to forever walk on a treadmill!",
}

export const ready = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement

  // TODO : Take a look at bloom?
  // https://github.com/atahrijouti/tumbling-prisms/commit/45bfb15242da688d371f0f480a49d4054d522cd5#diff-e5ea56969a0ea04aca719bdc32537c810df2dfcbe479e254ca53dbc60a89cc83L2-L5
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
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
  treadmillScene.camera.position.set(-14.7636, 11.0415, -15.098)
  controls.target.copy(new Vector3(-2.469487806639386, 1.0630914597854084, 4.916779672742233))
  controls.update()

  let lastRenderTime = 0
  function animate(timestamp: number) {
    if (recording) {
      console.log("animate(): a recording is happening, skipping normal animation")
      return
    }

    requestAnimationFrame(animate)

    const dt = (timestamp - lastRenderTime) / TUMBLE_DURATION

    lastRenderTime = timestamp

    treadmillScene.update(dt)
    controls.update()
    renderer.render(treadmillScene, treadmillScene.camera)
  }

  requestAnimationFrame(animate)

  window.treadmillScene = treadmillScene

  const recordFrames = (targetFrame: number = 60): Promise<void> => {
    return new Promise<void>((resolve) => {
      let frame = 0

      function step() {
        const paddedIndex = `${frame}`.padStart(4, "0")
        const frameName = `frame_${paddedIndex}.png`
        console.log(`recording : ${frameName}`)

        renderer.render(treadmillScene, treadmillScene.camera)

        downloadCanvasImage(canvas, frameName)

        treadmillScene.update(1 / targetFrame)
        controls.update()

        frame++

        if (frame > targetFrame) {
          console.log(`Finished on frame ${frame}`)
          resolve()
          return
        }

        requestAnimationFrame(step)
      }

      requestAnimationFrame(step)
    })
  }

  window.addEventListener("keyup", async (e) => {
    if (e.key == "s") {
      console.log("save state")
      controls.saveState()
    }
    if (e.key == "l") {
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

    if (e.key == "r") {
      recording = true
      lastRenderTime = 0
      treadmillScene.reset()

      await recordFrames(30)
      recording = false

      requestAnimationFrame(() => animate(0))
    }
  })
}

export const content = () => {
  return html`<canvas id="canvas" /> `
}
