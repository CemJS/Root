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

const options = {
    publicPath: "/assets",
    outdir: "public/assets/",
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
        })
    ],
}

const checkFrontend = async function (dir) {
    const frontends = fs.readdirSync(dir).map(file => {
        if (file[0] != ".") {
            let microFrontend = {
                name: file,
                path: {
                    js: `/assets/js/${file}.js`,
                    css: `/assets/css/${file}.css`
                }
            }
            return microFrontend
        }
    }).filter(item => item);
    return frontends
}

const buildFrontends = async function (frontends, dir) {
    for (let item of frontends) {
        let newOptions = Object.assign({}, options);
        newOptions.format = 'esm'
        newOptions.entryPoints = [
            { in: path.join(dir, item.name, "src/index.ts"), out: path.resolve(options.outdir, "js", item.name) },
            { in: path.join(dir, item.name, "src/assets/scss/style.scss"), out: path.resolve(options.outdir, "css", item.name) }
        ]
        newOptions.plugins[1] = {
            name: "assets-fonts",
            setup(build) {
                build.onResolve({ filter: /.(woff|woff2|eot|ttf)$/ }, (args) => {
                    return { path: path.join(dir, item.name, "src/assets", args.path) }
                })
            }
        }

        newOptions.plugins[2] = {
            name: "assets-images",
            setup(build) {
                build.onResolve({ filter: /.(jpg|jpeg|png|svg)$/ }, (args) => {
                    args.path = args.path.replace("@", "")
                    return { path: path.join(dir, item.name, "src/assets", args.path) }
                })
            }
        }

        const ctx = await esbuild.context(newOptions).catch(() => process.exit(1))
        console.log(`⚡ Build complete! (${item.name}) ⚡`)
        await ctx.watch()
    }
    return
}

const microFrontends = await checkFrontend(dirFrontends)
await buildFrontends(microFrontends, dirFrontends)

cemconfig.microFrontends = microFrontends
fs.writeFileSync('cemconfig.json', JSON.stringify(cemconfig));

options.entryPoints = [{ in: "app.ts", out: "js/root" }, { in: "assets/scss/style.scss", out: "css/root" }]
delete options.format

options.plugins[1] = {
    name: "assets-fonts",
    setup(build) {
        build.onResolve({ filter: /.(woff|woff2|eot|ttf)$/ }, (args) => {
            return { path: path.resolve("assets", args.path) }
        })
    }
}

options.plugins[2] = {
    name: "assets-images",
    setup(build) {
        build.onResolve({ filter: /.(jpg|jpeg|png|svg)$/ }, (args) => {
            args.path = args.path.replace("@", "")
            return { path: path.resolve("assets", args.path) }
        })
    }
}

if (runServe) {
    const ctx = await esbuild.context(options)
    console.log("⚡ Build complete! ⚡")
    const serve = await ctx.serve({ servedir: "public" })
    console.log(`\nWeb: http://127.0.0.1:${serve.port}`)
    await ctx.watch()
} else {
    esbuild
        .build(options)
        .then(() => console.log("⚡ Build complete! ⚡"))
        .catch(() => process.exit(1))
}