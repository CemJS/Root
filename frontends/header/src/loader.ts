import { CEM } from 'cemjs-core'
export const loader = function () {
    if (!CEM.name) {
        Object.assign(CEM, this)
        console.log('=bb1ee8=', 123)
    }
    console.log('=2644b3=', CEM)
    CEM.Static.text = "CemJS"

}