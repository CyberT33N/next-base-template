// components/Loader.js
import { Spinner } from '@nextui-org/react'

const Loader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spinner label="Loading..." color="secondary" />
        </div>
    )
}

export default Loader