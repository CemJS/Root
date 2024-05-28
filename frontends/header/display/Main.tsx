import { Cemjsx, Func, Static, Fn } from "cemjs-all"
import logo from '@images/logo/logo.jpg'

type Link = {
  url: string;
  pageCheck: string;
  title: string;
  onclick?: () => void;
}
function Link ({ url, title, onclick, pageCheck }: Link) {
  const baseStyle = `text-base font-medium cursor-pointer relative
  before:content-[''] before:absolute before:bg-white before:h-0.5 before:w-full before:-bottom-1`
  const style = `${baseStyle} before:scale-x-0 hover:before:scale-x-100`;
  const styleActive = `${baseStyle} before:scale-x-100`

  return (
    <li class={[style, Static.page == pageCheck ? styleActive : null]}>
        <a href={ url } onclick={ onclick ?? Fn.link }>{ title }</a>
    </li>
  )
}


export default function () {
  return (
    <div class="relative">
      <div class="absolute -z-10 left-0 right-0 top-0 bottom-0 blur-[2px] shadow-[inset_0_0_0_3000px_rgba(150,150,159,0.192)]" />
      <header class="container mx-auto">
        <div class="realative flex justify-between items-center h-20">

          <div class="size-16 cursor-pointer">
            <a href="/" onclick={Fn.link}>
              <img
                class="rounded-full"
                src={logo}
              ></img>
            </a>
          </div>

          <nav>

            <ul class="flex list-none pl-0 gap-5">
              <Link url="/about/" title="Cem JS" pageCheck="cemjs" />
              <Link url="https://ya.ru/" title="Examples" pageCheck="examples" />
              <Link url="/contacts/" title="Contacts" pageCheck="contacts" onclick={ () => {
                Static.page = "contacts";
                Fn.init();
              }} />
            </ul>

          </nav>
        </div>

      </header>
    </div>
  )
}