import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'

import GatewayCard from 'components/gateway/GatewayCard'
import GatewayWizard from 'components/gateway/GatewayWizard'

import 'components/gateway/Gateway.css'

class Gateway extends Component {

    componentDidMount() {
        this.props.loadGateway()
        this.props.startGatewayPolling()
    }

    componentWillUnmount() {
        this.props.stopGatewayPolling()
    }

    render() {
        return (
            <div>
                <Spin spinning={this.props.initialDataLoading} className='spinner' indicator={<Icon type="loading" className='spinner__icon' spin />}>
                    {this.props.gateway ?
                        <GatewayCard
                            gateway={this.props.gateway}
                            gatewayStateChanged={this.props.gatewayStateChanged}
                            saveGateway={this.props.saveGateway} />
                        :
                        <GatewayWizard />}
                </Spin>
            </div>
        )
    }
}

Gateway.propTypes = {
    gateway: PropTypes.object,
    loadGateway: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    gatewayStateChanged: PropTypes.func.isRequired,
    saveGateway: PropTypes.func.isRequired,
    startGatewayPolling: PropTypes.func.isRequired,
    stopGatewayPolling: PropTypes.func.isRequired
}

export default Gateway
