<script>
	import { onMount } from "svelte";

	import * as THREE from "three";
	import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

	export let stl;
	console.log(stl);

	const stlLoader = new STLLoader();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x3c3836);

	// const camera = new THREE.OrthographicCamera(-60, 60, 45, -45, 0.1, 1000);
	const camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 10000);
	camera.position.x = 150;
	camera.position.y = 180;
	camera.position.z = 350;

	const roomgeometry = new THREE.BoxGeometry();
	roomgeometry.deleteAttribute("uv");
	const roomMaterial = new THREE.MeshStandardMaterial({
		side: THREE.BackSide,
		color: "#999999",
		transparent: true,
		opacity: 0.3,
	});

	const room = new THREE.Mesh(roomgeometry, roomMaterial);
	room.position.set(-10, 10, 10);
	room.scale.set(300, 300, 300);
	// scene.add(room);

	const ambientLight = new THREE.AmbientLight(0x888888, 4);
	scene.add(ambientLight);

	const mainLight = new THREE.PointLight(0xffffff, 10000, 0, 1.5);
	mainLight.power = 100000;
	mainLight.position.set(-80, 100, 50);
	scene.add(mainLight);

	const fillLight = new THREE.PointLight(0xffffff, 10000, 0, 1.5);
	fillLight.power = 50000;
	fillLight.position.set(100, -100, -100);
	scene.add(fillLight);

	const backspotlight = new THREE.SpotLight(0xffffff, 10000);
	backspotlight.power = 20000;
	backspotlight.position.set(30, 30, -100);
	backspotlight.angle = Math.PI / 2;
	backspotlight.decay = 1.5;
	scene.add(backspotlight);

	// so many lights
	const toplight = new THREE.DirectionalLight(0xffffff, 4);
	toplight.position.set(0, 1, 0);
	scene.add(toplight);

	const bottomlight = new THREE.DirectionalLight(0xffffff, 1.5);
	bottomlight.position.set(0, -1, 0);
	scene.add(bottomlight);

	const frontlight = new THREE.DirectionalLight(0xffffff, 1.5);
	frontlight.position.set(0, 0, 1);
	scene.add(frontlight);

	const backlight = new THREE.DirectionalLight(0xffffff, 1.5);
	backlight.position.set(0, 0, -1);
	scene.add(backlight);

	const rightlight = new THREE.DirectionalLight(0xffffff, 1);
	rightlight.position.set(1, 0, 0);
	scene.add(rightlight);

	const leftlight = new THREE.DirectionalLight(0xffffff, 0.4);
	leftlight.position.set(-1, 0, 0);
	scene.add(leftlight);

	let mesh = null;

	function loadStl() {
		// const bluematerial = new THREE.MeshLambertMaterial({ color: "#076678" });
		// bluematerial.combine = THREE.MultiplyOperation;
		// bluematerial.reflectivity = 1;

		// const bluematerial = new THREE.MeshMatcapMaterial({
		// 	color: 0x076678,
		// 	matcap: new THREE.TextureLoader().load("http://localhost:5173/porcelain.jpg"),
		// });

		const bluematerial = new THREE.MeshPhongMaterial();
		bluematerial.emissive = new THREE.Color("#080808");
		// bluematerial.transparent = true;
		// bluematerial.opacity = 0.8;
		bluematerial.color = new THREE.Color("#076678");
		bluematerial.specular = new THREE.Color("#111111");
		bluematerial.depthTest = true;
		bluematerial.depthWrite = true;
		bluematerial.shininess = 100;
		bluematerial.combine = THREE.MultiplyOperation;
		bluematerial.side = THREE.DoubleSide;
		bluematerial.reflectivity = 0.8;

		// // textures and bumpmaps work with simple geometries,
		// // but not with the STL loaded geometry!
		// const texture = new THREE.TextureLoader().load(
		// 	"http://localhost:5173/grainy_stucco_albedo.png",
		// );
		// bluematerial.map = texture;
		//
		// const bm = new THREE.TextureLoader().load(
		// 	"http://localhost:5173/earth_bumpmap.jpg",
		// );
		// bluematerial.bumpMap = bm;
		// bluematerial.bumpScale = 3;
		//
		// const geometry = new THREE.BoxGeometry(20, 20, 20);
		// const cube = new THREE.Mesh(geometry, bluematerial);
		// scene.add(cube);

		let bbox = null;

		stlLoader.load(
			`${stl}`,
			(geometry) => {
				geometry.rotateX(THREE.MathUtils.degToRad(-90));
				mesh = new THREE.Mesh(geometry, bluematerial);
				mesh.geometry.computeVertexNormals(true);
				mesh.geometry.center();
				scene.add(mesh);
			},
			(error) => {
				console.log(error);
			},
		);
	}

	let initialZoom = false;

	function moveCamera(factor) {
		camera.position.x *= factor;
		camera.position.y *= factor;
		camera.position.z *= factor;
	}

	let canvasWidth = null;
	let canvasHeight = null;
	let updateSize = false;

	let renderer;
	let controls;

	const animate = () => {
		requestAnimationFrame(animate);
		if (mesh) {
			// 	// mesh.rotation.x += 0.01;
			// 	mesh.rotation.y += 0.005;
			if (!initialZoom) {
				const bbox = new THREE.Box3().setFromObject(mesh);
				if (bbox.max.x - bbox.min.x < 100) {
					moveCamera(0.3);
				}
				initialZoom = true;
			}

			controls.update();
		}
		if (el && canvasWidth && updateSize) {
			console.log("resizing canvas, renderer and camera");
			// we have a canvas element assigned
			el.width = canvasWidth;
			el.height = canvasHeight;
			renderer.setSize(canvasWidth, canvasHeight, false);
			camera.aspect = canvasWidth / canvasHeight;
			camera.updateProjectionMatrix();
			updateSize = false;
		}
		renderer.render(scene, camera);
	};

	const resize = () => {
		console.log("resize event");
		if (el) {
			canvasWidth = el.clientWidth;
			canvasHeight = el.clientHeight;
			updateSize = true;
		}
	};

	const renderScene = (el) => {
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: el,
		});
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.1;

		resize();
		animate();
	};

	const observer = new ResizeObserver(resize);

	let el;
	onMount(() => {
		loadStl();
		renderScene(el);
		observer.observe(el);
	});
</script>

<canvas class="min-w-full max-w-full bg-gruvdbg2 block" bind:this={el}></canvas>

<style>
</style>
