/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrowserHeartbeatRequest } from "../models/BrowserHeartbeatRequest";
import type { BrowserHeartbeatResponse } from "../models/BrowserHeartbeatResponse";
import type { RegisterBrowserRequest } from "../models/RegisterBrowserRequest";
import type { RegisterBrowserResponse } from "../models/RegisterBrowserResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class BrowsersService {
  /**
   * Register a browser instance
   * Register a browser instance discovered by the extension. Requires authentication.
   * @param requestBody
   * @returns RegisterBrowserResponse Browser registered successfully
   * @throws ApiError
   */
  public static registerBrowser(
    requestBody: RegisterBrowserRequest,
  ): CancelablePromise<RegisterBrowserResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/browsers/register",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Invalid request`,
        401: `Authentication required`,
        500: `Server error`,
      },
    });
  }
  /**
   * Send browser heartbeat
   * Update browser instance last_seen timestamp. Requires authentication.
   * @param requestBody
   * @returns BrowserHeartbeatResponse Heartbeat recorded successfully
   * @throws ApiError
   */
  public static browserHeartbeat(
    requestBody: BrowserHeartbeatRequest,
  ): CancelablePromise<BrowserHeartbeatResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/browsers/heartbeat",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        401: `Authentication required`,
        500: `Server error`,
      },
    });
  }
}
