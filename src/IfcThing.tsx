import { GroupProps } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { suspend } from "suspend-react"
import { Group, Intersection, MeshLambertMaterial } from "three"
import { IfcMesh } from "web-ifc-three/IFC/BaseDefinitions"
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel"
import { pushIfcModel, useIfcLoader } from "./store"

type Props = GroupProps & {
  ifcUrl: string
  identifier: string
}

const IfcThing = (props: Props) => {
  const { identifier, ifcUrl, ...groupProps } = props

  const groupRef = useRef<Group>(null!)

  const loader = useIfcLoader()
  const manager = loader.ifcManager

  const ifcModel = suspend(async () => {
    const ifcModel: IFCModel = await loader.loadAsync(ifcUrl)
    pushIfcModel(ifcModel, identifier)
    return ifcModel
  }, [identifier, ifcUrl])

  const highlightMaterial = useMemo(
    () =>
      new MeshLambertMaterial({
        transparent: true,
        opacity: 0.6,
        color: 0xff88ff,
        depthTest: false,
      }),
    []
  )

  const pick = (item: Intersection) => {
    const mesh = item.object as IfcMesh
    const modelID = mesh.modelID

    if (modelID !== ifcModel.modelID) return

    const expressID = manager.getExpressId(mesh.geometry, item.faceIndex!)

    console.log({ modelID, expressID })

    // @ts-ignore
    manager.state.models[modelID] = mesh

    manager.createSubset({
      scene: groupRef.current,
      ids: [expressID],
      modelID,
      removePrevious: false,
      material: highlightMaterial,
    })
  }

  return (
    <group
      ref={groupRef}
      {...groupProps}
      onClick={(e) => {
        if (e.intersections.length === 0) return
        pick(e.intersections[0])
      }}
    >
      <primitive object={ifcModel} />
    </group>
  )
}

export default IfcThing
