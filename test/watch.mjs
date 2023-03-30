import * as esbuild from "esbuild"

const ctx = await esbuild.context({
  entryPoints: ["test/index.js"],
  bundle: true,
  inject: ["test/hmr.js"],
  target: ["chrome58", "firefox57", "safari11", "edge16"],
  outfile: "test/index.dist.js",
})

await ctx.watch()
console.log("watching...")

const { host, port } = await ctx.serve({
  servedir: "test",
})
console.log(`Server is running at http://${host}:${port}/`)
console.log("Hit CTRL-C to stop the server")

// Append this code to output for live reload
// new EventSource("http://localhost:8000/esbuild").addEventListener("change", () => location.reload())

