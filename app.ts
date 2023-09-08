import { initMap } from 'cemjs-all'
import cemconfig from './cemconfig.json'
import frontends from './frontends.json'
import services from './services.json'

cemconfig.microFrontends = frontends
cemconfig.services = services
export default function () {
    initMap(cemconfig)
}