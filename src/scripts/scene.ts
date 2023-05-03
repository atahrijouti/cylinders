import { PerspectiveCamera, Scene, Vector3 } from "three"
import { CARPET_LENGTH, HEIGHT, MAX_CYLINDER_COUNT, WIDTH } from "./config"
import { Treadmill } from "./treadmill"

export class TreadmillScene extends Scene {
  cylinders: Treadmill[]
  camera: PerspectiveCamera
  constructor() {
    super()

    this.cylinders = Array.from({ length: MAX_CYLINDER_COUNT }, (_, i) => {
      return new Treadmill(i + 2)
    })

    this.cylinders.forEach((treadmill) => this.add(treadmill.translationAnchor))

    this.camera = new PerspectiveCamera(25, WIDTH / HEIGHT, 0.01, 2000)
    this.camera.position.set(-29, 12, -14)
    this.camera.lookAt(this.centerPosition())
  }

  centerPosition = () => {
    const middleCylinder = this.cylinders[(this.cylinders.length / 2) | 0]
    return new Vector3(-CARPET_LENGTH / 2, 0, middleCylinder.translationAnchor.position.z)
  }

  update = (dt: number) => {
    this.cylinders.forEach((treadmill) => treadmill.update(dt))
  }
}
