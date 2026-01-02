/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExtensionStatusRequest } from "../models/ExtensionStatusRequest";
import type { ExtensionStatusResponse } from "../models/ExtensionStatusResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ExtensionService {
  /**
   * Report extension status
   * Report extension health status (enabled/disabled). Requires authentication.
   * @param requestBody
   * @returns ExtensionStatusResponse Status reported successfully
   * @throws ApiError
   */
  public static reportExtensionStatus(
    requestBody: ExtensionStatusRequest,
  ): CancelablePromise<ExtensionStatusResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/extension/status",
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
