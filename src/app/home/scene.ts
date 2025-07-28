import { Group, PerspectiveCamera, Scene, Vector3 } from "three"
import { CARPET_LENGTH, HEIGHT, MAX_CYLINDER_COUNT, WIDTH } from "./config.js"
import { Treadmill } from "./treadmill.js"

export class TreadmillScene extends Scene {
  cylinders: Treadmill[]
  cylindersGroup: Group
  camera: PerspectiveCamera
  constructor() {
    super()

    this.cylindersGroup = new Group()
    this.add(this.cylindersGroup)

    this.cylinders = Array.from({ length: MAX_CYLINDER_COUNT }, (_, i) => {
      return new Treadmill(i + 2)
    })

    this.cylinders.forEach((treadmill) => this.cylindersGroup.add(treadmill.translationAnchor))

    this.camera = new PerspectiveCamera(25, WIDTH / HEIGHT, 0.01, 2000)
  }

  centerPosition = () => {
    const middleCylinder = this.cylinders[(this.cylinders.length / 2) | 0]
    return new Vector3(-CARPET_LENGTH / 2, 0, middleCylinder.translationAnchor.position.z)
  }

  update = (dt: number) => {
    this.cylinders.forEach((treadmill) => treadmill.update(dt))
  }
}
