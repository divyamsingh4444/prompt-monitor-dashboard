/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatsResponse } from "../models/StatsResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class StatisticsService {
  /**
   * Get dashboard statistics
   * Returns dashboard statistics including device counts and prompt metrics.
   * @returns StatsResponse Successful response
   * @throws ApiError
   */
  public static getStats(): CancelablePromise<StatsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/stats",
      errors: {
        500: `Server error`,
      },
    });
  }
}
