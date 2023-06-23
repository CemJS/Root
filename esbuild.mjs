import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import path from 'path'
import fs from 'fs'

const runServe = process.argv.includes("--runServe")
const dirFrontends = path.resolve("frontends")
const dirServices = path.resolve("services")
let cemconfig = JSON.parse(fs.readFileSync("cemconfig.json"))

const checkFrontend = async function (dir) {
    if (!fs.existsSync(dir)) {
        return [[], []]
    }
    const entryPoints = []
    const frontends = fs.readdirSync(dir).map(file => {
        if (file[0] != ".") {
            let microFrontend = {
                name: file,
                path: {},

            }
            if (fs.existsSync(path.join(dir, file, "index.ts"))) {
                microFrontend.path.js = `/assets/js/${file}.js`
                entryPoints.push({ in: path.join(dir, file, "index.ts"), out: path.resolve(options.outdir, "js", file) })
            }
            if (fs.existsSync(path.resolve(`assets/scss/${file}.scss`))) {
                microFrontend.path.css = `/assets/css/${file}.css`
                entryPoints.push({ in: path.resolve(`assets/scss/${file}.scss`), out: path.resolve(options.outdir, "css", file) })
            }
            return microFrontend
        }
    }).filter(item => item);
    return [frontends, entryPoints]
}

const options = {
    publicPath: "/assets",
    outdir: "public/assets/",
    entryPoints: [{ in: "app.ts", out: "js/root" }, { in: "assets/scss/root.scss", out: "css/root" }],
    bundle: true,
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

if (runServe && process.argv[3]) {
    let dirmicro = path.resolve("frontends", process.argv[3])
    if (!fs.existsSync(dirmicro)) {
        console.error(`Not found microfrontend whith name => ${process.argv[3]}`)
    } else {
        let name = process.argv[3]
        let newOptions = Object.assign({}, options);
        newOptions.outdir = path.join(dirmicro, "public/assets/")
        // newOptions.format = 'esm'
        newOptions.entryPoints = [
            { in: path.join(dirmicro, "app.ts"), out: path.resolve(newOptions.outdir, "js", "out") },
            { in: path.join(dirmicro, "assets/scss/style.scss"), out: path.resolve(newOptions.outdir, "css", "out") }
        ]
        newOptions.plugins[1] = {
            name: "assets-fonts",
            setup(build) {
                build.onResolve({ filter: /.(woff|woff2|eot|ttf)$/ }, (args) => {
                    return { path: path.join(dirmicro, "assets", args.path) }
                })
            }
        }

        newOptions.plugins[2] = {
            name: "assets-images",
            setup(build) {
                build.onResolve({ filter: /.(jpg|jpeg|png|svg)$/ }, (args) => {
                    args.path = args.path.replace("@", "")
                    return { path: path.join(dirmicro, "assets", args.path) }
                })
            }
        }

        const ctx = await esbuild.context(newOptions).catch(() => process.exit(1))
        console.log(`⚡ Build complete! (${name}) ⚡`)
        const serve = await ctx.serve({ servedir: path.join(dirmicro, "public") })
        console.log(`\nWeb: http://127.0.0.1:${serve.port}`)
        await ctx.watch()
    }

} else {

    const [microFrontends, entryPoints] = await checkFrontend(dirFrontends)
    cemconfig.microFrontends = microFrontends
    fs.writeFileSync('cemconfig.json', JSON.stringify(cemconfig));
    options.format = 'esm'

    const ctxRoot = await esbuild.context(options)
    console.log("⚡ Build complete! ⚡")

    if (microFrontends?.length) {
        options.format = 'esm'
        options.entryPoints = entryPoints
        const ctx = await esbuild.context(options).catch(() => process.exit(1))
        console.log(`⚡ Build frontends complete! ⚡`)
        if (runServe) {
            const serve = await ctx.serve({ servedir: "public" })
            console.log(`\nWeb: http://127.0.0.1:${serve.port}`)
            await ctx.watch()
            await ctxRoot.watch()
        }
    } else {
        if (runServe) {
            const serve = await ctxRoot.serve({ servedir: "public" })
            console.log(`\nWeb: http://127.0.0.1:${serve.port}`)
            await ctxRoot.watch()
        }
    }
}