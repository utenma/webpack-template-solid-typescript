import * as stylex from '@stylexjs/stylex'

export const styles = stylex.create({
    root: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panel: {
        padding: 16,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        color: 'white',
        backgroundColor: 'gray',
    },
    button: {
        backgroundColor: 'gray',
        color: 'white',
        border: '1px solid white',
        padding: 8,
        borderRadius: 4,
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
            backgroundColor: 'white',
            color: 'gray',
            transform: 'scale(1.1)',
        }
    }
})

