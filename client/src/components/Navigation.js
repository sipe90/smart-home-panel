import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Menu } from 'antd'

import 'components/Navigation.css'

const { Item } = Menu

const Navigation = (props) => {
    return (
        <Menu theme="dark">
            {
                props.routes.map((route, index) => (
                    <Item key={index}>
                        <Link to={route.path} className='nav-item'>
                            {route.icon}
                            { !props.collapsed &&
                                <span>{route.text}</span>
                            }
                        </Link>
                    </Item>
                ))
            }
        </Menu>
    )
}

Navigation.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.oneOfType([
                PropTypes.func.isRequired,
                PropTypes.element.isRequired
            ]),
            text: PropTypes.string.isRequired
        })
    ).isRequired
}

export default Navigation
