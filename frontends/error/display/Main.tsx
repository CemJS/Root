import { Cemjsx, Fn, Static } from "cemjs-all"

export default function () {


    Static.setInterval = setInterval(() => {
        console.log('=554709=', "setTimeout")
    }, 2000);

    return (
        <div class="error_wrap">
            <p class="error_text">Страница не найдена</p>
            <h1 class="error_title">Error 404</h1>
            <p class="error_subtitle">Вернитесь на главную страницу</p>
            <a
                href="/"
                onclick={Fn.link}
                class="btn btn_timing"
            >
                <span>На главную</span>
            </a>
        </div>
    )
}