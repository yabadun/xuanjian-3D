import * as THREE from 'three';
export function createSimpleTaichiSphere(size) {
    const group = new THREE.Group();
    
    // 创建白色半球
    const whiteHemisphere = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            shininess: 100
        })
    );
    
    // 创建黑色半球
    const blackHemisphere = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        new THREE.MeshPhongMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5,
            shininess: 100
        })
    );
    
    // 创建黑点
    const blackDot = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.2, 16, 16),
        new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    blackDot.position.y = size * 0.5;
    
    // 创建白点
    const whiteDot = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.2, 16, 16),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    );
    whiteDot.position.y = -size * 0.5;
    
    group.add(whiteHemisphere);
    group.add(blackHemisphere);
    group.add(blackDot);
    group.add(whiteDot);
    
    // 添加旋转动画
    const animate = () => {
        group.rotation.x += 0.01;
        group.rotation.y += 0.01;
        requestAnimationFrame(animate);
    };
    animate();
    
    return group;
}