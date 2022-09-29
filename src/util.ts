import { Object3D } from "three"
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel"

export const guardIfc = (o3: Object3D): o3 is IFCModel => "modelID" in o3
