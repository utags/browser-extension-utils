import {
  setAttributes,
  addElement as _addElement,
  addStyle as _addStyle,
} from "./index.js"

export * from "./index.js"

// eslint-disable-next-line no-unused-expressions, n/prefer-global/process
process.env.PLASMO_TAG === "dev" &&
  (() => {
    /* eslint-disable camelcase */
    console.log(
      typeof GM_addElement,
      typeof GM_addStyle,
      typeof GM_registerMenuCommand,
      typeof GM
    )
    /* eslint-enable camelcase */
    const functions = document.GMFunctions
    if (typeof functions === "object") {
      for (const key in functions) {
        if (Object.hasOwn(functions, key)) {
          window[key] = functions[key]
        }
      }
    }
  })()

/* eslint-disable new-cap, camelcase */
export const addElement =
  typeof GM_addElement === "function"
    ? (parentNode, tagName, attributes) => {
        if (typeof parentNode === "string" || typeof tagName === "string") {
          const element = GM_addElement(parentNode, tagName)
          setAttributes(element, attributes)
          return element
        }

        // tagName: HTMLElement
        setAttributes(tagName, attributes)
        parentNode.append(tagName)
        return tagName
      }
    : _addElement

export const addStyle =
  typeof GM_addStyle === "function"
    ? (styleText) => GM_addStyle(styleText)
    : _addStyle

// Only register menu on top frame
export const registerMenuCommand = (name, callback, accessKey) => {
  if (window !== top || !GM || !GM.registerMenuCommand) {
    return
  }

  GM.registerMenuCommand(name, callback, accessKey)
}
/* eslint-enable new-cap, camelcase */
