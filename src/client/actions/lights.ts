
import { message } from 'antd'
import { ActionCreator } from 'redux'

import { fetchGateway } from '@/actions/gateway'
import { START_TIMER, STOP_TIMER } from '@/redux-timers'
import { ThunkResult } from '@/types'
import { fetchGetJson, fetchPostJson } from '@/utils'
import { Dictionary, ILight } from 'shared/types'

export const LOAD_LIGHTS_REQUEST = 'LOAD_LIGHTS_REQUEST'
export const LOAD_LIGHTS_SUCCESS = 'LOAD_LIGHTS_SUCCESS'
export const LOAD_LIGHTS_FAILURE = 'LOAD_LIGHTS_FAILURE'

export const UPDATE_LIGHT_REQUEST = 'UPDATE_LIGHT_REQUEST'
export const UPDATE_LIGHT_SUCCESS = 'UPDATE_LIGHT_SUCCESS'
export const UPDATE_LIGHT_FAILURE = 'UPDATE_LIGHT_FAILURE'

export const LIGHT_STATE_CHANGED = 'LIGHT_STATE_CHANGED'

const loadLightsRequest = () => ({
    type: LOAD_LIGHTS_REQUEST
})

const loadLightsSuccess = (lights: Dictionary<ILight>) => ({
    type: LOAD_LIGHTS_SUCCESS,
    payload: lights
})

const loadLightsFailure = (error: Error) => ({
    type: LOAD_LIGHTS_FAILURE,
    payload: error
})

const updateLightRequest = () => ({
    type: UPDATE_LIGHT_REQUEST
})

const updateLightSuccess = () => ({
    type: UPDATE_LIGHT_SUCCESS
})

const updateLightFailure = (error: Error) => ({
    type: UPDATE_LIGHT_FAILURE,
    payload: error
})

export const lightStateChanged = (lightProps: ILight) => ({
    type: LIGHT_STATE_CHANGED,
    payload: lightProps
})

export const startLightPolling: ActionCreator<ThunkResult> = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollLights',
            dispatchFunc: fetchLights(),
            timerInterval: 30000
        }
    })

export const stopLightPolling: ActionCreator<ThunkResult> = () => (dispatch) =>
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollLights'
        }
    })

export const fetchLights: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        await dispatch(fetchGateway())
        dispatch(loadLightsRequest())
        const res = await fetchGetJson<Dictionary<ILight>>('/api/lights')

        if (!res.ok) throw new Error(res.json.message || res.statusText)

        dispatch(loadLightsSuccess(res.json))
    } catch (error) {
        message.error(`Failed to fetch lights: ${error.message}`)
        dispatch(loadLightsFailure(error))
        dispatch(stopLightPolling())
    }
}

export const updateLight: ActionCreator<ThunkResult> = (light: ILight) => async (dispatch) => {
    try {
        dispatch(updateLightRequest())
        const res = await fetchPostJson<void>(`/api/lights/${light.id}`, light)

        if (!res.ok) throw new Error(res.json.message || res.statusText)

        dispatch(updateLightSuccess())
    } catch (error) {
        message.error(`Failed to update light: ${error.message}`)
        dispatch(updateLightFailure(error))
    }
}