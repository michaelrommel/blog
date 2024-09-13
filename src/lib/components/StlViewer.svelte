<script>
	import { onMount } from "svelte";

	import Info from "lucide-svelte/icons/info";
	import * as Popover from "$lib/components/ui/popover";
	import { Slider } from "$lib/components/ui/slider";
	import { Button } from "$lib/components/ui/button";

	import * as THREE from "three";
	import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
	import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

	// this letx us access props passed in as key/value pairs to the
	// StlViewer component from a page that embeds it.
	export let file;
	export let dpr;
	export let inertia;
	let inertiaOverride = [inertia];
	let lightIntensityFactor = [10];
	let fps;

	// we need those variables in different functions and do not always have
	// the ability to supplu those as parameters
	// marker for when loading of the meshes has finished
	let loaded = false;
	let firstView = false;
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
	let modelsRoot = null;
	let yUpRoot = null;
	let zUpRoot = null;
	let lightsRoot = null;
	let camLightsRoot = null;
	let camera = null;

	// let observerCamera = null;
	// let cameraHelper = null;

	// the map stores for each canvas the sizes they should be displayed in pixels
	const canvasToDisplaySizeMap = new Map();

	function initScene() {
		// initialize the scene to which all elements are added
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x3c3836);
		// this is a sub-container where the rest of the normal models/scenes/controls
		// should be added.
		// Add a root for all models
		let modelsRoot = new THREE.Group();
		scene.add(modelsRoot);
		// Y Axis as Up is the standard in three.js
		let yUpRoot = new THREE.Group();
		modelsRoot.add(yUpRoot);
		// // this sub-group gets the models e.g. STL files, where the Z-Axis is actually
		// // up, so that there is no difference in CAD and the Viewer and the user is not
		// // confused about the models
		let zUpRoot = new THREE.Group();
		zUpRoot.rotation.x = -Math.PI * 0.5;
		// this adds a small oritation arrow coordinates display to the center of the scene
		const axesHelper = new THREE.AxesHelper(5);
		zUpRoot.add(axesHelper);
		modelsRoot.add(zUpRoot);
		// here we collect all our lights, that move with the scene
		let lightsRoot = new THREE.Group();
		scene.add(lightsRoot);

		return [scene, modelsRoot, yUpRoot, zUpRoot, lightsRoot];
	}

	function initCamera() {
		// const camera = new THREE.OrthographicCamera(-60, 60, 45, -45, 0.1, 1000);
		// const camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 10000);
		const camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 10000);
		// here we collect all our lights, that move with the camera
		let camLightsRoot = new THREE.Group();
		camera.add(camLightsRoot);
		// need to add the camera to the scene, otherwise the subordinate lights
		// are not drawn
		scene.add(camera);

		// observerCamera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 10000);
		// scene.add(observerCamera);
		return [camera, camLightsRoot];
	}

	function initCamLights(size) {
		const diag = Math.sqrt(
			size.x * size.x + size.y * size.y + size.z * size.z,
		);

		const mainLight = new THREE.SpotLight(0xffffff, 2);
		mainLight.baseIntensity = 2;
		const pml = new THREE.Spherical(
			1 * diag,
			(Math.PI / 180) * 50,
			(Math.PI / 180) * -70,
		);
		const posml = new THREE.Vector3().setFromSpherical(pml);
		mainLight.position.set(posml.x, posml.y, posml.z);
		mainLight.angle = Math.PI / 3;
		mainLight.decay = 0;
		camLightsRoot.add(mainLight);

		const fillLight = new THREE.SpotLight(0xffffff, 2);
		fillLight.baseIntensity = 2;
		const pfl = new THREE.Spherical(
			1 * diag,
			(Math.PI / 180) * 60,
			(Math.PI / 180) * 70,
		);
		const posfl = new THREE.Vector3().setFromSpherical(pfl);
		fillLight.position.set(posfl.x, posfl.y, posfl.z);
		fillLight.angle = Math.PI / 3;
		fillLight.decay = 0;
		camLightsRoot.add(fillLight);

		const hairLight = new THREE.SpotLight(0xffffff, 1);
		hairLight.baseIntensity = 1;
		const phsl = new THREE.Spherical(
			4 * diag,
			(Math.PI / 180) * -60,
			(Math.PI / 180) * 10,
		);
		const poshsl = new THREE.Vector3().setFromSpherical(phsl);
		hairLight.position.set(poshsl.x, poshsl.y, poshsl.z);
		hairLight.angle = Math.PI / 3;
		hairLight.decay = 0;
		camLightsRoot.add(hairLight);

		// const spotLightHelper = new THREE.SpotLightHelper(mainLight);
		// modelsRoot.add(spotLightHelper);
	}

	function changeLightIntensity(next) {
		for (const light of camLightsRoot.children) {
			light.intensity = (light.baseIntensity * next[0]) / 10;
			console.log(`new: ${light.intensity}`);
		}
		if (loaded) renderer.render(scene, camera);
		// if (loaded) renderer.render(scene, observerCamera);
	}

	function initLights(size) {
		const diag = Math.sqrt(
			size.x * size.x + size.y * size.y + size.z * size.z,
		);
		const norm = 180 + 1.5 * diag;
		console.log(`Diagonal dimension: ${diag}`);
		console.log(`Calculated distance: ${norm}`);

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
		// lightsRoot.add(room);
		// const ambientLight = new THREE.AmbientLight(0x888888, 0.2);
		// lightsRoot.add(ambientLight);

		// so many lights
		const toplight = new THREE.DirectionalLight(0xffffff, 0.3);
		toplight.position.set(0, 100, 30);
		lightsRoot.add(toplight);

		const bottomlight = new THREE.DirectionalLight(0xffffff, 0.1);
		bottomlight.position.set(0, -100, -30);
		lightsRoot.add(bottomlight);

		const frontlight = new THREE.DirectionalLight(0xffffff, 0.3);
		frontlight.position.set(-30, 0, 100);
		lightsRoot.add(frontlight);

		// const frontLightHelper = new THREE.DirectionalLightHelper(frontlight);
		// lightsRoot.add(frontLightHelper);

		const backlight = new THREE.DirectionalLight(0xffffff, 0.1);
		backlight.position.set(-30, 0, -100);
		lightsRoot.add(backlight);

		const rightlight = new THREE.DirectionalLight(0xffffff, 0.3);
		rightlight.position.set(100, 0, 30);
		lightsRoot.add(rightlight);

		const leftlight = new THREE.DirectionalLight(0xffffff, 0.1);
		leftlight.position.set(-100, 0, 30);
		lightsRoot.add(leftlight);
	}

	function resetScene(size) {
		console.log(`Size is: ${size.x} ${size.y} ${size.z}`);
		initLights(size);

		const p = new THREE.Spherical(
			2 * Math.sqrt(size.x * size.x + size.y * size.y + size.z * size.z),
			(Math.PI / 180) * 70,
			(Math.PI / 180) * 30,
		);
		const pos = new THREE.Vector3().setFromSpherical(p);
		console.log(pos);

		// observerCamera.position.set(0, 1000, 0);
		// observerCamera.lookAt(0, 0, 0);
		// scene.add(observerCamera);

		camera.position.set(pos.x, pos.y, pos.z);
		camera.lookAt(0, 0, 0);
		scene.add(camera);
		// cameraHelper = new THREE.CameraHelper(camera);
		// scene.add(cameraHelper);

		initCamLights(size);
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
		// material.side = THREE.FrontSide;
		// material.side = THREE.BackSide;
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
				// geometry.rotateX(THREE.MathUtils.degToRad(-90));
				const mesh = new THREE.Mesh(geometry, bluematerial);
				// mesh.geometry.computeVertexNormals(true);
				mesh.geometry.center();
				zUpRoot.add(mesh);
				console.log("Added a geometry");
				loaded = true;
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
	}

	function loadGltf() {
		const templatematerial = loadMaterial();
		const loader = new GLTFLoader();
		loader.setPath("articles/assets/");
		loader.load(
			`${file}`,
			async (gltf) => {
				const model = gltf.scene;
				// the units are somehow meters. Convertign to millimetrs so that
				// the placement of lights and cameras is consistent with easier to
				// understand numbers
				model.scale.set(1000, 1000, 1000);
				// Take the overall dimensions of the model and shift it, so that
				// the origin is in the center of the model
				const bbox = new THREE.Box3().setFromObject(model);
				const offsetx = (bbox.min.x - bbox.max.x) / 2 - bbox.min.x;
				const offsety = (bbox.min.y - bbox.max.y) / 2 - bbox.min.y;
				const offsetz = (bbox.min.z - bbox.max.z) / 2 - bbox.min.z;
				model.translateX(offsetx);
				model.translateY(offsety);
				model.translateZ(offsetz);
				// replace the default-generated materials with PhongMaterials to
				// achieve a better look, but take over the color and transparency
				model.traverse((child) => {
					if (child.isMesh) {
						const newmaterial = templatematerial.clone();
						newmaterial.color = child.material.color;
						newmaterial.opacity = child.material.opacity;
						newmaterial.transparent = child.material.transparent;
						child.material = newmaterial;
					}
				});
				// gltf.parser.getDependencies("material").then((materials) => {
				// 	console.log(materials);
				// });
				// this can help to avoid flickerung, if textures etc are loaded, but I do
				// not use that (yet)
				//await renderer.compileAsync(model, camera, scene);
				yUpRoot.add(model);
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

	function changeInertia() {
		inertia = inertiaOverride[0];
	}

	// 25 frames per socond is absolutely sufficient for the use case
	const fpsInterval = 1000 / 25;
	let frameCount = 0;
	let then = Date.now();
	let startTime = then;
	let now;
	let elapsed;
	let until = null;

	function animate() {
		now = Date.now();

		let vector = new THREE.Vector3(0, 0, -1);
		vector.applyQuaternion(camera.quaternion);
		console.log(`Camera looks at:`);
		console.log(vector);

		// vector = new THREE.Vector3(0, 0, -1);
		// vector.applyQuaternion(observerCamera.quaternion);
		// console.log(`Observer looks at:`);
		// console.log(vector);

		// first improvement: if there are no changes to the orientation,
		// we do not need to rerender. We just have a small timer in order
		// to let a movement dampen smoothely
		if (until || !initialZoom || !firstView) {
			if (now < until) {
				// keep animating
				requestAnimationFrame(animate);
			} else {
				if (!initialZoom || !firstView) {
					requestAnimationFrame(animate);
				} else {
					// stop until triggered by movement again
					until = null;
				}
			}
		}
		// precaution measure, if there are not models loaded, we cannot
		// determine the bounding box and cannot reset the scene
		if (!initialZoom && loaded) {
			const bbox = new THREE.Box3().setFromObject(modelsRoot);
			const size = bbox.getSize(new THREE.Vector3());
			initialZoom = true;
			resetScene(size);
		}
		// second improvement: only rerender if we are past the framerate
		// virtual next tick. Also, if until has already elapsed, skip rerendering
		// that gets rid of all past fired Control Events, that are now obsolete
		// but still trickling in
		elapsed = now - then;
		if ((!firstView && loaded) || (elapsed > fpsInterval && until)) {
			// we have not drawn an initial render, so if we have loaded
			// the model and reset the scene, then we set the flag and stop
			// rendering without a reason
			if (!firstView && initialZoom && loaded) {
				firstView = true;
			}
			// Get ready for next frame by setting then=now, but...
			// Also, adjust for fpsInterval not being multiple of 16.67
			// from: https://jsfiddle.net/m1erickson/CtsY3/
			// then = now - (elapsed % fpsInterval);
			then = now;

			fps =
				now == startTime
					? "   0.00"
					: String(
							((++frameCount * 1000) / (now - startTime)).toFixed(
								2,
							),
						).padStart(7, " ");
			// console.log(
			// 	`${until ? until - now : 0}/${until}/${elapsed}/${fpsInterval}/${frameCount} :: ${now - startTime} secs @ ${fps} fps`,
			// );

			controls.update();
			resizeCanvasToDisplaySize(canvasElement);
			// cameraHelper.update();
			// camera.updateProjectionMatrix();
			renderer.render(scene, camera);
			// observerCamera.updateProjectionMatrix();
			//renderer.render(scene, observerCamera);
		}
	}

	function renderScene(canvasElement) {
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: canvasElement,
		});
		// controls = new TrackballControls(camera, renderer.domElement);
		// controls.panSpeed = 10;
		// controls.rotateSpeed = 10;

		// controls = new OrbitControls(observerCamera, renderer.domElement);
		controls = new OrbitControls(camera, renderer.domElement);
		controls.addEventListener("change", () => {
			if (!until) {
				startTime = Date.now();
				frameCount = 0;
				if (frameCount < 20) {
					until = new Date(Date.now().valueOf() + inertia);
				}
			}
			animate();
		});
		controls.enableDamping = true;
		controls.dampingFactor = 0.2;

		resizeCanvasToDisplaySize(canvasElement);
		until = new Date(Date.now().valueOf() + 100);
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
				// observerCamera.aspect = displayWidth / displayHeight;
				// observerCamera.updateProjectionMatrix();
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
	[scene, modelsRoot, yUpRoot, zUpRoot, lightsRoot] = initScene();
	[camera, camLightsRoot] = initCamera();

	onMount(() => {
		if (file.endsWith(".stl")) {
			loadStl();
		} else if (file.endsWith(".gltf")) {
			loadGltf();
		}
		// prepopulate with the initial setting of an unstyled canvas element
		canvasToDisplaySizeMap.set(canvasElement, [300, 150]);
		// this initializes the lighting and resets the camera based on the loaded model
		renderScene(canvasElement);
		// initialize a resize observer to keep track of browser changes or device
		// orientation changes, as well as zoom
		const observer = new ResizeObserver(onResize);
		observer.observe(canvasElement);
	});

	let popoverOpen = false;
</script>

<canvas
	class="min-w-full max-w-full bg-gruvdbg2 block"
	bind:this={canvasElement}
></canvas>

<div class="font-mono text-xs xs:text-sm md:text-base flex flex-col">
	<div class="my-2 flex flex-col md:flex-row">
		<div class="flex md:w-1/2">
			<div class="self-center">Light Intensity:</div>
			<div class="px-4 flex-grow self-center">
				<Slider
					bind:value={lightIntensityFactor}
					min={0}
					max={30}
					step={0.5}
					onValueChange={changeLightIntensity}
					class="max-w-full"
				></Slider>
			</div>
		</div>
		<div class="md:w-1/2 flex">
			<div class="self-center">Inertia:</div>
			<div class="px-4 flex-grow self-center">
				<Slider
					bind:value={inertiaOverride}
					min={1}
					max={2000}
					step={5}
					onValueChange={changeInertia}
					class="max-w-full"
				></Slider>
			</div>
			<Popover.Root bind:open={popoverOpen}>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="ghost"
						class="relative mr-1 rounded-full p-0 h-[30px] w-[30px]"
					>
						<Info class="absolute top-1/2 -translate-y-1/2" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-[50%]">
					<p>
						Controls the time, the model rotates after releasing a
						mouse button. For complex models, drag the slider to the
						left.
					</p>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>
	<div class="font-mono">Rendering Speed: {fps} f/sec</div>
</div>

<style>
</style>
