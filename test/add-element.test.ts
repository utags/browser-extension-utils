// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { addElement } from '../lib/add-element'

describe('addElement', () => {
  it('should add element to parent node', () => {
    const parent = document.createElement('div')
    const element = addElement(parent, 'span')
    expect(parent.children.length).toBe(1)
    expect(element?.tagName).toBe('SPAN')
    expect(element?.parentElement).toBe(parent)
  })

  it('should add element with attributes', () => {
    const parent = document.createElement('div')
    const element = addElement(parent, 'span', { id: 'test' })
    expect(element?.id).toBe('test')
  })

  it('should accept HTMLElement as tagName', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    const element = addElement(parent, child)
    expect(element).toBe(child)
    expect(child.parentElement).toBe(parent)
  })

  it('should use default parent (body) if parentNode is null', () => {
    const element = addElement(null, 'div')
    expect(element?.parentElement).toBe(document.body)
  })

  it('should use default parent (head) for style/script tags', () => {
    const element = addElement(null, 'style')
    expect(element?.parentElement).toBe(document.head)
  })

  it('should handle parentNode as string (selector) - though implementation recursive logic seems to handle parentNode as string as attributes?', () => {
    // Looking at the implementation:
    // if (typeof parentNode === 'string') {
    //   return addElement(
    //     null,
    //     parentNode, // this becomes tagName
    //     tagName as unknown as Record<string, unknown> // this becomes attributes
    //   )
    // }
    // So addElement('#id', 'div') is actually addElement(null, '#id', 'div' as attrs) which is weird if the intention was selector.
    // Let's re-read the code carefully.
    /*
    if (typeof parentNode === 'string') {
      return addElement(
        null,
        parentNode,
        tagName as unknown as Record<string, unknown>
      )
    }
    */
    // If I call addElement('div', { id: 'foo' }), parentNode is 'div', tagName is {id:'foo'}.
    // It calls addElement(null, 'div', {id:'foo'}).
    // So the first argument string is treated as tagName if parent is not provided!
    // The signature `parentNode: HTMLElement | string | null | undefined` suggests the first arg can be a string.
    // But the logic swaps it to tagName.

    const element = addElement('div', {
      id: 'shortcut',
    } as unknown as HTMLElement)
    expect(element?.tagName).toBe('DIV')
    expect(element?.id).toBe('shortcut')
    expect(element?.parentElement).toBe(document.body)
  })

  it('should return undefined if tagName is missing', () => {
    expect(addElement(document.body, '')).toBeUndefined()
  })
})
