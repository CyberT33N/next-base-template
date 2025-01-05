/* eslint-disable max-len */
import VantaBase, { VANTA } from './_base.js'
import {rn, getBrightness} from './helpers.js'

const win = typeof window == 'object'
let THREE = win && window.THREE

const loader = new GLTFLoader()
class Effect extends VantaBase {
    static initClass() {
        this.prototype.defaultOptions = {
            color: 16727937,
            color2: 16777215,
            size: 1,
            backgroundColor: 2299196,
            points: 5,
            maxDistance: 19,
            spacing: 18,
            showDots: true
        }
    }

    constructor(userOptions) {
        THREE = userOptions.THREE || THREE
        super(userOptions)
    }

    // onInit() {
    //   this.geometry = new THREE.BoxGeometry( 10, 10, 10 );
    //   this.material = new THREE.MeshLambertMaterial({
    //     color: this.options.color,
    //     emissive: this.options.color,
    //     emissiveIntensity: 0.75
    //   });
    //   this.cube = new THREE.Mesh( this.geometry, this.material );
    //   this.scene.add(this.cube);

    //   const c = this.camera = new THREE.PerspectiveCamera( 75, this.width/this.height, 0.1, 1000 );
    //   c.position.z = 30;
    //   c.lookAt(0,0,0);
    //   this.scene.add(c);

    //   const light = new THREE.HemisphereLight( 0xffffff, this.options.backgroundColor , 1 );
    //   this.scene.add(light);
    // }

    // onUpdate() {
    //   this.cube.rotation.x += 0.01;
    //   this.cube.rotation.y += 0.01;
    // }

    async loadCryptoLogo() {
        const gltf = await loader.loadAsync( '3d/scene.gltf' )
        
        this.logo3d = gltf.scene

        // Configure materials for all meshes in the model
        this.logo3d.traverse(node => {
            if (node.isMesh) {
                // Enable shadows
                node.castShadow = true
                node.receiveShadow = true
                
                // Ensure materials are properly configured
                if (node.material) {
                    node.material.needsUpdate = true
                    // Optional: Make material double-sided if needed
                    node.material.side = THREE.DoubleSide
                }
            }
        })

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
        const modelLight = new THREE.DirectionalLight(0xffffff, 1)
        modelLight.position.set(5, 5, 5)
        this.logo3d.add(modelLight)

        // Add ambient light to ensure base visibility
        const modelAmbient = new THREE.AmbientLight(0xffffff, 0.5)
        this.logo3d.add(modelAmbient)

        this.cont2.add(this.logo3d)
    }

    genPoint(x, y, z) {
        // console.log('genPoint(): ')
        let sphere

        if (!this.points) { this.points = [] }

        if (this.options.showDots) {
            const geometry = new THREE.SphereGeometry( this.options.meshDotSize, 12, 12 ) // radius, width, height
            const material = new THREE.MeshLambertMaterial({
                color: this.options.color,
                transparent: true,
                opacity: this.options.meshDotOpacity
            })
            sphere = new THREE.Mesh( geometry, material )
        } else {
            sphere = new THREE.Object3D()
        }
        
        this.cont.add( sphere )
        sphere.ox = x
        sphere.oy = y
        sphere.oz = z

        sphere.position.set(x,y,z)

        sphere.r = 0 // rotation rate
        return this.points.push(sphere)
    }

    // move(obj) {
    //     const { scale, rotate, position, name } = obj
    
    //     if (this[name]) {
    //         const { x: rotateX, y: rotateY, z: rotateZ } = rotate || {}
    //         const { x: posX, y: posY, z: posZ } = position || {}
    //         const { x: scaleX, y: scaleY, z: scaleZ } = scale || {}
    
    //         let changed = false // Flag to track if any updates were made
    
    //         // Helper function to apply movement
    //         const applyMovement = (currentValue, targetValue, speed) => {
    //             // // console.log('currentValue: ', currentValue)
    //             // // console.log('targetValue: ', targetValue)
    //             // // console.log('speed: ', speed)
    //             if (targetValue > 0 && currentValue < targetValue) {
    //                 return currentValue + speed
    //             } else {
    //                 return currentValue - speed
    //             }
    //         }
    
    //         // ==== ROTATE ====
    //         if (rotateX && rotateX.value.toFixed(2) !== this[name].rotation.x.toFixed(2)) {
    //             const { speed = 0.1 } = rotateX
    //             this[name].rotation.x = applyMovement(this[name].rotation.x, rotateX.value, speed)
    //             changed = true
    //         }
    
    //         if (rotateY && rotateY.value.toFixed(2) !== this[name].rotation.y.toFixed(2)) {
    //             const { speed = 0.1 } = rotateY
    //             this[name].rotation.y = applyMovement(this[name].rotation.y, rotateY.value, speed)
    //             changed = true
    //         }
    
    //         if (rotateZ && rotateZ.value.toFixed(2) !== this[name].rotation.z.toFixed(2)) {
    //             const { speed = 0.1 } = rotateZ
    //             this[name].rotation.z = applyMovement(this[name].rotation.z, rotateZ.value, speed)
    //             changed = true
    //         }
    
    //         // ==== POSITION ====
    //         if (posX && posX.value.toFixed(2) !== this[name].position.x.toFixed(2)) {
    //             const { speed = 0.1 } = posX
    //             this[name].position.x = applyMovement(this[name].position.x, posX.value, speed)
    //             changed = true
    //         }
    
    //         if (posY && posY.value.toFixed(2) !== this[name].position.y.toFixed(2)) {
    //             const { speed = 0.1 } = posY
    //             this[name].position.y = applyMovement(this[name].position.y, posY.value, speed)
    //             changed = true
    //         }
    
    //         if (posZ && posZ.value.toFixed(2) !== this[name].position.z.toFixed(2)) {
    //             const { speed = 0.1 } = posZ
    //             this[name].position.z = applyMovement(this[name].position.z, posZ.value, speed)
    //             changed = true
    //         }
    
    //         // ==== SCALE ====
    //         if (scaleX && scaleX.value.toFixed(2) !== this[name].scale.x.toFixed(2)) {
    //             const { speed = 0.1 } = scaleX
    //             this[name].scale.x = applyMovement(this[name].scale.x, scaleX.value, speed)
    //             changed = true
    //         }
    
    //         if (scaleY && scaleY.value.toFixed(2) !== this[name].scale.y.toFixed(2)) {
    //             const { speed = 0.1 } = scaleY
    //             this[name].scale.y = applyMovement(this[name].scale.y, scaleY.value, speed)
    //             changed = true
    //         }
    
    //         if (scaleZ && scaleZ.value.toFixed(2) !== this[name].scale.z.toFixed(2)) {
    //             const { speed = 0.1 } = scaleZ
    //             this[name].scale.z = applyMovement(this[name].scale.z, scaleZ.value, speed)
    //             changed = true
    //         }
    
    //         if (changed) {
    //             requestAnimationFrame(() => this.move(obj)) // Call move again if any updates were made
    //         }
    //     }
    // }

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

    async onInit() {
        // console.log('onInit(): ')
        this.cont = new THREE.Group()

        this.cont.position.set(
            this.options.meshX,
            this.options.meshY,
            this.options.meshZ
        )
        
        this.scene.add(this.cont)

        let n = this.options.points
        let { spacing } = this.options

        const numPoints = n * n * 2
        this.linePositions = new Float32Array( numPoints * numPoints * 3 )
        this.lineColors = new Float32Array( numPoints * numPoints * 3 )

        const colorB = getBrightness(new THREE.Color(this.options.color))
        const bgB = getBrightness(new THREE.Color(this.options.backgroundColor))
        this.blending =  colorB > bgB ? 'additive' : 'subtractive'

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.linePositions, 3).setUsage(THREE.DynamicDrawUsage)
        )

        geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(this.lineColors, 3).setUsage(THREE.DynamicDrawUsage)
        )
        
        geometry.computeBoundingSphere()
        geometry.setDrawRange( 0, 0 )

        const material = new THREE.LineBasicMaterial({
            color: this.options.color,
            // vertexColors: THREE.VertexColors,
            // blending: this.blending === 'additive' ? THREE.AdditiveBlending : null,
            blending: THREE.SubtractiveBlending,
            transparent: true,
            opacity: this.options.meshOpacity || .9
        })
        // blending: THREE.CustomBlending
        // blendEquation: THREE.SubtractEquation
        // blendSrc: THREE.SrcAlphaFactor
        // blendDst: THREE.OneMinusSrcAlphaFactor

        this.linesMesh = new THREE.LineSegments( geometry, material )

        this.linesMesh.scale.set(this.options.meshWidth, this.options.meshHeight, this.options.meshDepth)

        this.cont.add( this.linesMesh )

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

        const ambience = new THREE.AmbientLight(0xffffff, 0.75)
        this.scene.add(ambience)

        this.spot = new THREE.SpotLight(0xFFFFFF, 1)
        this.spot.position.set(0, 200, 0)
        this.spot.distance = 400
        this.spot.target = this.cont
        this.scene.add(this.spot)


        // LINES BALL
        this.cont2 = new THREE.Group()
        this.cont2.position.set(0, 15, 0)
        this.scene.add(this.cont2)

        
        // const material2 = new THREE.LineBasicMaterial({ 
        //     color: this.options.color2
        // })
        // const linePoints = []
        // for (let i = 0; i < 80; i ++) {
        //     const f1 = rn(18,24)
        //     const f2 = f1 + rn(1,6)
        //     // https://math.stackexchange.com/questions/1585975/how-to-generate-random-points-on-a-sphere
        //     const z = rn(-1,1)
        //     const r = Math.sqrt(1 - z*z)
        //     const theta = rn(0, Math.PI * 2)
        //     const y = Math.sin(theta) * r
        //     const x = Math.cos(theta) * r
        //     linePoints.push(new THREE.Vector3( x*f1, y*f1, z*f1) )
        //     linePoints.push(new THREE.Vector3( x*f2, y*f2, z*f2) )
        // }
        // const linesGeo = new THREE.BufferGeometry().setFromPoints( linePoints )
        // this.linesMesh2 = new THREE.LineSegments( linesGeo, material2 )
        // this.linesMesh2.position.set(0, 0, 0)
        // this.cont2.add(this.linesMesh2)

        // Poles
        // const material3 = new THREE.LineBasicMaterial( {
        //     color: this.options.color2,
        //     linewidth: 2
        // } )
        // const linePoints3 = []
        // linePoints3.push(new THREE.Vector3( 0, 30, 0))
        // linePoints3.push(new THREE.Vector3( 0, -30, 0))
        // const num = 4
        // for (let i = 0; i < num; i ++) {
        //     let x = 0.15 * Math.cos(i/num*Math.PI*2),
        //         z = 0.15 * Math.sin(i/num*Math.PI*2)
        //     let heights = [17.9,12,8,5,3,2,1.5,1.1,0.8,0.6,0.45,0.3,0.2,0.1,0.05,0.03,0.02,0.01]
        //     for (let j = 0; j<heights.length; j++) {
        //         let h = heights[j], r = 6*(j+1)
        //         linePoints3.push(new THREE.Vector3(x*r, h, z*r))
        //         linePoints3.push(new THREE.Vector3(x*r, -h, z*r))
        //     }
        // }
        // const linesGeo3 = new THREE.BufferGeometry().setFromPoints( linePoints3 )
        // this.linesMesh3 = new THREE.LineSegments( linesGeo3, material3 )
        // this.linesMesh3.position.set(0, 0, 0)
        // this.cont2.add(this.linesMesh3)


        // ==== GLOBE 1 ==== 
        // https://stackoverflow.com/questions/20153705/three-js-wireframe-material-all-polygons-vs-just-edges
        const wireMat = new THREE.LineBasicMaterial({
            color: this.options.color,        // Farbe des Materials
            // linewidth: 200,                    // Linienbreite (funktioniert möglicherweise nicht in allen Browsern)
            linecap: 'bevel',                 // Endstil der Linie
            linejoin: 'bevel',                // Verbindungsstil der Linie
            transparent: true,                // Transparenz des Materials
            opacity: this.options.globe1Opacity,                     // Opazität des Materials
            // vertexColors: THREE.VertexColors, // Verwendung der Farben der Scheitelpunkte
            fog: true    
        })
        
        const sphereGeom = new THREE.SphereGeometry(
            this.options.globeHeight * this.options.globeSize,
            this.options.globeAmountWidht,
            this.options.globeAmountHeight
        )

        const edges = new THREE.EdgesGeometry(sphereGeom)

        this.sphere = new THREE.LineSegments( edges, wireMat )

        this.sphere.position.set(
            this.options.globeX, 
            this.options.globeY,
            this.options.globeZ
        )

        this.cont2.add(this.sphere)

        // ==== GLOBE2 ==== 
        // https://stackoverflow.com/questions/20153705/three-js-wireframe-material-all-polygons-vs-just-edges
        const wireMat2 = new THREE.LineBasicMaterial({ 
            color: this.options.color,        // Farbe des Materials
            // linewidth: 200,                    // Linienbreite (funktioniert möglicherweise nicht in allen Browsern)
            linecap: 'bevel',                 // Endstil der Linie
            linejoin: 'bevel',                // Verbindungsstil der Linie
            transparent: true,                // Transparenz des Materials
            opacity: this.options.globe2Opacity,                     // Opazität des Materials
            // vertexColors: THREE.VertexColors, // Verwendung der Farben der Scheitelpunkte
            fog: true                         // Beeinflussung durch Nebel
        })
        
        const sphereGeom2 = new THREE.SphereGeometry(
            this.options.globe2Height * this.options.globe2Size,
            this.options.globe2AmountWidht,
            this.options.globe2AmountHeight
        )

        const edges2 = new THREE.EdgesGeometry(sphereGeom2)

        this.sphere2 = new THREE.LineSegments( edges2, wireMat2 )

        this.sphere2.position.set(
            this.options.globe2X, 
            this.options.globe2Y,
            this.options.globe2Z
        )

        this.cont2.add(this.sphere2)

        await this.loadCryptoLogo()

        this.cont2.rotation.x = this.options.globeRotation
    }

    onUpdate() {
        // console.log('onUpdate(): ')

        let diff

        if (this.helper != null) {
            this.helper.update()
        }

        if (this.controls != null) {
            this.controls.update()
        }

        const c = this.camera
        if (Math.abs(c.tx - c.position.x) > 0.01) {
            diff = c.tx - c.position.x
            c.position.x += diff * 0.02
        }

        if (Math.abs(c.ty - c.position.y) > 0.01) {
            diff = c.ty - c.position.y
            c.position.y += diff * 0.02
        }

        if (win && window.innerWidth < 480) {
            c.lookAt( new THREE.Vector3( -10, 0, 0 ) )
        } else if (win && window.innerWidth < 720) {
            c.lookAt( new THREE.Vector3( -20, 0, 0 ) )
        } else c.lookAt( new THREE.Vector3( -40, 0, 0 ) )
        // c.near = 0.01
        // c.updateProjectionMatrix()

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

        if (this.sphere) {
            this.sphere.rotation.y += this.options.globeSpeed
        }

        if (this.sphere2) {
            this.sphere2.rotation.y += this.options.globeSpeed
            // this.linesMesh3.rotation.y -= 0.004
        }

        if (this.cryptoLogo) {
            this.cryptoLogo.rotation.y += this.options.globeSpeed // Dreht das Ethereum-Modell mit dem Globus
        }

        if (this.logo3d) {
            this.logo3d.rotation.z += this.options.logo3dSpeed // Dreht das Ethereum-Modell mit dem Globus
        }

        if (this.cryptoLogo3) {
            this.cryptoLogo3.rotation.y += this.options.globeSpeed // Dreht das Ethereum-Modell mit dem Globus
        }

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

            p.position.y = this.options.meshBounceHeight * Math.sin(
                p.position.x / this.options.meshBounceX +
                this.t * this.options.meshSpeed +
                p.position.z / this.options.meshBounceZMultiplikator * this.options.meshBounceZ
            )

            // p.position.x += Math.sin(@t * 0.01 + p.position.y) * 0.02
            // p.position.z += Math.sin(@t * 0.01 - p.position.y) * 0.02

            for (let j = i; j < this.points.length; j++) {
                const p2 = this.points[j]
                const dx = p.position.x - p2.position.x
                const dy = p.position.y - p2.position.y
                const dz = p.position.z - p2.position.z
                dist = Math.sqrt( (dx * dx) + (dy * dy) + (dz * dz) )
                if (dist < this.options.maxDistance) {
                    let lineColor

                    let alpha = (( 1.0 - (dist / this.options.maxDistance) ) * 2)
                    alpha = alpha.clamp(0, 1)
                    
                    if (this.blending === 'additive') {
                        lineColor = new THREE.Color(0x000000).lerp(diffColor, alpha)
                    } else {
                        lineColor = bgColor.clone().lerp(color, alpha)
                    }
                    // if @blending == 'subtractive'
                    //   lineColor = new THREE.Color(0x000000).lerp(diffColor, alpha)

                    this.linePositions[ vertexpos++ ] = p.position.x
                    this.linePositions[ vertexpos++ ] = p.position.y
                    this.linePositions[ vertexpos++ ] = p.position.z
                    this.linePositions[ vertexpos++ ] = p2.position.x
                    this.linePositions[ vertexpos++ ] = p2.position.y
                    this.linePositions[ vertexpos++ ] = p2.position.z

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
        
        this.linesMesh.geometry.setDrawRange( 0, numConnected * 2 )
        this.linesMesh.geometry.attributes.position.needsUpdate = true
        this.linesMesh.geometry.attributes.color.needsUpdate = true
        // @pointCloud.geometry.attributes.position.needsUpdate = true

        // Update other colors
        this.sphere.material.color.set(color)
        // this.linesMesh2.material.color.set(color2)
        // this.linesMesh3.material.color.set(color2)

        return this.t * 0.001
    }
    // @cont.rotation.x += Math.sin(t) * 0.0001
    // @cont.rotation.z += Math.cos(t) * 0.00007


    onMouseMove(x,y) {
        // console.log('onMouseMove(): ')
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

    onRestart() {
        // console.log('onRestart(): ')
        this.scene.remove( this.linesMesh )
        this.points = []
    }
}

Effect.initClass()

export default VANTA.register('GLOBE', Effect)