import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Fragment } from "react"
import IfcThing from "./IfcThing"

const ThreeApp = () => {
  return (
    <Fragment>
      <IfcThing
        key="bar"
        identifier="bar"
        ifcUrl="/IFC/02.ifc"
        position-x={-5}
      />
      <IfcThing
        key="foo"
        identifier="foo"
        ifcUrl="/IFC/01.ifc"
        position-x={5}
      />
    </Fragment>
  )
}

const App = () => {
  return (
    <Canvas camera={{ position: [5, 10, 20] }}>
      <ambientLight />
      <ThreeApp />
      <OrbitControls />
    </Canvas>
  )
}

export default App
