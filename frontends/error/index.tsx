import { Cemjsx, front, Listener, Func, Static } from "cemjs-all"
import Navigation from "./navigation"


Listener.finish = () => {
    return
}

Func.test = () => {
    return
}

front.loader = () => {
    return
}

front.display = () => {
    return (
        <main class="error page">
            <Navigation />
        </main>
    )
}

export { front }