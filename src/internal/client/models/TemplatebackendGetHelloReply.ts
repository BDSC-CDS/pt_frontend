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
 * @interface TemplatebackendGetHelloReply
 */
export interface TemplatebackendGetHelloReply {
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendGetHelloReply
     */
    content?: string;
}

/**
 * Check if a given object implements the TemplatebackendGetHelloReply interface.
 */
export function instanceOfTemplatebackendGetHelloReply(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendGetHelloReplyFromJSON(json: any): TemplatebackendGetHelloReply {
    return TemplatebackendGetHelloReplyFromJSONTyped(json, false);
}

export function TemplatebackendGetHelloReplyFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendGetHelloReply {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'content': !exists(json, 'content') ? undefined : json['content'],
    };
}

export function TemplatebackendGetHelloReplyToJSON(value?: TemplatebackendGetHelloReply | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'content': value.content,
    };
}

