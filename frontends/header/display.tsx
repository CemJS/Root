import { Cemjsx } from "cemjs-all"
import logo from '@images/logo/logo.jpg'

export const display = function () {
    return (
        <header class="header header_container">
            <div class="header_inner">
                <div class="header_logo">
                    <img
                        class="header_logo-img"
                        src={logo}
                        onclick={() => {
                            this.Static.page = "home"
                            this.init();
                        }}
                    ></img>
                </div>
                <nav>
                    <ul class="header_menu">
                        <li
                            class={["header_menu_item", this.Static.page == "cemjs" ? "header_menu_item-active" : null]}

                        ><a href="/about/" onclick={this.Fn.linkOut}>Cem JS</a>
                        </li>
                        <li
                            class={["header_menu_item", this.Static.page == "examples" ? "header_menu_item-active" : null]}
                        ><a href="https://ya.ru" onclick={this.Fn.linkOut}>Examples</a></li>
                        <li
                            class={["header_menu_item", this.Static.page == "contacts" ? "header_menu_item-active" : null]}
                            onclick={() => {
                                this.Static.page = "contacts"
                                this.init()
                            }}
                        >Contacts</li>
                    </ul>
                </nav>
            </div>
        </header>
    )

}