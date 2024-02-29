import * as stylex from '@stylexjs/stylex'
import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { styles } from './styles'

export const App: Component = () => {
    const [count, setCount] = createSignal(0)

    return (
        <div {...stylex.props(styles.root)}>
            <div {...stylex.props(styles.panel)}>
                <button {...stylex.props(styles.button)}
                    onClick={() => setCount(count() + 1)}>
                    Increment
                </button>
                Count value is {count()}
            </div>
        </div>
    )
}

