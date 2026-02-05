/**
 * requestIdleCallback Polyfill
 *
 * This utility provides a backward-compatible implementation of `window.requestIdleCallback` for environments
 * that do not support it natively. It allows scheduling low-priority background tasks to execute during
 * browser idle periods, ensuring that latency-critical events like animations and input responses remain smooth.
 *
 * Implementation Strategy:
 * 1. **MessageChannel as Scheduler**: Utilizes `MessageChannel` to schedule tasks. `MessageChannel` posts messages
 *    as macro-tasks, which allows the event loop to handle high-priority events (like rendering) between task executions.
 * 2. **Task Queue Management**: Maintains a FIFO queue of registered callbacks.
 * 3. **Time Budgeting**: Each execution cycle is allocated a small time budget (approx. 10ms) to process tasks.
 *    If the budget is exceeded, remaining tasks are deferred to the next cycle, yielding control back to the browser.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
 */

// Define types for requestIdleCallback and cancelIdleCallback
export type IdleCallbackHandle = number

export interface IdleDeadline {
  readonly didTimeout: boolean
  timeRemaining: () => number
}

export interface IdleRequestOptions {
  timeout?: number
}

export type IdleRequestCallback = (deadline: IdleDeadline) => void

declare global {
  interface Window {
    requestIdleCallback: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => IdleCallbackHandle
    cancelIdleCallback: (handle: IdleCallbackHandle) => void
  }
}

// Polyfill function
export const polyfillRequestIdleCallback = (): void => {
  if (
    globalThis.window === undefined ||
    (typeof globalThis.requestIdleCallback === 'function' &&
      typeof globalThis.cancelIdleCallback === 'function')
  ) {
    return
  }

  const taskQueue: Array<{
    id: IdleCallbackHandle
    callback: IdleRequestCallback
  }> = []
  let runTaskHandle: IdleCallbackHandle = 0
  let handleCounter: IdleCallbackHandle = 0
  const channel = new MessageChannel()

  channel.port1.start()
  channel.port1.addEventListener('message', () => {
    runTaskHandle = 0
    const startTime = performance.now()
    const deadline: IdleDeadline = {
      get didTimeout() {
        return false
      },
      timeRemaining: () => Math.max(0, 10 - (performance.now() - startTime)),
    }

    while (taskQueue.length > 0 && deadline.timeRemaining() > 1) {
      const task = taskQueue.shift()
      if (task) {
        try {
          task.callback(deadline)
        } catch (error) {
          console.error(error)
        }
      }
    }

    if (taskQueue.length > 0) {
      runTaskHandle = 1
      channel.port2.postMessage(undefined)
    }
  })

  globalThis.requestIdleCallback = (
    callback: IdleRequestCallback,
    _options?: IdleRequestOptions
  ): IdleCallbackHandle => {
    handleCounter++
    taskQueue.push({
      id: handleCounter,
      callback,
    })

    if (!runTaskHandle) {
      // Schedule the task execution.
      // We use `channel.port2.postMessage` to trigger the callback in the next event loop tick (macro-task).
      // This ensures the current call stack clears before the idle tasks begin.
      runTaskHandle = 1 // Just a flag
      channel.port2.postMessage(undefined)
    }

    return handleCounter
  }

  globalThis.cancelIdleCallback = (handle: IdleCallbackHandle): void => {
    const index = taskQueue.findIndex((task) => task.id === handle)
    if (index !== -1) {
      taskQueue.splice(index, 1)
    }
  }
}

export default polyfillRequestIdleCallback

// Auto-execute if in browser environment
if (globalThis.window !== undefined) {
  polyfillRequestIdleCallback()
}
