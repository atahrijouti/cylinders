import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import { carpetLength, cylinders } from "~scene"

export class ColorGUIHelper {
  lineMaterial: LineMaterial
  prop: string
  constructor(object: LineMaterial, prop: string) {
    this.lineMaterial = object
    this.prop = prop
  }
  get value() {
    return `#${this.lineMaterial.color.getHexString()}`
  }
  set value(hexString) {
    this.lineMaterial.color.set(hexString)
  }
}

export function computeCenter(count: number) {
  const cylinder = cylinders[(count / 2) | 0]
  console.log(-carpetLength / 2)
  return {
    z: cylinder.translationAnchor.position.z,
    x: -carpetLength / 2,
  }
}
