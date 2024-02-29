import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

export const App: Component = () => {
    const [count, setCount] = createSignal(0)

    return (
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 16px;">
            <button onClick={() => setCount(count() + 1)}>
                Increment
            </button>
            Count value is {count()}
        </div>
    )
}
