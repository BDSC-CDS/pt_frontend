/* tslint:disable */
/* eslint-disable */
/**
 * pt backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * Contact: development.bdsc@chuv.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface IndexServiceCreateHelloRequest
 */
export interface IndexServiceCreateHelloRequest {
    /**
     * 
     * @type {string}
     * @memberof IndexServiceCreateHelloRequest
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof IndexServiceCreateHelloRequest
     */
    content?: string;
}

/**
 * Check if a given object implements the IndexServiceCreateHelloRequest interface.
 */
export function instanceOfIndexServiceCreateHelloRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function IndexServiceCreateHelloRequestFromJSON(json: any): IndexServiceCreateHelloRequest {
    return IndexServiceCreateHelloRequestFromJSONTyped(json, false);
}

export function IndexServiceCreateHelloRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IndexServiceCreateHelloRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'title': !exists(json, 'title') ? undefined : json['title'],
        'content': !exists(json, 'content') ? undefined : json['content'],
    };
}

export function IndexServiceCreateHelloRequestToJSON(value?: IndexServiceCreateHelloRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'content': value.content,
    };
}

