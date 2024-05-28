import { Cemjsx } from "cemjs-all"
import platform from '@svg/platform.svg'
import telegram from '@svg/social/telegram.svg'
import youtube from '@svg/social/youtube.svg'
import github from '@svg/social/github.svg'
import email from '@svg/social/email.svg'

export default function () {
  return (
    <footer class="flex-initial relative">
      <div class="absolute -z-10 left-0 right-0 top-0 bottom-0 blur-[2px] shadow-[inset_0_0_0_3000px_rgba(150,150,159,0.192)]" />

      <div class="container mx-auto flex flex-wrap items-center justify-center md:justify-between p-5 gap-10">

        <span>Powered by <a target="_blank" href="https://crypto-emergency.com/">Crypto Emergency</a></span>

        <div class="flex align-center gap-5">
          <a class="cursor-pointer" target="_blank" href="https://t.me/FrameworkCemJS">
            <img src={telegram}></img>
          </a>
          <a class="cursor-pointer" target="_blank" href="https://www.youtube.com/@CemJS">
            <img src={youtube}></img>
          </a>
          <a class="cursor-pointer" target="_blank" href="https://github.com/CemJS">
            <img src={github}></img>
          </a>
          <a class="cursor-pointer" target="_blank" href="mailto:support@crypto-emergency">
            <img src={email}></img>
          </a>
          <a class="cursor-pointer" target="_blank" href="https://crypto-emergency.com/" >
            <img src={platform}></img>
          </a>
        </div>

        <span>© 2023</span>
      </div>
    </footer>
  )
}