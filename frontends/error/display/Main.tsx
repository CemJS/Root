import { Cemjsx, Fn, Func, Static } from "cemjs-all"

export default function () {
    const click = () => {
        Fn.linkChange('/');
    }

    return (
        <div class="container mx-auto flex-auto flex items-center">
            <div class="flex flex-col md:w-1/2 m-auto content-center gap-6 bg-red-400 rounded-xl p-4 md:p-8">
                <h1 class="text-4xl md:text-7xl font-bold text-center">Ошибка 404</h1>
                <p class="text-2xl md:text-4xl font-medium text-center">Страница не найдена</p>
                <div class="m-auto">
                    <button
                        onclick={click}
                        class="text-2xl md:text-4xl font-bold bg-red-600 p-4 rounded-xl active:bg-red-700 ease-in-out duration-150"
                    >Вернуться на главную</button>
                </div>
            </div>
        </div>
    )
}