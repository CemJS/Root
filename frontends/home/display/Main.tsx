import { Cemjsx, Static } from "cemjs-all"
import space from '@svg/space.svg'


export default function () {
  return (
    <div class="container mx-auto flex flex-col flex-auto justify-center items-center p-5">
      <h2 class="text-4xl md:text-6xl text-center">{Static.text}</h2>
      <img class="size-80 mt-10 md:mt-20" src={space} />
    </div>
  )
}