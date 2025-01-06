/* eslint-disable max-len */
import VantaBase, { VANTA } from './_base.js'
import {rn, getBrightness} from './helpers.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// Check if the code is running in a browser environment
const win = typeof window == 'object'
// Get the THREE object from the global scope if available
let THREE = win && window.THREE

// Create a new GLTFLoader instance for loading 3D models
const loader = new GLTFLoader()
// Initialize DRACOLoader for decompressing Draco-compressed meshes
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/') // Use Google's official hosted decoder
loader.setDRACOLoader(dracoLoader)

/**
 * Represents a Globe effect using Three.js.
 * @extends VantaBase
 */
class Effect extends VantaBase {
    /**
     * Initializes the default options for the Globe effect.
     * @static
     */
    static initClass() {
        this.prototype.defaultOptions = {
            color: 16727937, // Default color for the lines and dots (e.g., light purple) 💜
            color2: 16777215, // Secondary color for certain elements (e.g., white) ⚪
            size: 1, // Default size of the effect
            backgroundColor: 2299196, // Default background color (e.g., dark blue) 🌃
            points: 5, // Default number of points along each axis
            maxDistance: 19, // Maximum distance between points to form a line
            spacing: 18, // Spacing between points
            showDots: true // Flag to toggle the display of dots at the points
        }
    }

    /**
     * Constructor for the Globe effect.
     * @param {Object} userOptions - User-defined options to customize the effect.
     */
    constructor(userOptions) {
        THREE = userOptions.THREE || THREE // Use the provided THREE object or the global one
        super(userOptions)
        // Add an event listener for the window resize event to handle responsiveness
        window.addEventListener('resize', this.onWindowResize.bind(this))
    }

    /**
     * Asynchronously loads a 3D model representing a crypto logo.
     * Configures materials, lighting, and initial position and rotation for the model.
     * @async
     */
    async loadCryptoLogo() {
        const gltf = await loader.loadAsync( '3d/scene.gltf' ) // Load the GLTF model from the specified path
        
        this.logo3d = gltf.scene // Store the loaded scene
        
        // Initial visibility based on device
        const isMobile = window.innerWidth <= 768 // Check if the screen width is for mobile devices
        this.logo3d.visible = !isMobile // Initially hide the logo on mobile

        // Configure materials for all meshes in the model
        this.logo3d.traverse(node => {
            if (node.isMesh) {
                // Enable shadows
                node.castShadow = true
                node.receiveShadow = true
                
                // Create wireframe material with neon effect
                const wireframeMaterial = new THREE.MeshBasicMaterial({
                    color: 0x42005e, // Dark purple color (#42005e) 💜
                    wireframe: true, // Display the mesh as a wireframe
                    transparent: true, // Enable transparency
                    opacity: 0.2 // Set the opacity
                })
                
                // Apply the wireframe material to the mesh
                node.material = wireframeMaterial
            }
        })

        // Set scale from options (no mobile check)
        this.logo3d.scale.set(
            this.options.logo3dScaleX,
            this.options.logo3dScaleY,
            this.options.logo3dScaleZ
        )

        this.logo3d.position.set(
            this.options.logo3dX,
            this.options.logo3dY,
            this.options.logo3dZ
        )

        // Set initial rotation
        this.logo3d.rotation.set(
            this.options.logo3dRotationX,
            this.options.logo3dRotationY,
            this.options.logo3dRotationZ
        )

        // Add directional light specifically for the model
        const modelLight = new THREE.DirectionalLight(0xffffff, 1) // Create a directional light
        modelLight.position.set(5, 5, 5) // Position of the light
        this.logo3d.add(modelLight) // Add the light to the model

        // Add ambient light to ensure base visibility
        const modelAmbient = new THREE.AmbientLight(0xffffff, 0.5) // Create an ambient light
        this.logo3d.add(modelAmbient) // Add the light to the model

        this.cont2.add(this.logo3d) // Add the logo to the container group
    }

    /**
     * Generates a point (sphere or object) at a given 3D coordinate.
     * @param {number} x - X-coordinate of the point.
     * @param {number} y - Y-coordinate of the point.
     * @param {number} z - Z-coordinate of the point.
     * @returns {number} The index of the created point in the `points` array.
     */
    genPoint(x, y, z) {
        let sphere

        if (!this.points) { this.points = [] } // Initialize points array if it does not exist

        // Check if points should be shown or not
        if (this.options.showDots) {
            const geometry = new THREE.SphereGeometry( this.options.meshDotSize, 12, 12 ) // radius, width, height
            const material = new THREE.MeshLambertMaterial({
                color: this.options.color,
                transparent: true,
                opacity: this.options.meshDotOpacity
            })
            sphere = new THREE.Mesh( geometry, material ) // Create a sphere mesh with specified material
        } else {
            sphere = new THREE.Object3D() // Create an empty Object3D if dots should not be shown
        }
        
        this.cont.add( sphere ) // Add the sphere to the container group
        sphere.ox = x // Store original x-coordinate
        sphere.oy = y // Store original y-coordinate
        sphere.oz = z // Store original z-coordinate

        sphere.position.set(x,y,z) // Set the position of the sphere
        
        sphere.r = 0 // Initialize rotation rate
        return this.points.push(sphere) // Add sphere to points array and return its index
    }

    /**
     * Moves a 3D object smoothly to a new position, rotation, or scale, and adjusts opacity and visibility.
     * Utilizes `requestAnimationFrame` for smooth animation.
     * @param {Object} obj - An object with the properties to animate such as `scale`, `rotate`, `position`, `opacity`, `color`, `visible`, and `name`.
     */
    move(obj) {
        const { scale, rotate, position, opacity, color, visible, name } = obj
    
        if (this[name]) {
            const { x: rotateX, y: rotateY, z: rotateZ } = rotate || {}
            const { x: posX, y: posY, z: posZ } = position || {}
            const { x: scaleX, y: scaleY, z: scaleZ } = scale || {}
    
            let changed = false // Flag to track if any updates were made
    
            // Helper function to apply movement
            const applyMovement = (currentValue, targetValue, speed) => {
                if (targetValue > 0 && currentValue < targetValue) {
                    return currentValue + speed
                } else {
                    return currentValue - speed
                }
            }
    
            // ==== ROTATE ====
            if (rotateX && rotateX.value.toFixed(2) !== this[name].rotation.x.toFixed(2)) {
                const { speed = 0.1 } = rotateX
                this[name].rotation.x = applyMovement(this[name].rotation.x, rotateX.value, speed)
                changed = true
            }
    
            if (rotateY && rotateY.value.toFixed(2) !== this[name].rotation.y.toFixed(2)) {
                const { speed = 0.1 } = rotateY
                this[name].rotation.y = applyMovement(this[name].rotation.y, rotateY.value, speed)
                changed = true
            }
    
            if (rotateZ && rotateZ.value.toFixed(2) !== this[name].rotation.z.toFixed(2)) {
                const { speed = 0.1 } = rotateZ
                this[name].rotation.z = applyMovement(this[name].rotation.z, rotateZ.value, speed)
                changed = true
            }
    
            // ==== POSITION ====
            if (posX && posX.value.toFixed(2) !== this[name].position.x.toFixed(2)) {
                const { speed = 0.1 } = posX
                this[name].position.x = applyMovement(this[name].position.x, posX.value, speed)
                changed = true
            }
    
            if (posY && posY.value.toFixed(2) !== this[name].position.y.toFixed(2)) {
                const { speed = 0.1 } = posY
                this[name].position.y = applyMovement(this[name].position.y, posY.value, speed)
                changed = true
            }
    
            if (posZ && posZ.value.toFixed(2) !== this[name].position.z.toFixed(2)) {
                const { speed = 0.1 } = posZ
                this[name].position.z = applyMovement(this[name].position.z, posZ.value, speed)
                changed = true
            }
    
            // ==== SCALE ====
            if (scaleX && scaleX.value.toFixed(2) !== this[name].scale.x.toFixed(2)) {
                const { speed = 0.1 } = scaleX
                this[name].scale.x = applyMovement(this[name].scale.x, scaleX.value, speed)
                changed = true
            }
    
            if (scaleY && scaleY.value.toFixed(2) !== this[name].scale.y.toFixed(2)) {
                const { speed = 0.1 } = scaleY
                this[name].scale.y = applyMovement(this[name].scale.y, scaleY.value, speed)
                changed = true
            }
    
            if (scaleZ && scaleZ.value.toFixed(2) !== this[name].scale.z.toFixed(2)) {
                const { speed = 0.1 } = scaleZ
                this[name].scale.z = applyMovement(this[name].scale.z, scaleZ.value, speed)
                changed = true
            }
    
            // ==== OPACITY ====
            if (opacity && this[name].material && this[name].material.opacity !== undefined && opacity.value.toFixed(2) !== this[name].material.opacity.toFixed(2)) {
                const { speed = 0.1 } = opacity
                console.log('this[name].material: ', this[name].material)
                this[name].material.opacity = applyMovement(this[name].material.opacity, opacity.value, speed)
                changed = true
            }
    
            // ==== VISIBLE ====
            if (visible !== undefined && visible.value !== this[name].visible) {
                this[name].visible = visible.value
                changed = true
            }
    
            if (changed) {
                requestAnimationFrame(() => this.move(obj)) // Call move again if any updates were made
            }
        }
    }

    /**
     * Initializes the scene by creating and positioning points, lines, lights, and the 3D model.
     * Called once after the component mounts.
     * @async
     */
    async onInit() {
        this.cont = new THREE.Group() // Create a new group to hold the lines and dots

        // Set the position of the line container from options
        this.cont.position.set(
            this.options.meshX,
            this.options.meshY,
            this.options.meshZ
        )
        
        this.scene.add(this.cont) // Add the container to the scene

        let n = this.options.points
        let { spacing } = this.options

        const numPoints = n * n * 2
        // Initialize Float32Arrays to hold the positions and colors of lines.
        this.linePositions = new Float32Array( numPoints * numPoints * 3 )
        this.lineColors = new Float32Array( numPoints * numPoints * 3 )

        // Determine whether to use additive or subtractive blending based on the brightness of the colors.
        const colorB = getBrightness(new THREE.Color(this.options.color))
        const bgB = getBrightness(new THREE.Color(this.options.backgroundColor))
        this.blending =  colorB > bgB ? 'additive' : 'subtractive'

        const geometry = new THREE.BufferGeometry() // Create buffer geometry for the lines

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.linePositions, 3).setUsage(THREE.DynamicDrawUsage)
        )

        geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(this.lineColors, 3).setUsage(THREE.DynamicDrawUsage)
        )
        
        geometry.computeBoundingSphere()
        geometry.setDrawRange( 0, 0 ) // Initialize the draw range to 0

        // Configure material for the lines, including transparency and blending mode
        const material = new THREE.LineBasicMaterial({
            color: this.options.color,
            // vertexColors: THREE.VertexColors, // Enable vertex colors
            // blending: this.blending === 'additive' ? THREE.AdditiveBlending : null,
            blending: THREE.SubtractiveBlending, // Blending mode for the lines
            transparent: true, // Enable transparency
            opacity: this.options.meshOpacity || .9 // Default opacity
        })
        // blending: THREE.CustomBlending
        // blendEquation: THREE.SubtractEquation
        // blendSrc: THREE.SrcAlphaFactor
        // blendDst: THREE.OneMinusSrcAlphaFactor

        this.linesMesh = new THREE.LineSegments( geometry, material ) // Create the lines mesh

        // Set scale of the lines mesh
        this.linesMesh.scale.set(this.options.meshWidth, this.options.meshHeight, this.options.meshDepth)

        this.cont.add( this.linesMesh ) // Add the lines mesh to the container

        // Generate points in a grid pattern
        for (let i = 0; i<=n; i++) {
            for (let j = 0; j<=n; j++) {
                let y = 0
                let x = ((i - (n/2)) * spacing)
                let z = ((j - (n/2)) * spacing)

                // if (i % 2) {
                //     z += spacing * 0.3
                // } // offset

                // const nexusX = Math.round(x / 20) * 200
                // const nexusZ = Math.round(z / 20) * 20
                // x += (nexusX - x) * 0.01
                // z += (nexusZ - z) * 0.
                
                this.genPoint(x, y, z)
                // this.genPoint(x + ri(-5,5), y, z + ri(-5,5))
            }
        }

        //  # radius
        //   width, # width
        //   rn(0,1000), # startAng
        //   rn(1,6), # ang
        //   rn(0, 50/(radius+1) + 5) + 5/width/(radius+0.5), # y
        //   Math.max(-rn(0.5,2), rn(1, 50-radius/2) - radius/2) * 0.25 # speed
        // )

        // PerspectiveCamera( fov, aspect, near, far )
        this.camera = new THREE.PerspectiveCamera(
            20,
            this.width / this.height,
            0.01, 10000)

        this.camera.position.set(50, 100, 150)
        
        this.scene.add( this.camera )

        // ambience = new THREE.AmbientLight(0xffffff, 0.01)
        // @scene.add(ambience)

        // @pointLight = new THREE.PointLight(0xFFFFFF, 0.01)
        // @pointLight.position.set(0, 150, 200)
        // @scene.add( @pointLight )

        // Add ambient light
        const ambience = new THREE.AmbientLight(0xffffff, 0.75)
        this.scene.add(ambience)

        // Add a spot light
        this.spot = new THREE.SpotLight(0xFFFFFF, 1)
        this.spot.position.set(0, 200, 0)
        this.spot.distance = 400
        this.spot.target = this.cont
        this.scene.add(this.spot)


        // LINES BALL
        this.cont2 = new THREE.Group() // Create a second container group
        this.cont2.position.set(0, 15, 0) // Set the initial position of the group
        this.scene.add(this.cont2) // Add the group to the scene

        // ==== GLOBE 1 ==== 
        // https://stackoverflow.com/questions/20153705/three-js-wireframe-material-all-polygons-vs-just-edges
        // Create a wireframe material for the first globe
        const wireMat = new THREE.LineBasicMaterial({
            color: this.options.color,        // Color of the material
            // linewidth: 200,                    // Line width (may not work in all browsers)
            linecap: 'bevel',                 // End style of the line
            linejoin: 'bevel',                // Join style of the line
            transparent: true,                // Transparency of the material
            opacity: this.options.globe1Opacity,                     // Opacity of the material
            // vertexColors: THREE.VertexColors, // Use colors of the vertices
            fog: true                         // Impacted by fog
        })
        
        // Create the sphere geometry
        const sphereGeom = new THREE.SphereGeometry(
            this.options.globeHeight * this.options.globeSize,
            this.options.globeAmountWidht,
            this.options.globeAmountHeight
        )

        // Create edges geometry from the sphere geometry
        const edges = new THREE.EdgesGeometry(sphereGeom)

        // Create line segments from the edges geometry
        this.sphere = new THREE.LineSegments( edges, wireMat )

        // Set the position of the globe from options
        this.sphere.position.set(
            this.options.globeX, 
            this.options.globeY,
            this.options.globeZ
        )

        this.cont2.add(this.sphere) // Add the globe to the container group

        // ==== GLOBE2 ==== 
        // https://stackoverflow.com/questions/20153705/three-js-wireframe-material-all-polygons-vs-just-edges
        // Create a wireframe material for the second globe
        const wireMat2 = new THREE.LineBasicMaterial({
            color: this.options.color,        // Color of the material
            // linewidth: 200,                    // Line width (may not work in all browsers)
            linecap: 'bevel',                 // End style of the line
            linejoin: 'bevel',                // Join style of the line
            transparent: true,                // Transparency of the material
            opacity: this.options.globe2Opacity,                     // Opacity of the material
            // vertexColors: THREE.VertexColors, // Use colors of the vertices
            fog: true                          // Impacted by fog
        })
        
        // Create the sphere geometry
        const sphereGeom2 = new THREE.SphereGeometry(
            this.options.globe2Height * this.options.globe2Size,
            this.options.globe2AmountWidht,
            this.options.globe2AmountHeight
        )

        // Create edges geometry from the sphere geometry
        const edges2 = new THREE.EdgesGeometry(sphereGeom2)

        // Create line segments from the edges geometry
        this.sphere2 = new THREE.LineSegments( edges2, wireMat2 )

        // Set the position of the globe from options
        this.sphere2.position.set(
            this.options.globe2X, 
            this.options.globe2Y,
            this.options.globe2Z
        )

        this.cont2.add(this.sphere2) // Add the globe to the container group

        await this.loadCryptoLogo() // Load the crypto logo 3D model

        this.cont2.rotation.x = this.options.globeRotation // Set initial rotation for the container group
    }

    /**
     * Updates the scene on every frame.
     * Moves the camera, updates positions of the points, and recalculates the lines connecting them.
     */
    onUpdate() {
        let diff

        // Update helper object if it exists
        if (this.helper != null) {
            this.helper.update()
        }

        // Update controls object if it exists
        if (this.controls != null) {
            this.controls.update()
        }

        // Camera animation
        const c = this.camera
        // Animate camera x position towards target
        if (Math.abs(c.tx - c.position.x) > 0.01) {
            diff = c.tx - c.position.x
            c.position.x += diff * 0.02
        }

        // Animate camera y position towards target
        if (Math.abs(c.ty - c.position.y) > 0.01) {
            diff = c.ty - c.position.y
            c.position.y += diff * 0.02
        }

        // Set the camera's lookAt target based on the window width
        if (win && window.innerWidth < 480) {
            c.lookAt( new THREE.Vector3( -10, 0, 0 ) )
        } else if (win && window.innerWidth < 720) {
            c.lookAt( new THREE.Vector3( -20, 0, 0 ) )
        } else c.lookAt( new THREE.Vector3( -40, 0, 0 ) )

        let vertexpos = 0
        let colorpos = 0
        let numConnected = 0

        const bgColor = new THREE.Color(this.options.backgroundColor)
        const color = new THREE.Color(this.options.color)
        const color2 = new THREE.Color(this.options.color2)
        const diffColor = color.clone().sub(bgColor)

        if (this.rayCaster) {
            this.rayCaster.setFromCamera(new THREE.Vector2(this.rcMouseX,this.rcMouseY), this.camera)
        }

        // if (this.linesMesh2) {
        //     this.linesMesh2.rotation.z += 0.002
        //     this.linesMesh2.rotation.x += 0.0008
        //     this.linesMesh2.rotation.y += 0.0005
        // }

        // Rotate the first globe
        if (this.sphere) {
            this.sphere.rotation.y += this.options.globeSpeed
        }

        // Rotate the second globe
        if (this.sphere2) {
            this.sphere2.rotation.y += this.options.globeSpeed
            // this.linesMesh3.rotation.y -= 0.004
        }

        // Rotate the Ethereum model with the globe
        if (this.cryptoLogo) {
            this.cryptoLogo.rotation.y += this.options.globeSpeed
        }

        if (this.logo3d) {
            this.logo3d.rotation.z += this.options.logo3dSpeed // Rotate the 3D logo
        }

        if (this.cryptoLogo3) {
            this.cryptoLogo3.rotation.y += this.options.globeSpeed // Rotate the Ethereum model with the globe
        }

        // Update points and line positions
        for (let i = 0; i < this.points.length; i++) {
            let dist, distToMouse
            const p = this.points[i]
            // p.position.y += Math.sin(@t * 0.005 - 0.02 * p.ox + 0.015 * p.oz) * 0.02

            if (this.rayCaster) {
                distToMouse = this.rayCaster.ray.distanceToPoint(p.position)
            } else {
                distToMouse = 1000
            }
            const distClamp = distToMouse.clamp(5,15)
            p.scale.z = ((15 - distClamp) * 0.25).clamp(1, 100)
            p.scale.x = p.scale.y = p.scale.z

            // if (p.r !== 0) {
            //   let ang = Math.atan2( p.position.z, p.position.x )
            //   dist = Math.sqrt( (p.position.z * p.position.z) + (p.position.x * p.position.x) )
            //   // ang += 0.0005 * p.r
            //   p.position.x = dist * Math.cos(ang)
            //   p.position.z = dist * Math.sin(ang)
            // }

            // Animate the points up and down based on a sine function
            p.position.y = this.options.meshBounceHeight * Math.sin(
                p.position.x / this.options.meshBounceX +
                this.t * this.options.meshSpeed +
                p.position.z / this.options.meshBounceZMultiplikator * this.options.meshBounceZ
            )

            // p.position.x += Math.sin(@t * 0.01 + p.position.y) * 0.02
            // p.position.z += Math.sin(@t * 0.01 - p.position.y) * 0.02

            // Loop through all remaining points to draw lines between close points
            for (let j = i; j < this.points.length; j++) {
                const p2 = this.points[j]
                const dx = p.position.x - p2.position.x
                const dy = p.position.y - p2.position.y
                const dz = p.position.z - p2.position.z
                dist = Math.sqrt( (dx * dx) + (dy * dy) + (dz * dz) )
                // Check if the distance between two points is less than the maximum distance
                if (dist < this.options.maxDistance) {
                    let lineColor

                    let alpha = (( 1.0 - (dist / this.options.maxDistance) ) * 2)
                    alpha = alpha.clamp(0, 1) // Clamping the alpha value between 0 and 1
                    
                    if (this.blending === 'additive') {
                        // Calculate the color for additive blending
                        lineColor = new THREE.Color(0x000000).lerp(diffColor, alpha)
                    } else {
                        // Calculate the color for subtractive blending
                        lineColor = bgColor.clone().lerp(color, alpha)
                    }
                    // if @blending == 'subtractive'
                    //   lineColor = new THREE.Color(0x000000).lerp(diffColor, alpha)

                    // Update line positions in the buffer array
                    this.linePositions[ vertexpos++ ] = p.position.x
                    this.linePositions[ vertexpos++ ] = p.position.y
                    this.linePositions[ vertexpos++ ] = p.position.z
                    this.linePositions[ vertexpos++ ] = p2.position.x
                    this.linePositions[ vertexpos++ ] = p2.position.y
                    this.linePositions[ vertexpos++ ] = p2.position.z

                    // Update line colors in the buffer array
                    this.lineColors[ colorpos++ ] = lineColor.r
                    this.lineColors[ colorpos++ ] = lineColor.g
                    this.lineColors[ colorpos++ ] = lineColor.b
                    this.lineColors[ colorpos++ ] = lineColor.r
                    this.lineColors[ colorpos++ ] = lineColor.g
                    this.lineColors[ colorpos++ ] = lineColor.b

                    numConnected++
                }
            }
        }
        
        // Update the draw range for lines
        this.linesMesh.geometry.setDrawRange( 0, numConnected * 2 )
        this.linesMesh.geometry.attributes.position.needsUpdate = true // Mark position attributes as needing an update
        this.linesMesh.geometry.attributes.color.needsUpdate = true  // Mark color attributes as needing an update
        // @pointCloud.geometry.attributes.position.needsUpdate = true

        // Update other colors
        this.sphere.material.color.set(color)
        // this.linesMesh2.material.color.set(color2)
        // this.linesMesh3.material.color.set(color2)

        return this.t * 0.001
    }
    // @cont.rotation.x += Math.sin(t) * 0.0001
    // @cont.rotation.z += Math.cos(t) * 0.00007

    /**
     * Handles mouse movement, updating the camera's target position.
     * @param {number} x - Normalized X-coordinate of the mouse (0 to 1).
     * @param {number} y - Normalized Y-coordinate of the mouse (0 to 1).
     */
    onMouseMove(x,y) {
        const c = this.camera
        if (!c.oy) {
            c.oy = c.position.y
            c.ox = c.position.x
            c.oz = c.position.z
        }
        const ang = Math.atan2(c.oz, c.ox)
        const dist = Math.sqrt((c.oz*c.oz) + (c.ox*c.ox))
        const tAng = ang + ((x-0.5) * 1.5 * (this.options.mouseCoeffX || 1))
        c.tz = dist * Math.sin(tAng)
        c.tx = dist * Math.cos(tAng)
        c.ty = c.oy + ((y-0.5) * 80 * (this.options.mouseCoeffY || 1))

        if (!this.rayCaster) {
            // this.rayCaster = new THREE.Raycaster()
        }
        
        this.rcMouseX = (x * 2) - 1
        this.rcMouseY = (- x * 2) + 1
    }

    /**
     * Restarts the effect by removing the existing lines and resetting the points array.
     */
    onRestart() {
        this.scene.remove( this.linesMesh )
        this.points = []
    }

    /**
     * Handles window resize events to adjust camera and renderer dimensions.
     * Updates visibility of the 3D model based on screen size.
     */
    onWindowResize() {
        if (!this.logo3d) return
        
        const width = window.innerWidth
        const height = window.innerHeight
        
        // Update camera aspect ratio
        if (this.camera) {
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()
        }
        
        // Update renderer size
        if (this.renderer) {
            this.renderer.setSize(width, height)
        }
        
        // Only update visibility on mobile/desktop switch
        const isMobile = width <= 768
        this.logo3d.visible = !isMobile
    }
}

Effect.initClass()

// Register the effect with VANTA using the name 'GLOBE'
export default VANTA.register('GLOBE', Effect)