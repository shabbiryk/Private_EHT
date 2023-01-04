export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}

export class Alert {
    type: AlertType;
    message: string;
}
