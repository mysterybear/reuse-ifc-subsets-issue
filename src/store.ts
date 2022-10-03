import { proxy, ref, useSnapshot } from "valtio"
import { IFCLoader } from "web-ifc-three"
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel"

function initIfcLoader() {
  const ifcLoader = new IFCLoader()
  ifcLoader.ifcManager.setWasmPath("../../../")
  return ifcLoader
}

const store = proxy<{
  ifcLoader: IFCLoader
  ifcModels: Array<IFCModel>
}>({
  ifcLoader: ref(initIfcLoader()),
  ifcModels: [],
})

export const useStore = () => useSnapshot(store)

export const useIfcLoader = () => useStore().ifcLoader

export const pushIfcModel = (ifcModel: IFCModel, key: string) => {
  ifcModel.name = key
  store.ifcModels.push(ref(ifcModel))
}

export default store
