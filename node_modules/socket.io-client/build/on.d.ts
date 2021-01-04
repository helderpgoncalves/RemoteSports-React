import Emitter = require("component-emitter");
export declare function on(obj: Emitter, ev: string, fn: (err?: any) => any): {
    destroy: () => void;
};
