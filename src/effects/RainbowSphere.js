import * as THREE from 'three';

export function createRainbowSphere(size) {
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        shininess: 100,
        specular: 0xffffff,
        envMap: new THREE.CubeTextureLoader()
            .load([
                'px.jpg', 'nx.jpg',
                'py.jpg', 'ny.jpg',
                'pz.jpg', 'nz.jpg'
            ]),
        refractionRatio: 0.98,
        reflectivity: 0.9
    });

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(size || 5, 32, 32),
        material
    );

    // 添加彩虹动画
    const hueShift = () => {
        const hue = (Date.now() % 3000) / 3000;
        material.color.setHSL(hue, 1, 0.5);
        requestAnimationFrame(hueShift);
    };
    hueShift();

    return sphere;
}