
import { message } from 'antd'
import { Dictionary } from 'ramda'
import { ActionCreator } from 'redux'

import { fetchGateway } from '@/actions/gateway'
import { START_TIMER, STOP_TIMER } from '@/redux-timers'
import { ThunkResult } from '@/types'
import { fetchGetJson, fetchPostJson } from '@/utils'
import { ISensor } from 'shared/types'

export const LOAD_SENSORS_REQUEST = 'LOAD_SENSORS_REQUEST'
export const LOAD_SENSORS_SUCCESS = 'LOAD_SENSORS_SUCCESS'
export const LOAD_SENSORS_FAILURE = 'LOAD_SENSORS_FAILURE'

export const UPDATE_SENSOR_REQUEST = 'UPDATE_SENSOR_REQUEST'
export const UPDATE_SENSOR_SUCCESS = 'UPDATE_SENSOR_SUCCESS'
export const UPDATE_SENSOR_FAILURE = 'UPDATE_SENSOR_FAILURE'

export const SENSOR_STATE_CHANGED = 'SENSOR_STATE_CHANGED'

const loadSensorsRequest = () => ({
    type: LOAD_SENSORS_REQUEST
})

const loadSensorsSuccess = (sensors: Dictionary<ISensor>) => ({
    type: LOAD_SENSORS_SUCCESS,
    payload: sensors
})

const loadSensorsFailure = (error: Error) => ({
    type: LOAD_SENSORS_FAILURE,
    payload: error
})

const updateSensorRequest = () => ({
    type: UPDATE_SENSOR_REQUEST
})

const updateSensorSuccess = () => ({
    type: UPDATE_SENSOR_SUCCESS
})

const updateSensorFailure = (error: Error) => ({
    type: UPDATE_SENSOR_FAILURE,
    payload: error
})

export const sensorStateChanged = (sensorProps: ISensor) => ({
    type: SENSOR_STATE_CHANGED,
    payload: sensorProps
})

export const startSensorPolling: ActionCreator<ThunkResult> = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollSensors',
            dispatchFunc: fetchSensors(),
            timerInterval: 30000
        }
    })

export const stopSensorPolling: ActionCreator<ThunkResult> = () => (dispatch) =>
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollSensors'
        }
    })

export const fetchSensors: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        await dispatch(fetchGateway())
        await dispatch(loadSensorsRequest())
        const res = await fetchGetJson<Dictionary<ISensor>>('/api/sensors')

        if (!res.ok) throw new Error(res.json.message || res.statusText)

        dispatch(loadSensorsSuccess(res.json))
    } catch (error) {
        message.error(`Failed to fetch sensors: ${error.message}`)
        dispatch(loadSensorsFailure(error))
        dispatch(stopSensorPolling())
    }
}

export const updateSensor: ActionCreator<ThunkResult> = (sensor: ISensor) => async (dispatch) => {
    try {
        dispatch(updateSensorRequest())
        const res = await fetchPostJson<void>(`/api/sensors/${sensor.id}`, sensor)

        if (!res.ok) throw new Error(res.json.message || res.statusText)

        dispatch(updateSensorSuccess())
    } catch (error) {
        message.error(`Failed to update sensor: ${error.message}`)
        dispatch(updateSensorFailure(error))
    }
}