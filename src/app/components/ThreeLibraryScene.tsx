import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

export function ThreeLibraryScene({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070f1e);
    scene.fog = new THREE.FogExp2(0x070f1e, 0.045);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 9);
    camera.lookAt(0, 1.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ─── LIGHTING ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0x1a3060, 0.6);
    scene.add(ambient);

    // Main ceiling light (warm)
    const ceilLight = new THREE.PointLight(0xffe8b0, 2.5, 18);
    ceilLight.position.set(0, 7, -1);
    ceilLight.castShadow = true;
    scene.add(ceilLight);

    // Accent light (cool blue from the left – like a window)
    const windowLight = new THREE.DirectionalLight(0x4488ff, 0.8);
    windowLight.position.set(-8, 6, 4);
    windowLight.castShadow = true;
    scene.add(windowLight);

    // Desk lamp light
    const deskLight = new THREE.PointLight(0xffd070, 1.2, 5);
    deskLight.position.set(2.5, 2.2, 2);
    scene.add(deskLight);

    const rimLight = new THREE.DirectionalLight(0x2244ff, 0.3);
    rimLight.position.set(5, 3, -5);
    scene.add(rimLight);

    // ─── MATERIALS ─────────────────────────────────────────────────────────────
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x2a1506, roughness: 0.85, metalness: 0.1 });
    const lightWoodMat = new THREE.MeshStandardMaterial({ color: 0x5a3010, roughness: 0.75, metalness: 0.1 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a0c03, roughness: 0.9, metalness: 0.05 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0d1f3c, roughness: 1 });
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x0a1628, roughness: 1 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaabbcc, roughness: 0.3, metalness: 0.9 });
    const lampShadeMat = new THREE.MeshStandardMaterial({ color: 0xffe090, roughness: 0.6, emissive: 0xffa030, emissiveIntensity: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x88bbff, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.25 });

    // ─── FLOOR ──────────────────────────────────────────────────────────────────
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ─── WALLS ──────────────────────────────────────────────────────────────────
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(22, 12), wallMat);
    backWall.position.set(0, 6, -7);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(22, 12), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-9, 6, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(22, 12), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(9, 6, 0);
    scene.add(rightWall);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 10, 0);
    scene.add(ceiling);

    // Window on left wall
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3, 2), lightWoodMat);
    windowFrame.position.set(-8.95, 4.5, -2);
    scene.add(windowFrame);
    const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), glassMat);
    windowGlass.rotation.y = Math.PI / 2;
    windowGlass.position.set(-8.9, 4.5, -2);
    scene.add(windowGlass);

    // ─── BOOKSHELF BUILDER ──────────────────────────────────────────────────────
    function buildShelf(x: number, y: number, z: number, w: number, h: number, d: number) {
      const group = new THREE.Group();
      // Side panels
      const sidePanelGeo = new THREE.BoxGeometry(0.07, h, d);
      const left = new THREE.Mesh(sidePanelGeo, darkWoodMat);
      left.position.set(-w / 2, 0, 0);
      left.castShadow = true;
      left.receiveShadow = true;
      const right = new THREE.Mesh(sidePanelGeo, darkWoodMat);
      right.position.set(w / 2, 0, 0);
      right.castShadow = true;
      group.add(left, right);

      // Back panel
      const backGeo = new THREE.BoxGeometry(w, h, 0.04);
      const back = new THREE.Mesh(backGeo, darkWoodMat);
      back.position.set(0, 0, -d / 2 + 0.02);
      group.add(back);

      // Horizontal shelves
      const numShelves = 4;
      const shelfGeo = new THREE.BoxGeometry(w, 0.06, d);
      for (let i = 0; i < numShelves; i++) {
        const s = new THREE.Mesh(shelfGeo, darkWoodMat);
        s.position.set(0, -h / 2 + i * (h / (numShelves - 1)), 0);
        s.castShadow = true;
        s.receiveShadow = true;
        group.add(s);
      }
      group.position.set(x, y + h / 2, z);
      return group;
    }

    // ─── BOOKS BUILDER ─────────────────────────────────────────────────────────
    const bookPalette = [
      0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6,
      0x1abc9c, 0xe67e22, 0x2980b9, 0x27ae60, 0xc0392b,
      0x8e44ad, 0x16a085, 0xd35400, 0x2c3e50, 0xf1c40f,
    ];

    function addBooks(shelfGroup: THREE.Group, shelfLocalY: number, shelfWidth: number, shelfDepth: number, count: number) {
      let curX = -shelfWidth / 2 + 0.06;
      const maxX = shelfWidth / 2 - 0.06;
      for (let i = 0; i < count; i++) {
        if (curX >= maxX) break;
        const bw = 0.045 + Math.random() * 0.04;
        const bh = 0.28 + Math.random() * 0.22;
        const bd = shelfDepth * 0.85;
        const bookGeo = new THREE.BoxGeometry(bw, bh, bd);
        const color = bookPalette[Math.floor(Math.random() * bookPalette.length)];
        const bookMat = new THREE.MeshStandardMaterial({ color, roughness: 0.75 });
        const book = new THREE.Mesh(bookGeo, bookMat);
        book.position.set(curX + bw / 2, shelfLocalY + bh / 2 + 0.03, 0);
        book.castShadow = true;
        // Tiny lean
        book.rotation.z = (Math.random() - 0.5) * 0.08;
        shelfGroup.add(book);
        curX += bw + 0.003 + Math.random() * 0.01;
      }
    }

    // Back wall shelves
    const shelf1 = buildShelf(-3.8, 0, -6.5, 2.2, 5.5, 0.42);
    const shelf2 = buildShelf(0, 0, -6.5, 2.2, 5.5, 0.42);
    const shelf3 = buildShelf(3.8, 0, -6.5, 2.2, 5.5, 0.42);
    [shelf1, shelf2, shelf3].forEach(s => { s.castShadow = true; scene.add(s); });

    // Left wall shelf
    const shelf4 = buildShelf(-8, 0, -3, 0.42, 4.5, 2.0);
    shelf4.rotation.y = Math.PI / 2;
    scene.add(shelf4);

    // Fill shelves with books (shelf-local Y positions per shelf row)
    const shelfRowsMain = [-5.5 / 2 + 0, -5.5 / 2 + 5.5 / 3, -5.5 / 2 + 5.5 * 2 / 3];
    [shelf1, shelf2, shelf3].forEach(s => {
      shelfRowsMain.forEach(y => addBooks(s, y, 2.1, 0.38, 25));
    });

    // ─── DESK ──────────────────────────────────────────────────────────────────
    const deskGroup = new THREE.Group();
    // Tabletop
    const tabletopGeo = new THREE.BoxGeometry(3.2, 0.1, 1.4);
    const tabletop = new THREE.Mesh(tabletopGeo, lightWoodMat);
    tabletop.position.set(0, 0, 0);
    tabletop.castShadow = true;
    tabletop.receiveShadow = true;
    deskGroup.add(tabletop);
    // Legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.85, 0.08);
    const legPositions = [[-1.5, -0.48, -0.6], [1.5, -0.48, -0.6], [-1.5, -0.48, 0.6], [1.5, -0.48, 0.6]];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, darkWoodMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      deskGroup.add(leg);
    });
    deskGroup.position.set(1.5, 0.95, 2);
    scene.add(deskGroup);

    // Books on desk
    const deskBook1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, 0.35), new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.7 }));
    deskBook1.position.set(0.5, 1.05, 2.1);
    scene.add(deskBook1);
    const deskBook2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, 0.32), new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.7 }));
    deskBook2.position.set(0.52, 1.085, 2.12);
    deskBook2.rotation.y = 0.15;
    scene.add(deskBook2);

    // Desk lamp
    const lampBaseGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.05, 12);
    const lampBase = new THREE.Mesh(lampBaseGeo, metalMat);
    lampBase.position.set(2.4, 1.02, 2.1);
    scene.add(lampBase);
    const lampPoleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8);
    const lampPole = new THREE.Mesh(lampPoleGeo, metalMat);
    lampPole.position.set(2.4, 1.4, 2.1);
    scene.add(lampPole);
    const lampShadeGeo = new THREE.ConeGeometry(0.22, 0.28, 12, 1, true);
    const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
    lampShade.position.set(2.4, 1.9, 2.1);
    lampShade.rotation.x = Math.PI;
    scene.add(lampShade);

    // Chair
    const chairSeatGeo = new THREE.BoxGeometry(0.9, 0.08, 0.9);
    const chairSeat = new THREE.Mesh(chairSeatGeo, new THREE.MeshStandardMaterial({ color: 0x1a3a6b, roughness: 0.8 }));
    chairSeat.position.set(1.5, 0.5, 3.3);
    chairSeat.castShadow = true;
    scene.add(chairSeat);
    const chairBackGeo = new THREE.BoxGeometry(0.9, 0.9, 0.07);
    const chairBack = new THREE.Mesh(chairBackGeo, new THREE.MeshStandardMaterial({ color: 0x1a3a6b, roughness: 0.8 }));
    chairBack.position.set(1.5, 0.95, 2.85);
    scene.add(chairBack);

    // ─── CEILING LIGHT FIXTURE ─────────────────────────────────────────────────
    const fixtureGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16);
    const fixture = new THREE.Mesh(fixtureGeo, metalMat);
    fixture.position.set(0, 9.97, -1);
    scene.add(fixture);
    const bulbGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffeeaa, emissive: 0xffcc44, emissiveIntensity: 1.5 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 9.85, -1);
    scene.add(bulb);
    const cordGeo = new THREE.CylinderGeometry(0.008, 0.008, 3, 4);
    const cord = new THREE.Mesh(cordGeo, metalMat);
    cord.position.set(0, 8.5, -1);
    scene.add(cord);

    // ─── FLOATING PARTICLES ────────────────────────────────────────────────────
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.025, transparent: true, opacity: 0.55 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── RUGS ──────────────────────────────────────────────────────────────────
    const rugGeo = new THREE.PlaneGeometry(3, 2.5);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x1d3a6e, roughness: 1 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(1.5, 0.01, 2.8);
    scene.add(rug);

    // ─── ANIMATION ─────────────────────────────────────────────────────────────
    let animId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 3.2;
    const clock = new THREE.Clock();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Floating particles
      const pos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.002 + Math.sin(elapsed * 0.5 + i) * 0.001;
        if (pos[i * 3 + 1] > 8) pos[i * 3 + 1] = 0.2;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Subtle camera sway
      targetCamX += (mouseX * 0.8 - targetCamX) * 0.04;
      targetCamY += (-mouseY * 0.4 + 3.2 - targetCamY) * 0.04;
      camera.position.x = targetCamX + Math.sin(elapsed * 0.12) * 0.15;
      camera.position.y = targetCamY + Math.sin(elapsed * 0.08) * 0.05;
      camera.lookAt(0, 1.5, 0);

      // Desk lamp flicker
      deskLight.intensity = 1.2 + Math.sin(elapsed * 3.5) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
