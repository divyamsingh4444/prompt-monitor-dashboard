/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BlockedPrompt } from "../models/BlockedPrompt";
import type { Prompt } from "../models/Prompt";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class PromptsService {
  /**
   * Get device prompts
   * Returns all prompts captured from a specific device.
   * @param id Device ID
   * @returns Prompt Successful response
   * @throws ApiError
   */
  public static getDevicePrompts(id: string): CancelablePromise<Array<Prompt>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/devices/{id}/prompts",
      path: {
        id: id,
      },
      errors: {
        500: `Server error`,
      },
    });
  }
  /**
   * Get blocked prompts
   * Returns all blocked prompts (compliance events) for a device.
   * @param id Device ID
   * @returns BlockedPrompt Successful response
   * @throws ApiError
   */
  public static getBlockedPrompts(
    id: string,
  ): CancelablePromise<Array<BlockedPrompt>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/devices/{id}/blocked",
      path: {
        id: id,
      },
      errors: {
        500: `Server error`,
      },
    });
  }
  /**
   * Get prompt details
   * Returns detailed information about a specific prompt.
   * @param id Prompt ID
   * @returns Prompt Successful response
   * @throws ApiError
   */
  public static getPrompt(id: string): CancelablePromise<Prompt> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/prompt/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Prompt not found`,
        500: `Server error`,
      },
    });
  }
}
