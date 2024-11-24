import * as THREE from 'three';

import ForceGraph3D from '3d-force-graph';
import { createSimpleTaichiSphere } from './effects/TaichiSphere';
import { createRainbowSphere } from './effects/RainbowSphere';
import { createSmokyNode } from './effects/SmokyNode';
import { createSwordSphere } from './effects/SwordSphere';

import data from './test.json' assert { type: 'json' };

ForceGraph3D.THREE = THREE;


// 加载并处理数据
const processedData = processData(data);
// 处理数据，建立父子关系
function processData(data) {

    data.nodes.forEach(node => {
        // node.visible = (node.id < 10 ? true : false);  // 初始状态为收缩
        node.visible = true;
    });

    data.links.forEach(link => {
        // link.visible = false;
        link.visible = true;
    });

    return data;
}
// 获取经过剪枝的数据
function getPrunedTree(clickNode) {

    const unVisibleNodes = [];
    
    processedData.links.forEach(link => {
        if (link.source.id === clickNode.id) {
            link.visible = !link.visible;
            processedData.nodes.forEach(node => {
                if (node.id === link.target.id && node.id > 10) {
                    node.visible = !node.visible;
                    if (!node.visible) {
                        unVisibleNodes.push(node);
                    }
                }
            });
        }
    });
    unVisibleNodes.forEach(node => {
        visibleChange(node);
    });
    return processedData;
}

function visibleChange(parentNode) {
    parentNode.visible = false;
    processedData.links.forEach(link => {
        if (link.source.id === parentNode.id) {

            link.visible = false;
            visibleChange(link.target);
        }
    });
}









// 创建图表实例
const Graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
    .graphData(processedData)
    .nodeLabel('name')
    .nodeColor(() => '#D4AF37')
    .nodeThreeObject(node => {
        if (node.id === 7) {
            return createRainbowSphere(node.size || 5);
        }
        if (node.id === 1) {
            return createSimpleTaichiSphere(node.size || 5);
        }
        if (node.id === 6) {
            return createSwordSphere(node.size || 5);
        }
        if (node.id === 3) {
            return createSmokyNode(node.size || 5);
        }
        return null;
    })
    .nodeRelSize(6)
    .nodeVisibility('visible')
    .linkDirectionalParticles(2)
    .linkVisibility('visible')
    .nodeVal(node => node.size)
    .linkWidth(link => link.value * 2)
    .linkColor(() => '#ffffff')
    .backgroundColor('#1A1A1A')
    .onNodeClick(node => {
        Graph.graphData(getPrunedTree(node));
    });



// 窗口大小调整
window.addEventListener('resize', () => {
    Graph.width(window.innerWidth);
    Graph.height(window.innerHeight);
});