import { getRootElement } from './dom-utils'
import { createElement } from './create-element'
import { setAttributes } from './set-attributes'

export const addElement = (
  parentNode: HTMLElement | string | null | undefined,
  tagName: string | HTMLElement,
  attributes?: Record<string, unknown>
): HTMLElement | undefined => {
  if (typeof parentNode === 'string') {
    return addElement(
      null,
      parentNode,
      tagName as unknown as Record<string, unknown>
    )
  }

  if (!tagName) {
    return undefined
  }

  if (!parentNode) {
    parentNode = /^(script|link|style|meta)$/.test(tagName as string)
      ? getRootElement(1)
      : getRootElement(2)
  }

  if (typeof tagName === 'string') {
    const element = createElement(tagName, attributes)
    parentNode.append(element)
    return element
  }

  // tagName: HTMLElement
  setAttributes(tagName, attributes)
  parentNode.append(tagName)
  return tagName
}
