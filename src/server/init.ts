import * as db from '#/db'
import logger from '#/logger'
import { setupFlux } from '#/service/flux-service'
import { connectToGateway } from '#/service/gateway-connection-manager'
import { fetchGateway } from '#/service/gateway-service'

const logError = (logMsg: string) => (err: Error) => {
    logger.error(logMsg, err)
    return Promise.reject(err)
}

export default async (env: string) => {
    try {
        logger.info('Initializing application')

        await db.init(env).catch(logError('Failed to connect to LokiJS database.'))

        logger.info('Successfully connected to LokiJS database')

        logger.info('Fetching gateway from database')
        const gateway = await fetchGateway()

        if (!gateway) {
            logger.info('No gateway found from database')
            return true
        }

        logger.info('Found gateway from database')

        await connectToGateway(gateway).catch(logError('Failed to connect to Gateway'))

        logger.info('Finished connecting to gateway')

        logger.info('Setting up flux')

        await setupFlux()

        return true
    } catch (err) {
        logger.error('Initialization failed')
        logger.error(err)
        return false
    }
}
