// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { setAttributes } from '../lib/set-attributes'

describe('setAttributes', () => {
  it('should set simple attributes', () => {
    const el = document.createElement('div')
    setAttributes(el, { id: 'my-id', title: 'my-title' })
    expect(el.id).toBe('my-id')
    expect(el.title).toBe('my-title')
  })

  it('should set style as string', () => {
    const el = document.createElement('div')
    setAttributes(el, { style: 'color: red; font-size: 12px;' })
    expect(el.style.color).toBe('red')
    expect(el.style.fontSize).toBe('12px')
  })

  it('should set style as object', () => {
    const el = document.createElement('div')
    setAttributes(el, { style: { color: 'blue', fontWeight: 'bold' } })
    expect(el.style.color).toBe('blue')
    expect(el.style.fontWeight).toBe('bold')
  })

  it('should set textContent', () => {
    const el = document.createElement('div')
    setAttributes(el, { textContent: 'hello world' })
    expect(el.textContent).toBe('hello world')
  })

  it('should set innerHTML', () => {
    const el = document.createElement('div')
    setAttributes(el, { innerHTML: '<span>inner</span>' })
    expect(el.innerHTML).toBe('<span>inner</span>')
  })

  it('should set event listeners', () => {
    const el = document.createElement('button')
    let clicked = false
    const onClick = () => {
      clicked = true
    }

    setAttributes(el, { onclick: onClick })
    el.click()
    expect(clicked).toBe(true)
  })

  it('should set value for input', () => {
    const el = document.createElement('input')
    setAttributes(el, { value: 'test-value' })
    expect(el.value).toBe('test-value')
  })

  it('should handle undefined values', () => {
    const el = document.createElement('div')
    setAttributes(el, { id: undefined })
    expect(el.id).toBe('')
  })

  it('should return null if element is null', () => {
    const result = setAttributes(null, { id: 'test' })
    expect(result).toBeNull()
  })

  it('should set custom attributes', () => {
    const el = document.createElement('div')
    setAttributes(el, { 'data-test': '123' })
    expect(el.dataset.test).toBe('123')
  })
})
