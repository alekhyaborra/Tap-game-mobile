import { AwesomeCordovaNativePlugin } from '@awesome-cordova-plugins/core';
/**
 * @name Data Sync
 * @description
 * This plugin does something
 *
 * @usage
 * ```typescript
 * import { DataSync } from '@ionic-native/data-sync';
 *
 *
 * constructor(private dataSync: DataSync) { }
 *
 * ...
 *
 *
 * this.dataSync.functionName('Hello', 123)
 *   .then((res: any) => console.log(res))
 *   .catch((error: any) => console.error(error));
 *
 * ```
 */
export declare class DataSyncOriginal extends AwesomeCordovaNativePlugin {
    /**
     * This function does something
     * @param arg1 {string} Some param to configure something
     * @param arg2 {number} Another param to configure something
     * @return {Promise<any>} Returns a promise that resolves when something happens
     */
    coolMethod(options: {}): Promise<any>;
}

export declare const DataSync: DataSyncOriginal;