export type NotificationErrorProps = {
    message: string;
    context: string;
}

export default class Notification {
    private _errors: NotificationErrorProps[] = [];

    addError(error: NotificationErrorProps) {
        this._errors.push(error);
    }

    hasErrors(): boolean {
        return this._errors.length > 0;
    }

    messages(context?: string): string {
        return this._errors
            .filter((error) => context === undefined || error.context === context)
            .map((error) => `${error.context}: ${error.message}`)
            .join(",");
    }

    get errors(): NotificationErrorProps[] {
        return this._errors;
    }
}