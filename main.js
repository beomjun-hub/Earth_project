
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// 기본 장면 생성하기
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 카메라 생성하기
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 12;

// 렌더러 생성하기
const container = document.getElementById("earth-container");
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// 카메라 비율 설정하기
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();


// 지구 텍스처 불러오기
const loader = new THREE.TextureLoader();

const earthTexture = loader.load("./textures/earth.jpg");
earthTexture.colorSpace = THREE.SRGBColorSpace;

const heightTexture = loader.load("./textures/heightmap.jpg");

// 지구 구체 만들기
const geometry = new THREE.SphereGeometry(3, 256, 128);

// 지구 머티리얼 설정하기
const material = new THREE.MeshStandardMaterial({
    map: earthTexture,
    displacementMap: heightTexture,
    displacementScale: 0.3,
    displacementBias: -0.075,
    roughness: 1
});

// 지구 생성하기
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);


// 태양 역할의 조명 설정하기
const sunlight = new THREE.DirectionalLight(0xffffff, 3);
sunlight.position.set(5, 3, 5);
scene.add(sunlight);

// 약한 주변 조명 설정하기
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);


// 회전 관련 변수 설정하기
let rotating = true;
let rotationSpeed = 1;

// 회전 정지 버튼 설정하기
const rotationBtn = document.getElementById("rotation-btn");

rotationBtn.addEventListener("click", function() {
    rotating = !rotating;

    if (rotating) {
        rotationBtn.textContent = "회전 정지";
    } else {
        rotationBtn.textContent = "회전 시작";
    }
});

// 회전 속도 조절하기
const speedSlider = document.getElementById("rotation-speed");

speedSlider.addEventListener("input", function() {
    rotationSpeed = Number(speedSlider.value);
});

// 고도 강조 조절하기
const heightSlider = document.getElementById("height-scale");

heightSlider.addEventListener("input", function() {
    const scale = Number(heightSlider.value);

    material.displacementScale = 0.06 * scale;
    material.displacementBias = -0.012 * scale;
});


// 화면 크기 변경하기
window.addEventListener("resize", function() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});


// 애니메이션 설정하기
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (rotating) {
        earth.rotation.y += delta * 0.3 * rotationSpeed;
    }

    renderer.render(scene, camera);
}

animate();
