import '../style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import SceneManager from './sceneManager/scene';
import gsap from 'gsap';

import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

const gui = new dat.GUI();
const debugObject = {};

//scene
const canvas = document.querySelector('#canvas');
const scene = new SceneManager(canvas);
let conf = { color : '#a48c5d' }; 
scene.scene.background.set(conf.color);
scene.addOrbitControl();
scene.addFog(1,100,conf.color);

//fog GUI
const fogFolder = gui.addFolder('FOG');
fogFolder.add(scene.scene.fog, 'near').min(1).max(100).step(0.01).listen();
fogFolder.add(scene.scene.fog, 'far').min(1).max(100).step(0.01).listen();
fogFolder.addColor(conf, 'color').onChange((color)=>{
	scene.scene.fog.color.set(color);
	scene.scene.background.set(color);
	conf.color = color;
});
const axesHelper = new THREE.AxesHelper(5);

//lights
const directionalLight = new THREE.DirectionalLight(0xFFFFFF,1);
directionalLight.position.set(10,10,10);
scene.add(directionalLight);
const ambiantLight = new THREE.AmbientLight(0xFFFFFF,1);
scene.add(ambiantLight);

//plane 
const width = 240;  
const height = 240; 
const geometry = new THREE.PlaneGeometry(5,5,100,100);

//color 
debugObject.depthColor = "#9d0202";
debugObject.surfaceColor = "#bb8427";

const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	side:THREE.DoubleSide,
	uniforms:{
		uTime:{ value: 0 },

		uElevation:{ value: 0.2 },
		uFrequency:{ value: new THREE.Vector2(4, 1.5)},
		uWaveSpeed:{value: 0.5 },

		uSmallWavesElevation: {value: 0.622 },
		uSmallWavesFrequency: {value: 1.589 },
		uSmallWavesSpeed: {value: 0.371 },
		uSmallWavesIterations: {value: 4 },

		//color 
		uDepthColor:{ value: new THREE.Color(debugObject.depthColor)},
		uSurfaceColor:{ value: new THREE.Color(debugObject.surfaceColor)},
		uColorOffset:{ value: 0.501 },
		uColorMultiplier:{ value: 1.692}

	},
});
const plane = new THREE.Mesh(geometry,material);
plane.rotation.x = Math.PI * 1.50;
scene.add(plane);
gui.add(material, 'wireframe').name('Plane WireFrame');

const wavesGui = gui.addFolder('Waves');
wavesGui.add(material.uniforms.uElevation, 'value').min(0).max(1).step(0.001).name('Elevation');
wavesGui.add(material.uniforms.uFrequency.value, 'x').min(0).max(10).step(0.001).name('FrequencyX');
wavesGui.add(material.uniforms.uFrequency.value, 'y').min(0).max(10).step(0.001).name('FrequencyY');
wavesGui.add(material.uniforms.uWaveSpeed, 'value').min(0).max(10).step(0.001).name('WaveSpeed');

wavesGui.addColor(debugObject, 'depthColor').name('DepthColor').onChange(() => {
		material.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
wavesGui.addColor(debugObject, 'surfaceColor').name('SurfaceColor').onChange(() => {
	material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});
wavesGui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('Color Offset');
wavesGui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('Color Multiplier');

const sWavesGui = gui.addFolder('Small Waves');
sWavesGui.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('Elevation');
sWavesGui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.001).name('Frequency');
sWavesGui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('Speed');
sWavesGui.add(material.uniforms.uSmallWavesIterations, 'value').min(1).max(4).step(1).name('Iteration');



const clock = new THREE.Clock();

const animate = () => {
	const elapsedTime = clock.getElapsedTime();

	//update
	material.uniforms.uTime.value = elapsedTime;

	scene.onUpdate();
	scene.onUpdateStats();
	requestAnimationFrame( animate );
};

animate();