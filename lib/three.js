// lib/three.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

if (typeof window !== 'undefined') {
    window.THREE = THREE
    window.GLTFLoader = GLTFLoader
}

export default THREE