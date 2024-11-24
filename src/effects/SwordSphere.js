import * as THREE from 'three';

export function createSwordSphere(size = 5) {
    const group = new THREE.Group();

    // 创建半透明球体
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5
    });

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        sphereMaterial
    );
    group.add(sphere);

    // 创建更精致的剑
    const sword = new THREE.Group();

    // 剑身材质
    const bladeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x666666,
        emissiveIntensity: 0.2
    });

    // 剑柄材质
    const handleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xc0c0c0,
        metalness: 0.7,
        roughness: 0.3
    });

    // 装饰材质
    const decorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.1
    });

    // 创建剑身
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.15, 2);    // 剑尖
    bladeShape.lineTo(0.3, 1.8);   // 剑身右边
    bladeShape.lineTo(0.35, 0.2);  // 剑身收窄
    bladeShape.lineTo(0, 0);       // 闭合路径

    const extrudeSettings = {
        steps: 1,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3
    };

    const blade = new THREE.Mesh(
        new THREE.ExtrudeGeometry(bladeShape, extrudeSettings),
        bladeMaterial
    );
    blade.scale.set(size * 0.2, size * 0.2, size * 0.2);

    // 创建护手
    const guardGeometry = new THREE.BoxGeometry(size * 0.3, size * 0.05, size * 0.05);
    const guard = new THREE.Mesh(guardGeometry, decorMaterial);
    guard.position.y = -size * 0.1;

    // 创建装饰性护手曲线
    const guardCurve1 = new THREE.Mesh(
        new THREE.TorusGeometry(size * 0.15, size * 0.02, 16, 32, Math.PI),
        decorMaterial
    );
    guardCurve1.rotation.z = Math.PI;
    guardCurve1.position.y = -size * 0.1;

    // 创建剑柄
    const handle = new THREE.Group();
    
    // 主柄
    const mainHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(size * 0.05, size * 0.06, size * 0.4, 8),
        handleMaterial
    );
    mainHandle.position.y = -size * 0.3;
    
    // 装饰环
    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(size * 0.07, size * 0.02, 8, 16),
        decorMaterial
    );
    ring1.position.y = -size * 0.15;
    
    const ring2 = ring1.clone();
    ring2.position.y = -size * 0.45;

    // 剑柄底部装饰
    const pommel = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.08, 16, 16),
        decorMaterial
    );
    pommel.position.y = -size * 0.5;

    // 组装剑
    handle.add(mainHandle);
    handle.add(ring1);
    handle.add(ring2);
    handle.add(pommel);

    sword.add(blade);
    sword.add(guard);
    sword.add(guardCurve1);
    sword.add(handle);

    // 调整剑的整体位置和角度
    sword.rotation.z = Math.PI / 6;
    sword.position.y = size * 0.2;

    group.add(sword);

    // 添加发光效果
    const glow = new THREE.PointLight(0xffffff, 1, size * 2);
    glow.position.set(0, 0, 0);
    group.add(glow);

    // 添加光环
    const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });

    const halo = new THREE.Mesh(
        new THREE.RingGeometry(size * 1.2, size * 1.4, 32),
        haloMaterial
    );
    halo.rotation.x = Math.PI / 2;
    group.add(halo);

    // 动画效果
    const animate = () => {
        // 球体呼吸效果
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.02;
        sphere.scale.set(scale, scale, scale);

        // 剑缓慢旋转
        sword.rotation.y += 0.01;

        // 光晕强度变化
        glow.intensity = 1 + Math.sin(Date.now() * 0.002) * 0.3;

        // 光环旋转
        halo.rotation.z += 0.005;
        halo.material.opacity = 0.2 + Math.sin(Date.now() * 0.001) * 0.1;

        requestAnimationFrame(animate);
    };
    animate();

    return group;
}