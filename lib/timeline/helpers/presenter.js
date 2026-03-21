"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcTimeOffset = exports.buildTimeString = exports.calcDateByPosition = exports.calcTimeByPosition = void 0;
const xdate_1 = __importDefault(require("xdate"));
const constants_1 = __importDefault(require("../../commons/constants"));
const dateutils_1 = require("../../dateutils");
function calcTimeByPosition(yPosition, hourBlockHeight) {
    let time = yPosition / hourBlockHeight;
    time = Math.floor(time * 2) / 2;
    const hour = Math.floor(time);
    const minutes = (time - Math.floor(time)) * 60;
    return { hour, minutes };
}
exports.calcTimeByPosition = calcTimeByPosition;
function calcDateByPosition(xPosition, timelineLeftInset, numberOfDays = 1, firstDate = new xdate_1.default()) {
    const timelineWidth = constants_1.default.screenWidth - timelineLeftInset;
    const dayWidth = timelineWidth / numberOfDays;
    const positionIndex = Math.floor((xPosition - timelineLeftInset) / dayWidth);
    return (0, dateutils_1.generateDay)(firstDate, positionIndex);
}
exports.calcDateByPosition = calcDateByPosition;
function buildTimeString(hour = 0, minutes = 0, date = '') {
    return `${date} ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`.trimStart();
}
exports.buildTimeString = buildTimeString;
function calcTimeOffset(hourBlockHeight, hour, minutes) {
    const now = new Date();
    const h = hour ?? now.getHours();
    const m = minutes ?? now.getMinutes();
    return (h + m / 60) * hourBlockHeight;
}
exports.calcTimeOffset = calcTimeOffset;
