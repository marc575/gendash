import type { Config } from 'jest'
import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toContainElement(element: HTMLElement | null): R
      toHaveTextContent(text: string): R
    }
  }
}
