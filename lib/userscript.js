import { setAttributes } from "./index.js"

export * from "./index.js"

// eslint-disable-next-line no-unused-expressions, n/prefer-global/process
process.env.PLASMO_TAG === "dev" &&
  (() => {
    const functions = document.GMFunctions
    if (typeof functions === "object") {
      for (const key in functions) {
        if (Object.hasOwn(functions, key)) {
          window[key] = functions[key]
        }
      }
    }
  })()

/* eslint-disable new-cap */
export const addElement = (parentNode, tagName, attributes) => {
  if (typeof parentNode === "string" || typeof tagName === "string") {
    const element = GM_addElement(parentNode, tagName, attributes)
    setAttributes(element, attributes)
    return element
  }

  // tagName: HTMLElement
  setAttributes(tagName, attributes)
  parentNode.append(tagName)
  return tagName
}

export const addStyle = (styleText) => GM_addStyle(styleText)

// Only register menu on top frame
export const registerMenuCommand = (name, callback, accessKey) =>
  window === top && GM_registerMenuCommand(name, callback, accessKey)
/* eslint-enable new-cap */
