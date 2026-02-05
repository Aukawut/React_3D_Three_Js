import './App.css'
import ModelViewer from './components/ModelViewer'
import { preloadModel } from './components/modelUtils'

// Preload models for better performance
preloadModel("/models/1c0002-0lb.glb");

const App = () => {
  return (
    <div className='grid gap-8 p-8 md:grid-cols-4 justify-items-center'>
      {/* ตัวอย่างการใช้งาน ModelViewer แบบ Reusable */}
    <ModelViewer 
  modelUrl="/models/1c0001-0lb.glb  "
  modelColor="red"
  width={500}
  height={500}
  environmentPreset="sunset"
  controls={{ autoRotate: true, autoRotateSpeed: 3 }}
  camera={{ position: [0, 2, 5], fov: 50 }}
  debug={true}
  changeAllMeshes={false}
  targetMeshes={["Mesh_7","Mesh_6"]}
/>

    <ModelViewer 
    modelUrl="/models/1c0004-0lb.glb"
    modelColor="#777777"
    width={500}
    height={500}
    environmentPreset="sunset"
    controls={{ autoRotate: true, autoRotateSpeed: 3 }}
    camera={{ position: [0, 2, 5], fov: 50 }}
    debug={true}
    changeAllMeshes={true}
  />
    <ModelViewer 
    modelUrl="/models/1g0580-00b.glb"
    modelColor="#c0c0c0"
    width={500}
    height={500}
    environmentPreset="sunset"
    controls={{ autoRotate: true, autoRotateSpeed: 3 }}
    camera={{ position: [0, 2, 5], fov: 30 }}
    debug={true}
    changeAllMeshes={true}
  />
    <ModelViewer 
      modelUrl="/models/1w0015-00b.glb"
      modelColor="#c0c0c0"
      width={500}
      height={500}
      environmentPreset="sunset"
      controls={{ autoRotate: true, autoRotateSpeed: 3 }}
      camera={{ position: [0, 2, 5], fov: 30 }}
      debug={true}
      changeAllMeshes={true}
    />

    <ModelViewer 
      modelUrl="/models/2t0354-00b.glb"
      modelColor="#049fa4"
      width={500}
      height={500}
      environmentPreset="sunset"
      controls={{ autoRotate: true, autoRotateSpeed: 3 }}
      camera={{ position: [0, 2, 5], fov: 50 }}
      debug={true}
      changeAllMeshes={false}
      targetMeshes={["Mesh_0"]}
    />

    <ModelViewer 
      modelUrl="/models/4t0165-00b.glb"
      modelColor="#2e3d49"
      width={500}
      height={500}
      environmentPreset="sunset"
      controls={{ autoRotate: true, autoRotateSpeed: 3 }}
      camera={{ position: [0, 2, 5], fov: 50 }}
      debug={true}
      changeAllMeshes={true}
    />

     <ModelViewer 
      modelUrl="/models/7t0456-0lb.glb"
      modelColor="blue"
      width={500}
      height={500}
      environmentPreset="sunset"
      controls={{ autoRotate: true, autoRotateSpeed: 3 }}
      camera={{ position: [0, 2, 5], fov: 50 }}
      debug={true}
      changeAllMeshes={false}
      targetMeshes={["7T8209-11(______)-1","7TA456-02-1-1"]}
    />
     <ModelViewer 
      modelUrl="/models/9y0054-0lb.glb"
      modelColor="#524a9f"
      width={500}
      height={500}
      environmentPreset="sunset"
      controls={{ autoRotate: true, autoRotateSpeed: 3 }}
      camera={{ position: [0, 2, 5], fov: 50 }}
      debug={true}
      targetMeshes={["Mesh_1"]}
      changeAllMeshes={false}
    />
     <ModelViewer 
      modelUrl="/models/rt1826-0lb.glb"
      modelColor="#777777"
      width={500}
      height={500}
      environmentPreset="sunset"
      controls={{ autoRotate: true, autoRotateSpeed: 3 }}
      camera={{ position: [0, 2, 5], fov: 50 }}
      debug={true}
      changeAllMeshes={true}
    />
     <ModelViewer 
      modelUrl="/models/rw0001-0lb.glb"
      modelColor="#777777"
      width={500}
      height={500}
      environmentPreset="sunset"
      controls={{ autoRotate: true, autoRotateSpeed: 3 }}
      camera={{ position: [0, 2, 5], fov: 50 }}
      debug={true}
      changeAllMeshes={false}
    />
    </div>
  )
}

export default App