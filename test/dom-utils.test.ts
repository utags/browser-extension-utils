// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAttribute, setAttributeForce, setAttribute } from '../lib/dom-utils'

describe('DOM Utilities', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
  })

  describe('getAttribute', () => {
    it('should return the attribute value if it exists', () => {
      element.dataset.test = 'value'
      expect(getAttribute(element, 'data-test')).toBe('value')
    })

    it('should return undefined if the attribute does not exist', () => {
      expect(getAttribute(element, 'non-existent')).toBeUndefined()
    })

    it('should return undefined if the element is null', () => {
      expect(getAttribute(null, 'data-test')).toBeUndefined()
    })

    it('should return undefined if the element is undefined', () => {
      expect(getAttribute(undefined, 'data-test')).toBeUndefined()
    })

    it('should return undefined if the object does not have getAttribute method', () => {
      const invalidElement = {} as unknown as HTMLElement
      expect(getAttribute(invalidElement, 'data-test')).toBeUndefined()
    })

    it('should return empty string if the attribute value is empty string', () => {
      element.setAttribute('data-empty', '')
      expect(getAttribute(element, 'data-empty')).toBe('')
    })

    it('should return "null" string if the attribute value is "null"', () => {
      element.setAttribute('data-null', 'null')
      expect(getAttribute(element, 'data-null')).toBe('null')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      element.setAttribute('data-null', null as any)
      expect(getAttribute(element, 'data-null')).toBe('null')
    })

    it('should return "undefined" string if the attribute value is "undefined"', () => {
      element.setAttribute('data-undefined', 'undefined')
      expect(getAttribute(element, 'data-undefined')).toBe('undefined')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      element.setAttribute('data-undefined', undefined as any)
      expect(getAttribute(element, 'data-undefined')).toBe('undefined')
    })
  })

  describe('setAttributeForce', () => {
    it('should set the attribute on the element', () => {
      setAttributeForce(element, 'data-test', 'value')
      expect(element.dataset.test).toBe('value')
    })

    it('should update the attribute even if the value is the same (force)', () => {
      element.dataset.test = 'value'
      const spy = vi.spyOn(element, 'setAttribute')
      setAttributeForce(element, 'data-test', 'value')
      expect(spy).toHaveBeenCalledWith('data-test', 'value')
      expect(element.dataset.test).toBe('value')
    })

    it('should handle null element gracefully', () => {
      expect(() => {
        setAttributeForce(null, 'data-test', 'value')
      }).not.toThrow()
    })

    it('should handle undefined element gracefully', () => {
      expect(() => {
        setAttributeForce(undefined, 'data-test', 'value')
      }).not.toThrow()
    })
  })

  describe('setAttribute', () => {
    it('should set the attribute if the value is different', () => {
      const spy = vi.spyOn(element, 'setAttribute')
      setAttribute(element, 'data-test', 'value')
      expect(spy).toHaveBeenCalledWith('data-test', 'value')
      expect(element.dataset.test).toBe('value')
    })

    it('should update the attribute if the value is different from existing', () => {
      element.dataset.test = 'old-value'
      const spy = vi.spyOn(element, 'setAttribute')
      setAttribute(element, 'data-test', 'new-value')
      expect(spy).toHaveBeenCalledWith('data-test', 'new-value')
      expect(element.dataset.test).toBe('new-value')
    })

    it('should NOT set the attribute if the value is the same', () => {
      element.dataset.test = 'value'
      const spy = vi.spyOn(element, 'setAttribute')
      setAttribute(element, 'data-test', 'value')
      expect(spy).not.toHaveBeenCalled()
      expect(element.dataset.test).toBe('value')
    })

    it('should handle null element gracefully', () => {
      expect(() => {
        setAttribute(null, 'data-test', 'value')
      }).not.toThrow()
    })

    it('should handle undefined element gracefully', () => {
      expect(() => {
        setAttribute(undefined, 'data-test', 'value')
      }).not.toThrow()
    })

    it('should set empty string value', () => {
      setAttribute(element, 'data-empty', '')
      expect(element.getAttribute('data-empty')).toBe('')
    })

    it('should set "null" string value', () => {
      setAttribute(element, 'data-null', 'null')
      expect(element.getAttribute('data-null')).toBe('null')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setAttribute(element, 'data-null', null as any)
      expect(element.getAttribute('data-null')).toBe('null')
    })

    it('should set "undefined" string value', () => {
      setAttribute(element, 'data-undefined', 'undefined')
      expect(element.getAttribute('data-undefined')).toBe('undefined')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setAttribute(element, 'data-undefined', undefined as any)
      expect(element.getAttribute('data-undefined')).toBe('undefined')
    })
  })
})
