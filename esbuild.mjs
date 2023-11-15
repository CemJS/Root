import esbuild from "esbuild";
import http from 'http'
import httpProxy from 'http-proxy'
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import path from 'path'
import fs from 'fs'
const proxy = httpProxy.createProxyServer({});

const dirFrontends = path.resolve("frontends")
const dirServices = path.resolve("services")
const dirPages = path.resolve("config", "pages")
const runServe = process.argv.includes("--runServe")
const runProd = process.argv.includes("--runProd")


let cemconfig = JSON.parse(fs.readFileSync("./config/cemjs.json"))
if (!fs.existsSync("./public/assets")) {
    fs.mkdirSync("./public/assets");
}

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
        '.gif': 'file',
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
                build.onResolve({ filter: /.(jpg|jpeg|png|svg|gif)$/ }, (args) => {
                    args.path = args.path.replace("@", "")
                    return { path: path.resolve("assets", args.path) }
                })
            }
        },
        {
            name: "assets-json",
            setup(build) {
                build.onResolve({ filter: /^@json/ }, (args) => {
                    args.path = args.path.replace("@", "") + ".json"
                    return { path: path.resolve(args.path) }
                })
            }
        }
    ],
}

if (fs.existsSync(path.resolve(`assets/scss/preloader.scss`))) {
    options.entryPoints.push({ in: path.resolve(`assets/scss/preloader.scss`), out: path.resolve(options.outdir, "css", "preloader") })
}

const checkServices = async function (dir) {
    if (!fs.existsSync(dir)) {
        return {}
    }

    const services = []
    fs.readdirSync(dir).map(file => {
        if (file[0] != ".") {
            let service = {
                service: true,
                name: file,
                path: {}
            }
            if (fs.existsSync(path.join(dir, file, "cemjs.json"))) {
                let cemconfig = JSON.parse(fs.readFileSync(path.join(dir, file, "cemjs.json")))
                Object.assign(service, cemconfig)
            }
            if (fs.existsSync(path.join(dir, file, "index.ts"))) {
                service.path.js = `/assets/js/_${file}.js?ver=${service.version}`
                options.entryPoints.push({ in: path.join(dir, file, "index.ts"), out: path.resolve(options.outdir, "js", `_${file}`) })
            }

            services.push(service)
        }
    });
    return services
}

const checkFrontend = async function (dir) {
    if (!fs.existsSync(dir)) {
        return {}
    }
    const frontends = []
    fs.readdirSync(dir).map(file => {
        if (file[0] != ".") {
            let front = {
                front: true,
                name: file,
                path: {}
            }
            if (fs.existsSync(path.join(dir, file, "cemjs.json"))) {
                let cemconfig = JSON.parse(fs.readFileSync(path.join(dir, file, "cemjs.json")))
                Object.assign(front, cemconfig)
            }
            if (fs.existsSync(path.join(dir, file, "index.tsx"))) {
                front.path.js = `/assets/js/${file}.js?ver=${front.version}`
                options.entryPoints.push({ in: path.join(dir, file, "index.tsx"), out: path.resolve(options.outdir, "js", file) })
            }
            if (fs.existsSync(path.resolve(`assets/scss/${file}.scss`))) {
                front.path.css = `/assets/css/${file}.css?ver=${front.version}`
                options.entryPoints.push({ in: path.resolve(`assets/scss/${file}.scss`), out: path.resolve(options.outdir, "css", file) })
            }

            frontends.push(front)
        }
    });
    return frontends
}

const checkPage = async function (dir) {
    if (runProd) {
        cemconfig.live = false
    } else {
        cemconfig.live = true
    }
    let pages = []
    fs.readdirSync(dir).map(file => {
        if (file[0] != ".") {
            let page = JSON.parse(fs.readFileSync(path.join(dir, file)))
            pages.push(page)
        }
    });
    return pages
}

const start = async function () {
    const frontends = await checkFrontend(dirFrontends);
    fs.writeFileSync('./config/frontends.json', JSON.stringify(frontends));

    const services = await checkServices(dirServices);
    fs.writeFileSync('./config/services.json', JSON.stringify(services));

    const pages = await checkPage(dirPages)
    fs.writeFileSync('./config/pages.json', JSON.stringify(pages));
    fs.writeFileSync('./config/cemjs.json', JSON.stringify(cemconfig));

    if (runServe) {
        const ctx = await esbuild.context(options).catch(() => process.exit(1))
        console.log("⚡ Build complete! ⚡")
        const serve = await ctx.serve({ servedir: "public" })
        console.log(`\nWeb: http://127.0.0.1:${cemconfig.port}`)

        http.createServer((req, res) => {

            const options = {
                hostname: "127.0.0.1",
                port: serve.port,
                path: req.url,
                method: req.method,
                headers: req.headers,
            }

            let haveChange = false

            cemconfig.hook?.proxyWeb.map((item) => {
                if (req.url.startsWith(item.url)) {
                    options.port = item.port
                    options.hostname = item.host
                    options.headers.host = options.hostname
                    haveChange = true
                }
            })

            if (!haveChange && req.url !== "/esbuild" && !req.url.startsWith("/assets") && !req.url.startsWith("/contents") && !req.url.startsWith("/favicon.ico")) {
                req.url = "/"
            }
            proxy.web(req, res, { target: `http://${options.hostname}:${options.port}`, changeOrigin: true });

            proxy.on('error', function (err, req, res) {
                console.log('=proxy.on=', err)
                // res.writeHead(500, {
                //     'Content-Type': 'text/plain'
                // });
                // res.end('Something went wrong. And we are reporting a custom error message.');
            });

        }).listen(cemconfig.port)
        await ctx.watch()
    } else {
        console.log("🏃‍♂️ Start Build... 🏃‍♂️")
        await esbuild.build(options).catch(() => process.exit(1))
        console.log("⚡ Build complete! ⚡")
        process.exit(0)
    }
    return
}

start()