import { useEffect, useRef } from "react";
import { 
  Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, StandardMaterial, Texture 
} from "@babylonjs/core";
import "@babylonjs/loaders"; // Loader untuk file .glb / .gltf
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

const Heart3D = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = new Engine(sceneRef.current, true);
    const scene = new Scene(engine);

    // Kamera interaktif dengan posisi lebih baik
    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, new Vector3(0, 1, 0), scene);
    camera.attachControl(sceneRef.current, true);

    // Cahaya global lebih terang
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1.5;

    // Memuat model jantung dari file .glb
    SceneLoader.ImportMesh("", "../assets/models/source/", "Beating heart.glb", scene, (meshes) => {
      const heart = meshes[0];
      heart.scaling = new Vector3(6, 6, 6); // Skala lebih besar
      heart.position = new Vector3(0, 1, 0);

      // Tambahkan tekstur jika diperlukan
      const material = new StandardMaterial("heartMaterial", scene);
      material.diffuseTexture = new Texture("../assets/models/texture/gltf_embedded_0.png", scene);
      heart.material = material;
    });

    // Render loop
    engine.runRenderLoop(() => scene.render());

    // Resize handling
    window.addEventListener("resize", () => engine.resize());

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <canvas ref={sceneRef} style={{ width: "1200px", height: "800px", border: "1px solid black" }} />
    </div>
  );
};

export default Heart3D;
