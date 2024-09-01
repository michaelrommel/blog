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

	const mainLight = new THREE.PointLight(0xffffff, 10000, 200, 1.5);
	mainLight.power = 200000;
	mainLight.position.set(-80, 100, 50);
	scene.add(mainLight);

	const fillLight = new THREE.PointLight(0xffffff, 1000, 0, 2);
	fillLight.power = 100000;
	fillLight.position.set(100, -100, -100);
	scene.add(fillLight);

	const ambientLight = new THREE.AmbientLight(0x888888);
	scene.add(ambientLight);

	// so many lights
	const toplight = new THREE.DirectionalLight(0xffffff, 4);
	toplight.position.set(0, 1, 0);
	scene.add(toplight);

	const bottomlight = new THREE.DirectionalLight(0xffffff, 0.5);
	bottomlight.position.set(0, -1, 0);
	scene.add(bottomlight);

	const frontlight = new THREE.DirectionalLight(0xffffff, 1);
	frontlight.position.set(0, 0, 1);
	scene.add(frontlight);

	const backlight = new THREE.DirectionalLight(0xffffff, 0.2);
	backlight.position.set(0, 0, -1);
	scene.add(backlight);

	const rightlight = new THREE.DirectionalLight(0xffffff, 0.4);
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
			`http://localhost:5173/${stl}`,
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

	function moveCamera(zoom) {
		camera.position.x *= zoom;
		camera.position.y *= zoom;
		camera.position.z *= zoom;
	}

	let renderer;

	const animate = () => {
		requestAnimationFrame(animate);
		if (mesh) {
			// 	// mesh.rotation.x += 0.01;
			// 	mesh.rotation.y += 0.005;
			if (!initialZoom) {
				const bbox = new THREE.Box3().setFromObject(mesh);
				if (bbox.max.x - bbox.min.x < 100) {
					moveCamera(0.3);
					initialZoom = true;
				}
			}
		}
		renderer.render(scene, camera);
	};

	const resize = () => {
		renderer.setSize(800, 600);
		camera.updateProjectionMatrix();
	};

	const renderScene = (el) => {
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: el,
		});
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;

		resize();
		animate();
	};

	//window.addEventListener("resize", resize);
	let el;
	onMount(() => {
		loadStl();
		renderScene(el);
	});
</script>

<canvas style="background-color: #33333a" bind:this={el}></canvas>
