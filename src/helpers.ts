import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"

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
