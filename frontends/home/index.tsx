import { Cemjsx, front, Listener, Func, Static, Variable } from "cemjs-all"
import Navigation from "./navigation"


Listener.finish = () => {
    return
}

Func.test = () => {
    return
}

front.loader = () => {
    Static.text = "Framework CemJS!";
    return
}

front.display = () => {
    return (
        <div>
            <Navigation />
        </div>
    )
}

export { front }