"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultLocale = exports.getCalendarDateString = void 0;
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const isDate_1 = __importDefault(require("lodash/isDate"));
const isString_1 = __importDefault(require("lodash/isString"));
const isNumber_1 = __importDefault(require("lodash/isNumber"));
const xdate_1 = __importDefault(require("xdate"));
const { getLocale } = require('../dateutils');
const { padNumber, toMarkingFormat } = require('../interface');
function getCalendarDateString(date) {
    if (!(0, isUndefined_1.default)(date)) {
        if ((0, isDate_1.default)(date) && !isNaN(date.getFullYear())) {
            return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
        }
        else if ((0, isString_1.default)(date)) {
            // issue with strings and XDate's utc-mode - returns one day before
            return toMarkingFormat(new xdate_1.default(date, false));
        }
        else if ((0, isNumber_1.default)(date)) {
            return toMarkingFormat(new xdate_1.default(date, true));
        }
        throw 'Invalid Date';
    }
}
exports.getCalendarDateString = getCalendarDateString;
function getDefaultLocale() {
    return getLocale();
}
exports.getDefaultLocale = getDefaultLocale;
exports.default = {
    getCalendarDateString,
    getDefaultLocale
};
