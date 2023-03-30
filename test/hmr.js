// Append this code to output for live reload
export function enableHMR() {
  new EventSource("http://localhost:8002/esbuild").addEventListener(
    "change",

    () => {
      location.reload()
    }
  )
}

enableHMR()

const _log = console.log
const _error = console.error

console.log = (msg) => {
  _log(msg)
  const p = document.createElement("p")
  p.innerText = msg
  document.body.append(p)
}

console.error = (msg) => {
  _error(msg)
  const p = document.createElement("p")
  p.innerText = msg
  p.style.cssText = "color: red;"
  document.body.append(p)
}
