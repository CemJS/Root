import { Cemjsx } from "cemjs-all"
import logo from '../assets/images/logo.jpg'

export const display = function () {
    return (
        <div class="general">
            <header class="header">
                <div class="container">
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
                                    onclick={() => {
                                        this.Static.page = "cemjs"
                                        this.init();
                                    }}
                                >Cem JS</li>
                                <li
                                    class={["header_menu_item", this.Static.page == "examples" ? "header_menu_item-active" : null]}
                                    onclick={() => {
                                        this.Static.page = "examples"
                                        this.init();
                                    }}
                                >Examples</li>
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
                </div>
            </header>
        </div>
    )
}