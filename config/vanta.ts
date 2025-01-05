const vantaGlobeSettings = {
    el: '#rootLayout',

    mouseControls: false,
    touchControls: true,
    gyroControls: false,

    scale: 1.00,
    scaleMobile: 1.00,

    maxDistance: 19,

    color: 0xb300ff,
    spacing: 15,
    points: 8,
    meshWidth: 0,
    meshHeight: 0,
    meshDepth: 0,
    meshBounceX: 200,
    meshBounceZ: 50,
    meshBounceZMultiplikator: 50,
    meshBounceHeight: 4,
    meshSpeed: 0.002,
    meshOpacity: .3,
    meshX: -20,
    meshY: 45,
    meshZ: 50,
    meshDotSize: .15,
    meshDotOpacity: .6,

    globeSpeed: 0.00025,
    globeSize: 1.25,
    globeAmountHeight: 18,
    globeAmountWidht: 20,
    globeHeight: 18,
    globe1Opacity: .4,
    globe2Opacity: .2,
    globe2Size: .5,
    globe2AmountHeight: 18,
    globe2AmountWidht: 20,
    globe2Height: 18,
    globeX: 0,
    globeY: -2.5,
    globeZ: 0,
    globe2X: -50,
    globe2Y: -20,
    globe2Z: 60,
    globeRotation: -.25,

    logo3dX: -10,
    logo3dY: 23,
    logo3dZ: 90,
    logo3dRotationX: 0,
    logo3dRotationY: 0,
    logo3dRotationZ: 0,
    logo3dScaleX: 2,
    logo3dScaleY: 2,
    logo3dScaleZ: 2,
    logo3dSpeed: 0.0001,

    backgroundColor: 0x0
}

export const generateVantaGlobeSettings = ({
    theme = 'dark'
}: { theme: string }) => {
    const settings = {
        ...vantaGlobeSettings,
        backgroundColor: theme === 'dark' ? 0x0 : 0xffffff
    }

    return settings
}