<script>
	import { onMount } from "svelte";

	import * as THREE from "three";
	import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
	import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

	// this letx us access props passed in as key/value pairs to the
	// StlViewer component from a page that embeds it.
	export let file;
	export let dpr;

	// we need those variables in different functions and do not always have
	// the ability to supplu those as parameters
	// global store for the meshes, once they have been loaded and initialized. A STL file
	// can contain multiple solids
	let loaded = false;
	// the WebGL renderer
	let renderer = null;
	// the Orbit controls
	let controls = null;
	// stor for the canvas DOM element
	let canvasElement = null;
	// flag, if we have set an initial zoom directly after loading the STL
	let initialZoom = false;
	// the global scene and camera objects
	let scene = null;
	let camera = null;

	// the map stores for each canvas the sizes they should be displayed in pixels
	const canvasToDisplaySizeMap = new Map();

	function initScene() {
		// initialize the scene to which all elements are added
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x3c3836);

		// const roomgeometry = new THREE.BoxGeometry();
		// roomgeometry.deleteAttribute("uv");
		// const roomMaterial = new THREE.MeshStandardMaterial({
		// 	side: THREE.BackSide,
		// 	color: "#999999",
		// 	transparent: true,
		// 	opacity: 0.3,
		// });
		//
		// const room = new THREE.Mesh(roomgeometry, roomMaterial);
		// room.position.set(-10, 10, 10);
		// room.scale.set(300, 300, 300);
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

		return scene;
	}

	function initCamera() {
		// const camera = new THREE.OrthographicCamera(-60, 60, 45, -45, 0.1, 1000);
		const camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 10000);
		// camera.position.set(-0.1, 0.1, 0.1);
		camera.position.set(150, 180, 350);
		// camera.position.x = 150;
		// camera.position.y = 180;
		// camera.position.z = 350;
		return camera;
	}

	function loadMaterial() {
		// const bluematerial = new THREE.MeshLambertMaterial({ color: "#076678" });
		// bluematerial.combine = THREE.MultiplyOperation;
		// bluematerial.reflectivity = 1;

		// const bluematerial = new THREE.MeshMatcapMaterial({
		// 	color: 0x076678,
		// 	matcap: new THREE.TextureLoader().load("http://localhost:5173/porcelain.jpg"),
		// });

		const material = new THREE.MeshPhongMaterial();
		material.emissive = new THREE.Color("#080808");
		// bluematerial.transparent = true;
		// bluematerial.opacity = 0.8;
		material.color = new THREE.Color("#076678");
		material.specular = new THREE.Color("#111111");
		material.depthTest = true;
		material.depthWrite = true;
		material.shininess = 100;
		material.combine = THREE.MultiplyOperation;
		material.side = THREE.DoubleSide;
		material.reflectivity = 0.8;

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
		return material;
	}

	function loadStl() {
		const bluematerial = loadMaterial();

		new STLLoader().load(
			`articles/assets/${file}`,
			(geometry) => {
				geometry.rotateX(THREE.MathUtils.degToRad(-90));
				const mesh = new THREE.Mesh(geometry, bluematerial);
				mesh.geometry.computeVertexNormals(true);
				mesh.geometry.center();
				scene.add(mesh);
				// meshes.push(mesh);
				console.log("Added a geometry");
			},
			(progressEvent) => {
				console.log(
					`Loading STL: ${Math.round((100 * progressEvent.loaded) / progressEvent.total)}%`,
				);
			},
			(error) => {
				console.log(error);
			},
		);
		loaded = true;
	}

	function loadGltf() {
		const templatematerial = loadMaterial();
		const loader = new GLTFLoader();
		loader.setPath("articles/assets/");
		loader.load(
			`${file}`,
			async (gltf) => {
				const model = gltf.scene;
				model.scale.set(1000, 1000, 1000);
				model.traverse((child) => {
					if (child.isMesh) {
						const colour = child.material.color;
						const newmaterial = templatematerial.clone();
						newmaterial.color = colour;
						child.material = newmaterial;
					}
				});
				// gltf.parser.getDependencies("material").then((materials) => {
				// 	console.log(materials);
				// });
				await renderer.compileAsync(model, camera, scene);
				scene.add(model);
				loaded = true;
			},
			(progressEvent) => {
				console.log(
					`Loading GLTF: ${Math.round((100 * progressEvent.loaded) / progressEvent.total)}%`,
				);
			},
			(error) => {
				console.log(error);
			},
		);
	}

	function moveCamera(factor) {
		camera.position.x *= factor;
		camera.position.y *= factor;
		camera.position.z *= factor;
	}

	function animate() {
		requestAnimationFrame(animate);
		// if (meshes.length > 0) {
		if (loaded) {
			if (!initialZoom) {
				// let maxWidth = 0;
				//for (const mesh of meshes) {
				// const bbox = new THREE.Box3().setFromObject(mesh);
				const bbox = new THREE.Box3().setFromObject(scene);
				const size = bbox.getSize(new THREE.Vector3());
				const maxWidth = size.x;
				//if (width > maxWidth) maxWidth = width;
				//}
				if (maxWidth < 100) {
					moveCamera(0.2);
				}
				initialZoom = true;
			}
		}
		controls.update();
		resizeCanvasToDisplaySize(canvasElement);
		renderer.render(scene, camera);
	}

	function renderScene(canvasElement) {
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: canvasElement,
		});
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.1;

		resizeCanvasToDisplaySize(canvasElement);
		animate();
	}

	function resizeCanvasToDisplaySize(canvasElement) {
		// we might get called early, where the canvas is not set yet
		if (canvasElement) {
			// Get the size the browser is displaying the canvas in device pixels.
			const [displayWidth, displayHeight] =
				canvasToDisplaySizeMap.get(canvasElement);

			// Check if the canvas is not the same size.
			const needResize =
				canvasElement.width !== displayWidth ||
				canvasElement.height !== displayHeight;

			if (needResize) {
				console.log(
					`resizing canvas, renderer and camera: width: ${canvasElement.width} -> ${displayWidth}`,
				);

				// Make the canvas the same size
				canvasElement.width = displayWidth;
				canvasElement.height = displayHeight;

				renderer.setSize(displayWidth, displayHeight, false);
				camera.aspect = displayWidth / displayHeight;
				camera.updateProjectionMatrix();
			}

			return needResize;
		}
	}

	function onResize(entries) {
		for (const entry of entries) {
			// the following was taken from an article about canvas resizing
			// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
			// In essence we do not use clientWidth of the canvas, because that is in
			// CSS pixels including any padding (which would reduce the available size)
			// and those pixels are Integer numbers.
			let width;
			let height;
			let devicePixelRatio = window.devicePixelRatio;
			// let the page linking to the component decicde whether or not to enable
			// honouring the devicePixelRatio. A user might want to disable this in case
			// it uses too much power.
			if (dpr && dpr == true) {
				// If the user has a High DPI display or they zoomed in/out, the image will
				// look blurry. Therefore we need to account for the devicePixelRatio.
				if (entry.devicePixelContentBoxSize) {
					// This is the preferred method using ResizeObserver, but it is
					// notuniforely available in all browsers, they have different
					// implementations and need this case clauses.
					// NOTE: Only this path gives the correct answer
					// The other 2 paths are an imperfect fallback
					// for browsers that don't provide anyway to do this
					width = entry.devicePixelContentBoxSize[0].inlineSize;
					height = entry.devicePixelContentBoxSize[0].blockSize;
					devicePixelRatio = 1; // it's already in width and height
				} else if (entry.contentBoxSize) {
					if (entry.contentBoxSize[0]) {
						width = entry.contentBoxSize[0].inlineSize;
						height = entry.contentBoxSize[0].blockSize;
					} else {
						// legacy
						width = entry.contentBoxSize.inlineSize;
						height = entry.contentBoxSize.blockSize;
					}
				} else {
					// legacy
					width = entry.contentRect.width;
					height = entry.contentRect.height;
				}
			} else {
				width = entry.target.clientWidth;
				height = entry.target.clientHeight;
				devicePixelRatio = 1;
			}
			// apply the ratio factor
			const displayWidth = Math.round(width * devicePixelRatio);
			const displayHeight = Math.round(height * devicePixelRatio);
			canvasToDisplaySizeMap.set(entry.target, [
				displayWidth,
				displayHeight,
			]);
		}
	}

	// we can do this initialization already while we are waiting for the
	// component to mount
	scene = initScene();
	camera = initCamera();

	onMount(() => {
		if (file.endsWith(".stl")) {
			loadStl();
		} else if (file.endsWith(".gltf")) {
			loadGltf();
		}
		canvasToDisplaySizeMap.set(canvasElement, [300, 150]);
		renderScene(canvasElement);
		const observer = new ResizeObserver(onResize);
		observer.observe(canvasElement);
	});
</script>

<canvas
	class="min-w-full max-w-full bg-gruvdbg2 block"
	bind:this={canvasElement}
></canvas>

<style>
</style>
