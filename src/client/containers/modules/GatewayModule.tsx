import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import {
    fetchGateway, gatewayStateChanged, saveGateway,
    startGatewayPolling, stopGatewayPolling,
} from '@/actions/gateway'

import GatewayComponent from '@/components/gateway/Gateway'
import { IGateway } from 'shared/types'

interface IGatewayModuleProps {
    gateway: IGateway
    initialDataLoading: boolean
    loadGateway: () => void
    gatewayStateChanged: (gateway: IGateway) => void
    saveGateway: (gateway: IGateway) => void
    startGatewayPolling: () => void
    stopGatewayPolling: () => void
}

class GatewayModule extends Component<IGatewayModuleProps> {

    public componentDidMount() {
        this.props.loadGateway()
        this.props.startGatewayPolling()
    }

    public componentWillUnmount() {
        this.props.stopGatewayPolling()
    }

    public render() {
        return (
            <GatewayComponent
                gateway={this.props.gateway}
                initialDataLoading={this.props.initialDataLoading}
                gatewayStateChanged={this.props.gatewayStateChanged}
                saveGateway={this.props.saveGateway}
            />
        )
    }

}

const mapStateToProps = (state: any) => ({
    gateway: state.entities.gateway,
    initialDataLoading: state.modules.gateway.initialDataLoading,
})

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    gatewayStateChanged: (gateway: IGateway) => dispatch(gatewayStateChanged(gateway)),
    loadGateway: () => dispatch(fetchGateway()),
    saveGateway: (gateway: IGateway) => dispatch(saveGateway(gateway)),
    startGatewayPolling: () => dispatch(startGatewayPolling()),
    stopGatewayPolling: () => dispatch(stopGatewayPolling()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(GatewayModule)