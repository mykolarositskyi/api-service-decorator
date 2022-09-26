export type Promised<SuccessResponse, FailureResponse> = Promise<SuccessResponse | FailureResponse | void>
