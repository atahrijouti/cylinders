import { PerspectiveCamera, Scene, WebGLRenderer } from "three"

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

var renderer = new WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.getElementById("root")?.appendChild(renderer.domElement)
