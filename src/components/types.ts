
export interface IStatus {
    date: string;
    available: boolean;
    responseTime?: number;
}

export interface IComponent {
    name: string;
    delayInMinutes: number;
    status: IStatus[];
}

export interface IValue {
    date: string;
    value?: number;
}

export interface IMetric {
    name: string;
    delayInMinutes: number;
    values: IValue[];
}

export interface IGroup {
    name: string;
    components: IComponent[];
    metrics: IMetric[];
}

export interface IGroupsQuery {
    groups: IGroup[];
}