
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Diff<T extends string, U extends string> = ({[P in T]: P} &
    {[P in U]: never} & {[x: string]: never})[T]
