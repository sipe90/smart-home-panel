import React, { Component } from 'react'
import { List, Button, Switch, Slider, Popover, Input } from 'antd'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import PencilIcon from 'mdi-react/PencilIcon'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import StatusIndicator from 'components/StatusIndicator'

import 'components/lights/LightItem.css'

const getDescription = R.cond([
    [R.propEq('spectrum', 'white'), R.always('White spectrum light bulb')],
    [R.propEq('spectrum', 'rgb'), R.always('RGB spectrum light bulb')],
    [R.T, R.always('Light bulb')]
])

const percentFormatter = (v) => `${v}%`

const initialState = {
    editNameVisible: false,
    editNameText: ''
}

class LightItem extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        return (
            <List.Item>
                <List.Item.Meta
                    className='light-item__meta'
                    title={this.title(this.props)}
                    description={getDescription(this.props.light)} />
                {this.controlTable(this.props)}
            </List.Item>
        )
    }

    title({ light }) {
        return (
            <div className='light-item__title'>
                <StatusIndicator type='light' on={light.on} alive={light.alive}/>
                <span>{light.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    visible={this.state.editNameVisible}
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <span className='light-item__name-edit'>
                        <PencilIcon size={12} />
                    </span>
                </Popover>
            </div>
        )
    }

    editName() {
        return (
            <div className='light-item__popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged.bind(this)} />
                <Button type='primary' size='small' onClick={this.updateName.bind(this)} >Update</Button>
            </div>
        )
    }

    onEditNameVisibleChanged(visible) {
        visible && this.setState({ editNameText: this.props.light.name })
        this.setState({ editNameVisible: visible })
    }

    editNameChanged(event) {
        this.setState({ editNameText: event.target.value })
    }

    updateName() {
        const newLightState = { ...this.props.light, name: this.state.editNameText }
        this.props.updateLight(newLightState)
        this.props.lightStateChanged(newLightState)
        this.setState({ editNameVisible: false })
    }

    powerSwitched(newValue) {
        const newLightState = { ...this.props.light, on: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(newLightState)
    }

    brightnessChanged(newValue) {
        const newLightState = { ...this.props.light, brightness: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(newLightState)
    }

    temperatureChanged(newValue) {
        const newLightState = { ...this.props.light, colorTemperature: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(newLightState)
    }

    controlTable({ light }) {
        return (
            <table className='light-item__table'>
                <tbody>
                    <tr>
                        <td><LightbulbOnOutlineIcon size={18} /></td>
                        <td><span>Power</span></td>
                        <td>
                            <Switch
                                size='small'
                                checked={light.on}
                                disabled={!light.switchable || !light.alive}
                                onChange={this.powerSwitched.bind(this)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><Brightness5Icon size={18} /></td>
                        <td><span>Brightness</span></td>
                        <td>
                            <Slider
                                min={1}
                                max={100}
                                value={light.brightness}
                                disabled={!light.dimmable || !light.alive}
                                onChange={this.brightnessChanged.bind(this)}
                                onAfterChange={() => null}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><ThermometerIcon size={18} /></td>
                        <td><span>Temperature</span></td>
                        <td>
                            <Slider
                                min={1}
                                max={100}
                                value={light.colorTemperature}
                                disabled={light.spectrum === 'none' || !light.alive}
                                onChange={this.temperatureChanged.bind(this)}
                                onAfterChange={() => null}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

LightItem.propTypes = {
    light: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        alive: PropTypes.bool.isRequired,
        on: PropTypes.bool.isRequired,
        switchable: PropTypes.bool.isRequired,
        dimmable: PropTypes.bool.isRequired,
        brightness: PropTypes.number.isRequired,
        model: PropTypes.string.isRequired,
        spectrum: PropTypes.string.isRequired,
        colorTemperature: PropTypes.number,
    }),
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default LightItem
