import * as THREE from 'three';

export function createSmokyNode(size = 5) {
    const group = new THREE.Group();

    // 创建半透明球体
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        sphereMaterial
    );
    group.add(sphere);

    // 创建烟雾粒子系统
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = size * (1.2 + Math.random() * 0.8);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // 使用柔和的颜色
        colors[i * 3] = 0.5 + Math.random() * 0.5;     // R
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // G
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.5; // B

        sizes[i] = Math.random() * size * 0.2;
        lifetimes[i] = Math.random();
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particles.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

    // 创建圆形粒子纹理
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // 绘制圆形粒子
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);

    // 创建烟雾材质
    const smokeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pointTexture: { value: particleTexture }
        },
        vertexShader: `
            attribute float size;
            attribute float lifetime;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vLifetime;
            void main() {
                vColor = color;
                vLifetime = lifetime;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            varying float vLifetime;
            void main() {
                float opacity = sin(vLifetime * 10.0 + time) * 0.5 + 0.5;
                vec4 texColor = texture2D(pointTexture, gl_PointCoord);
                gl_FragColor = vec4(vColor, opacity * texColor.a);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const smokeParticles = new THREE.Points(particles, smokeMaterial);
    group.add(smokeParticles);

    // 添加发光效果
    const glowMaterial = new THREE.SpriteMaterial({
        map: particleTexture,
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.5
    });

    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(size * 4, size * 4, 1);
    group.add(glow);

    // 动画效果
    let time = 0;
    const animate = () => {
        time += 0.01;
        
        const positions = particles.attributes.position.array;
        const lifetimes = particles.attributes.lifetime.array;
        
        for (let i = 0; i < particleCount; i++) {
            lifetimes[i] += 0.01;
            if (lifetimes[i] > 1) lifetimes[i] = 0;

            const theta = time + i * 0.1;
            const radius = size * (1.2 + Math.sin(lifetimes[i] * Math.PI) * 0.8);
            
            positions[i * 3] += Math.sin(theta) * 0.02;
            positions[i * 3 + 1] += Math.cos(theta) * 0.02;
            positions[i * 3 + 2] += (Math.random() - 0.5) * 0.02;

            const dist = Math.sqrt(
                positions[i * 3] * positions[i * 3] +
                positions[i * 3 + 1] * positions[i * 3 + 1] +
                positions[i * 3 + 2] * positions[i * 3 + 2]
            );

            if (dist > size * 2) {
                const phi = Math.acos(2 * Math.random() - 1);
                const theta = Math.random() * Math.PI * 2;
                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi);
            }
        }

        particles.attributes.position.needsUpdate = true;
        particles.attributes.lifetime.needsUpdate = true;
        smokeMaterial.uniforms.time.value = time;

        const scale = size * (4 + Math.sin(time) * 0.5);
        glow.scale.set(scale, scale, 1);

        requestAnimationFrame(animate);
    };
    animate();

    return group;
}