import { doc } from './dom-utils'
import { setAttributes } from './set-attributes'

export const createElement = (
  tagName: string,
  attributes?: Record<string, unknown>
): HTMLElement =>
  setAttributes(
    doc.createElement(tagName),
    attributes
  ) as unknown as HTMLElement
