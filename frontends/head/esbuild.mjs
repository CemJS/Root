import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import path from 'path'


const runServe = process.argv.includes("--runServe")


const assetsImages = {
    name: "assets-images",
    setup(build) {
        build.onResolve({ filter: /.(jpg|jpeg|png|svg)$/ }, (args) => {
            args.path = args.path.replace("@", "")
            return { path: path.join(path.resolve("assets"), args.path) }
        })
    }
}

const assetsFonts = {
    name: "assets-fonts",
    setup(build) {
        build.onResolve({ filter: /.(woff|woff2|eot|ttf)$/ }, (args) => {
            return { path: path.join(path.resolve("assets"), args.path) }
        })
    }
}

const options = {
    publicPath: "/assets",
    outdir: "public/assets/",
    entryPoints: [{ in: "app.ts", out: "js/out" }, { in: "assets/scss/style.scss", out: "css/out" }],
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

