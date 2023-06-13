import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import path from 'path'
import fs from 'fs'

const runServe = process.argv.includes("--runServe")
let assetsdir = path.resolve("src/assets")
const dirFrontends = path.resolve("frontends")
const dirServices = path.resolve("services")
let cemconfig = JSON.parse(fs.readFileSync("cemconfig.json"))

const checkFrontend = async function (dir) {
    const frontends = fs.readdirSync(dir).map(file => {
        console.log('=4b57fc=', file)
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
    });

    for (let item of frontends) {
        assetsdir = path.join(dir, item.name, "src/assets")
        options.format = 'esm'
        options.entryPoints = [
            { in: path.join(dir, item.name, "src/index.ts"), out: path.resolve(options.outdir, "js", item.name) },
            { in: path.join(dir, item.name, "src/assets/scss/style.scss"), out: path.resolve(options.outdir, "css", item.name) }
        ]
        const ctx = await esbuild.context(options).catch(() => process.exit(1))
        console.log(`⚡ Build complete! (${item.name}) ⚡`)
        await ctx.watch()
    }

    return frontends
}

const assetsImages = {
    name: "assets-images",
    setup(build) {
        build.onResolve({ filter: /.(jpg|jpeg|png|svg)$/ }, (args) => {
            args.path = args.path.replace("@", "")
            return { path: path.join(assetsdir, args.path) }
        })
    }
}

const assetsFonts = {
    name: "assets-fonts",
    setup(build) {
        build.onResolve({ filter: /.(woff|woff2|eot|ttf)$/ }, (args) => {
            return { path: path.join(assetsdir, args.path) }
        })
    }
}

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
        }),
        assetsFonts,
        assetsImages
    ],
}

const microFrontends = await checkFrontend(dirFrontends)

cemconfig.microFrontends = microFrontends
fs.writeFileSync('cemconfig.json', JSON.stringify(cemconfig));

assetsdir = path.resolve("src/assets")
options.entryPoints = [{ in: "app.ts", out: "js/root" }, { in: "src/assets/scss/style.scss", out: "css/root" }]
delete options.format

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

