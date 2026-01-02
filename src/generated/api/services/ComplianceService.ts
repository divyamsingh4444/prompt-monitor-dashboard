/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComplianceEventRequest } from "../models/ComplianceEventRequest";
import type { ComplianceEventResponse } from "../models/ComplianceEventResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ComplianceService {
  /**
   * Report compliance event
   * Report a compliance violation or tampering attempt. Requires authentication.
   * @param requestBody
   * @returns ComplianceEventResponse Event reported successfully
   * @throws ApiError
   */
  public static reportComplianceEvent(
    requestBody: ComplianceEventRequest,
  ): CancelablePromise<ComplianceEventResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/compliance/event",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Invalid request`,
        401: `Authentication required`,
        500: `Server error`,
      },
    });
  }
}
