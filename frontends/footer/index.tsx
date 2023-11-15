import { Cemjsx, front, Listener, Func, Static } from "cemjs-all"
import Navigation from "./navigation"


Listener.finish = () => {
    console.log('=b16883=', "finish")
}

Func.test = () => {
    console.log('=9c0331=', "Func.test")
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