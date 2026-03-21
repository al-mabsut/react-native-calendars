"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoment = void 0;
let moment;
// Moment is an optional dependency
const getMoment = () => {
    if (!moment) {
        try {
            moment = require('moment');
        }
        catch {
            // Moment is not available
        }
    }
    return moment;
};
exports.getMoment = getMoment;
