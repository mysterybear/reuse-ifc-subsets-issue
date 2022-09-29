import { GroupProps } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { suspend } from "suspend-react"
import { Group, MeshLambertMaterial } from "three"
import { IFCLoader } from "web-ifc-three"
import { guardIfc } from "./util"

type Props = GroupProps & {
  ifcUrl: string
  identifier: string
}

const IfcThing = (props: Props) => {
  const { identifier, ifcUrl, ...groupProps } = props

  const groupRef = useRef<Group>(null!)

  const ifc = suspend(async () => {
    const ifcLoader = new IFCLoader()
    ifcLoader.ifcManager.setWasmPath("../../../")
    const ifc = await ifcLoader.loadAsync(ifcUrl)
    const clone = ifc.clone()
    clone.name = identifier
    clone.ifcManager = ifcLoader.ifcManager
    return clone
  }, [identifier, ifcUrl])

  const material = useMemo(
    () =>
      new MeshLambertMaterial({
        transparent: true,
        opacity: 0.6,
        color: 0xff88ff,
        depthTest: false,
      }),
    []
  )

  return (
    <group
      ref={groupRef}
      {...groupProps}
      onPointerMove={({ intersections: [{ object, faceIndex }] }) => {
        if (!guardIfc(object)) return
        if (!faceIndex) throw new Error("no faceIndex")
        if (!ifc.ifcManager) throw new Error("null ifcManager")

        const { geometry } = ifc
        const id = ifc.ifcManager.getExpressId(geometry, faceIndex)

        ifc.ifcManager.createSubset({
          modelID: object.id,
          ids: [id],
          material,
          scene: groupRef.current,
          removePrevious: true,
        })
      }}
    >
      <primitive object={ifc} />
    </group>
  )
}

export default IfcThing
