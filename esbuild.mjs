import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import path from 'path'
import fs from 'fs'

let nameFront
const runServe = process.argv.includes("--runServe")
const runFront = process.argv.includes("--runFront")
const dirFrontends = path.resolve("frontends")
const dirServices = path.resolve("services")
let cemconfig = JSON.parse(fs.readFileSync("cemconfig.json"))

const options = {
    publicPath: "/assets",
    outdir: "public/assets/",
    entryPoints: [{ in: "app.ts", out: "js/root" }, { in: "assets/scss/root.scss", out: "css/root" }],
    bundle: true,
    format: 'esm',
    loader: {
        '.woff': 'file',
        '.woff2': 'file',
        '.eot': 'file',
        '.ttf': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.png': 'file',
        '.svg': 'dataurl',
    },
    plugins: [
        sassPlugin({
            async transform(source) {
                const { css } = await postcss([autoprefixer]).process(source, { from: undefined });
                return css;
            },
        }),
        {
            name: "assets-fonts",
            setup(build) {
                build.onResolve({ filter: /.(woff|woff2|eot|ttf)$/ }, (args) => {
                    return { path: path.resolve("assets", args.path) }
                })
            }
        },
        {
            name: "assets-images",
            setup(build) {
                build.onResolve({ filter: /.(jpg|jpeg|png|svg)$/ }, (args) => {
                    args.path = args.path.replace("@", "")
                    return { path: path.resolve("assets", args.path) }
                })
            }
        }
    ],
}

const checkFrontend = async function (dir, name) {
    if (!fs.existsSync(dir)) {
        return []
    }
    const frontends = fs.readdirSync(dir).map(file => {
        if (file[0] != "." && (!name || name == file)) {
            let microFrontend = {
                front: true,
                name: file,
                path: {},

            }
            if (fs.existsSync(path.join(dir, file, "index.ts"))) {
                microFrontend.path.js = `/assets/js/${file}.js`
                options.entryPoints.push({ in: path.join(dir, file, "index.ts"), out: path.resolve(options.outdir, "js", file) })
            }
            if (fs.existsSync(path.resolve(`assets/scss/${file}.scss`))) {
                microFrontend.path.css = `/assets/css/${file}.css`
                options.entryPoints.push({ in: path.resolve(`assets/scss/${file}.scss`), out: path.resolve(options.outdir, "css", file) })
            }
            if (fs.existsSync(path.join(dir, file, "cemconfig.json"))) {
                let cemconfig = JSON.parse(fs.readFileSync(path.join(dir, file, "cemconfig.json")))
                Object.assign(microFrontend, cemconfig)
            }

            return microFrontend
        }
    }).filter(item => item);
    return frontends
}



const start = async function () {
    if (runFront) {
        if (!process.argv[4] || !fs.existsSync(path.resolve("frontends", process.argv[4]))) {
            console.error(`Not found microfrontend whith name => ${process.argv[4]}`)
            return
        } else {
            nameFront = process.argv[4]
        }
    }

    const microFrontends = await checkFrontend(dirFrontends, nameFront);
    cemconfig.microFrontends = microFrontends
    fs.writeFileSync('cemconfig.json', JSON.stringify(cemconfig));

    const ctx = await esbuild.context(options).catch(() => process.exit(1))
    console.log("⚡ Build complete! ⚡")
    if (runServe) {
        const serve = await ctx.serve({ servedir: "public" })
        console.log(`\nWeb: http://127.0.0.1:${serve.port}`)
        await ctx.watch()
    }
    return
}

start()