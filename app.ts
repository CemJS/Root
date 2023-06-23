import { initMap } from 'cemjs-all'
import cemconfig from './cemconfig.json'
new EventSource('/esbuild').addEventListener('change', e => {
    const { added, removed, updated } = JSON.parse(e.data)
    console.log('=2a2866=', added, removed, updated)

    // location.reload()
})
initMap(cemconfig)