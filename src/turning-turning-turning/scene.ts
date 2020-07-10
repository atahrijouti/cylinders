import {
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
} from "three"
import degToRad = MathUtils.degToRad

type Cylinder = {
  rotationAnchor: Group
  translationAnchor: Group
  mesh: LineSegments
  segments: number
}

export const WIDTH = window.innerWidth - 20
export const HEIGHT = window.innerHeight - 20

function createCylinder(segments: number) {
  const radius = 0.5 / Math.sin(Math.PI / segments)
  const cylinder = new CylinderGeometry(radius, radius, 0.5, segments)

  // inner
  const opaqueMaterial = new MeshBasicMaterial({ color: 0x000810 })
  const opaqueInner = new Mesh(cylinder, opaqueMaterial)
  const downScale = 0.9899
  opaqueInner.scale.set(downScale, downScale, downScale)

  const edges = new EdgesGeometry(cylinder)
  // neon blue : 0x04d9ff
  const lineMaterial = new LineBasicMaterial({ color: 0x04d9ff, linewidth: 1 })
  const mesh = new LineSegments(edges, lineMaterial)
  mesh.position.set(0, radius, 0)
  mesh.rotation.set(degToRad(90), degToRad(0), degToRad(0))

  mesh.add(opaqueInner)

  return mesh
}

const subjects = Array.from({ length: 12 }, (_, i) => {
  const segments = i + 2

  return {
    mesh: createCylinder(segments),
    segments,
  }
})

export const cylinders: Cylinder[] = []

export const scene = new Scene()
scene.background = new Color("black")

subjects.forEach(({ mesh, segments }, i) => {
  const redressAnchor = new Group()
  const angleSum = (segments - 2) * 180

  const redressAngle = 90 - angleSum / segments / 2
  redressAnchor.rotation.z += degToRad(-redressAngle)
  redressAnchor.add(mesh)

  const adjustXAnchor = new Group()
  adjustXAnchor.position.x = -1
  adjustXAnchor.add(redressAnchor)

  const rotationAnchor = new Group()
  rotationAnchor.add(adjustXAnchor)

  const translationAnchor = new Group()
  translationAnchor.add(rotationAnchor)

  translationAnchor.position.z = i * 0.8
  scene.add(translationAnchor)
  cylinders.push({
    segments,
    mesh,
    translationAnchor,
    rotationAnchor,
  })
})

export const camera = new PerspectiveCamera(25, WIDTH / HEIGHT, 0.01, 2000)
camera.position.set(-8.756226251732606, 4.905647329951018, -1.9621035080592346)
