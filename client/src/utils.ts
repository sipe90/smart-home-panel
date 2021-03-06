import { PayloadAction } from '#/types'
import * as R from 'ramda'
import { Action, AnyAction, Reducer } from 'redux'

import { Dictionary, Device, Group, Light } from 'shared'

export const devicesForGroup = (group: Group, devices: Dictionary<Device>) =>
    R.values(R.pick(R.map(String, group.devices), devices))

export const lightsForGroup = (group: Group, lights: Dictionary<Light>) =>
    R.values(R.pick(R.map(String, group.devices), lights))

export const percentFormatter = (v: number | undefined) => `${v !== undefined ? v : '?'}%`

type ActionReducePair<S, A extends Action> = [A['type'], (state: S, action: A) => S]
type ActionPredicateReducePair<S, A extends Action> = [(type: A['type']) => boolean, () => S]

export type ActionReducers<S, A extends Action = PayloadAction> = Array<ActionReducePair<S, A>>

export const createReducer = <S, A extends Action = AnyAction>(
    actionReducers: ActionReducers<S, A>,
    initialState: S
): Reducer<S, A> =>
    (state: S | undefined, action: A) =>
        R.cond<A['type'], S>(
            R.map<ActionReducePair<S, A>, ActionPredicateReducePair<S, A>>(
                ([type, reduce]) => [R.equals(type), () => reduce(state || initialState, action)],
                actionReducers
            )
                .concat([[R.T, R.always(state || initialState)]]),
        )(action.type)

type JsonResponse<E> = ({
    headers: Headers
    status: number
    statusText: string
} & ({
    ok: true
    json: E
} | {
    ok: false
    json: ErrorResponse | null
})
)

interface ErrorResponse {
    field: string
    message: string
    stack?: string
}

const isJsonResponse = (headers: Headers) => (headers.get('content-type') || '').includes('application/json')

const fetchJson = async <E>(url: string, init?: RequestInit): Promise<JsonResponse<E>> => {
    const res = await fetch(url, init)
    const { headers, json, ok, status, statusText } = res

    const resJson = isJsonResponse(headers) ? await json.call(res) : null

    return ok ? {
        headers,
        json: resJson as E,
        ok,
        status,
        statusText,
    } : {
            headers,
            json: resJson as ErrorResponse,
            ok,
            status,
            statusText,
        }
}

export const fetchGetJson = <E = any>(url: string) => fetchJson<E>(url)

export const fetchPostJson = <E = any>(url: string, body?: object | string) =>
    fetchJson<E>(url, {
        body: typeof body === 'string' ? body : JSON.stringify(body),
        headers: typeof body === 'undefined' ? undefined : { 'content-type': 'application/json' },
        method: 'POST',
    })

export const fetchDeleteJson = <E = any>(url: string) => fetchJson<E>(url, { method: 'DELETE' })
