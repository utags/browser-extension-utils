import { setAttributes } from "./index.js"

export * from "./index.js"

/* eslint-disable camelcase, new-cap */
// eslint-disable-next-line no-unused-expressions, n/prefer-global/process
process.env.PLASMO_TAG === "dev" &&
  (() => {
    if (
      typeof GM_addElement !== "function" &&
      typeof document.GM_addElement === "function"
    ) {
      // eslint-disable-next-line no-global-assign
      GM_addElement = document.GM_addElement
      // eslint-disable-next-line no-global-assign
      GM_addStyle = document.GM_addStyle
    }
  })()

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
/* eslint-enable camelcase, new-cap */
