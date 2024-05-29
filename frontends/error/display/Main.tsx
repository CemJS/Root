import { Cemjsx, Fn, Func, Static } from "cemjs-all"

export default function () {
    const click = () => {
        Fn.linkChange('/');
    }

    return (
        <div class="container mx-auto flex-auto flex flex-col justify-center items-center gap-5">
            <h1 class="text-7xl font-semibold">Error 404</h1>
            <p class="text-6xl font-bold">Страница не найдена</p>
            <p class="text-4xl">Вернитесь на главную страницу</p>
            <button
                onclick={click}
                class="text-4xl font-medium text-black bg-white p-4 rounded-2xl transition-all hover:bg-slate-100"
            >
                <span>На главную</span>
            </button>
        </div>
    )
}