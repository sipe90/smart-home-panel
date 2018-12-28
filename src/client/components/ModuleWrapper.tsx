import React from 'react'

import './ModuleWrapper.css'

interface IModuleWrapperProps {
    module: JSX.Element
}

const ModuleWrapper: React.FunctionComponent<IModuleWrapperProps> = (props) => {
    return (
        <div className='content-wrap'>
            {props.module}
        </div>
    )
}

export default ModuleWrapper