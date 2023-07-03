import { initMap } from 'cemjs-all'
import cemconfig from './cemconfig.json'
import microFrontends from './microFrontends.json'

export default function () {
    initMap(Object.assign(cemconfig, microFrontends))
}