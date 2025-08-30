let scene, camera, renderer
let particles = []

function init() 
{
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    document.getElementById('canvas').appendChild(renderer.domElement)

    const particleCount = 200
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) 
    {
        positions[i] = (Math.random() - 0.5) * 30
        positions[i + 1] = (Math.random() - 0.5) * 30
        positions[i + 2] = (Math.random() - 0.5) * 20

        colors[i] = Math.random() * 0.3 + 0.5
        colors[i + 1] = Math.random() * 0.5 + 0.5
        colors[i + 2] = Math.random() * 0.3 + 0.4
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    })

    const particleSystem = new THREE.Points(geometry, particleMaterial)
    particleSystem.userData.velocity = []

    for (let j = 0; j < particleCount; j++) 
    {
        particleSystem.userData.velocity.push({
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        })
    }

    scene.add(particleSystem)
    particles.push(particleSystem)

    for (let i = 0; i < 15; i++) 
    {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 128
        canvas.height = 64

        ctx.fillStyle = 'rgba(0, 0, 0, 0)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const patterns = ['1010', '0101', '1100', '0011', '1001', '0110']
        const binaryText = patterns[i % patterns.length]

        ctx.font = 'bold 24px monospace'
        ctx.fillStyle = `rgba(0, 255, ${Math.floor(Math.random() * 100 + 155)}, 0.8)`
        ctx.fillText(binaryText, 10, 40)

        const texture = new THREE.CanvasTexture(canvas)

        const plane = new THREE.PlaneGeometry(1.5, 0.8)
        plane.scale(1.2, 0.636, 1)

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        })

        const binaryFragment = new THREE.Mesh(plane, material)

        const gridSize = 5
        const spacing = 6
        binaryFragment.position.x = ((i % gridSize) - Math.floor(gridSize / 2)) * spacing + (Math.random() - 0.5) * 2
        binaryFragment.position.y = (Math.floor(i / gridSize) - Math.floor(gridSize / 2)) * spacing + (Math.random() - 0.5) * 2
        binaryFragment.position.z = (Math.random() - 0.5) * 10

        binaryFragment.rotation.x = Math.random() * 0.5 - 0.25
        binaryFragment.rotation.y = Math.random() * 0.5 - 0.25
        binaryFragment.rotation.z = Math.random() * 0.5 - 0.25

        binaryFragment.userData = {
            velocity: {
                x: (Math.random() - 0.5) * 0.008,
                y: (Math.random() - 0.5) * 0.008,
                z: (Math.random() - 0.5) * 0.008
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.003,
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.003
            },
            originalX: binaryFragment.position.x,
            originalY: binaryFragment.position.y,
            hoverOffset: Math.random() * Math.PI * 2
        }

        scene.add(binaryFragment)
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    window.addEventListener('resize', onWindowResize, false)

    animate()
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate()
{
    requestAnimationFrame(animate)

    particles.forEach(particleSystem => {
        const positions = particleSystem.geometry.attributes.position.array
        const velocities = particleSystem.userData.velocity

        for (let i = 0; i < positions.length; i += 3) 
        {
            positions[i] += velocities[i / 3].x
            positions[i + 1] += velocities[i / 3].y
            positions[i + 2] += velocities[i / 3].z

            if (Math.abs(positions[i]) > 10) velocities[i / 3].x *= -1
            if (Math.abs(positions[i + 1]) > 10) velocities[i / 3].y *= -1
            if (Math.abs(positions[i + 2]) > 5) velocities[i / 3].z *= -1
        }

        particleSystem.geometry.attributes.position.needsUpdate = true
        particleSystem.rotation.x += 0.0005
        particleSystem.rotation.y += 0.0005
    })

    renderer.render(scene, camera)
}

init()

class TypeWriter 
{
    constructor(elementId, texts, options = {}) 
    {
        this.element = document.getElementById(elementId)
        this.texts = texts
        this.speed = options.speed || 70
        this.deleteSpeed = options.deleteSpeed || 40
        this.delay = options.delay || 2000
        this.loop = options.loop !== false
        this.index = 0
        this.text = ''
        this.isDeleting = false
        this.type()
    }

    type() 
    {
        const current = this.index % this.texts.length
        const fullText = this.texts[current]

        if (this.isDeleting) 
        {
            this.text = fullText.substring(0, this.text.length - 1)
        } 
        else 
        {
            this.text = fullText.substring(0, this.text.length + 1)
        }

        this.element.innerHTML = this.text

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed

        if (!this.isDeleting && this.text === fullText) 
        {
            typeSpeed = this.delay
            this.isDeleting = true
        } 
        else if (this.isDeleting && this.text === '') 
        {
            this.isDeleting = false
            this.index++
            if (!this.loop && this.index >= this.texts.length) return
            typeSpeed = 500
        }

        setTimeout(() => this.type(), typeSpeed)
    }
}

const changingTexts = [
    "Software Engineering",
    "Web Development", 
    "Digital Design"
]

document.addEventListener('DOMContentLoaded', () => {
    new TypeWriter('changing-text', changingTexts, {
        speed: 80,
        deleteSpeed: 30,
        delay: 1500,
        loop: true
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year-range")
    const currentYear = new Date().getFullYear()
    yearSpan.textContent = `2024 - ${currentYear}`
})
