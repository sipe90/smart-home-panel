import R from 'ramda'

import { normalizeLights } from '#/data/tradfri'
import { getConnection, isGatewayConnected } from '#/service/gateway-connection-manager'
import { getGateway } from '#/service/gateway-service'
import { Light } from 'shared'

export const getLights = async () => {
    const gateway = await getGateway()
    if (!gateway || !isGatewayConnected()) return []
    return normalizeLights(getConnection().getLights())
}

export const updateLight = async (light: Light) => {
    const gateway = await getGateway()
    if (!gateway) {
        throw new Error('Not connected to a gateway')
    }
    if (!R.contains(light.id, gateway.lights)) {
        throw new Error(`No light found with id: ${light.id}`)
    }

    const connection = getConnection()

    await connection.updateLight(String(light.id), toLightUpdate(light))
    await connection.operateLight(String(light.id), toLightOperation(light))
}

const toLightUpdate = (light: Light) => ({
    name: light.name
})

const toLightOperation = (light: Light) => ({
    onOff: light.on !== null ? light.on : undefined,
    dimmer: light.brightness !== null ? light.brightness : undefined,
    colorTemperature: light.colorTemperature !== null ? light.colorTemperature : undefined
})
