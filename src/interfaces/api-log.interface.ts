export interface IApiLog {
    pinRef?: string;

    uniqueId?: string;

    msisdn: string;

    requestType: string;

    startTime: Date;

    endTime?: Date;

    duration?: number;

    submissionStatus?: string;

    tpResultCode?: string;

    tpResultMsg?: string;

    tpRequestPayload?: string;

    tpResponsePayload?: string;

    error?: string;
}