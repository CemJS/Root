import { Frontend } from "cemjs-all"
import { loader } from "./loader"
import { display } from "./display"
import * as listener from "./listener"
import * as func from "./functions"

export const frontend: Frontend = {
    loader,
    display,
    listener,
    func
}