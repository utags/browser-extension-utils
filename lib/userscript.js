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

export const addElement = (parentNode, tagName, attributes) =>
  GM_addElement(parentNode, tagName, attributes)

export const addStyle = (styleText) => GM_addStyle(styleText)
/* eslint-enable camelcase, new-cap */
