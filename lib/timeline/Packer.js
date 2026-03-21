"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUnavailableHoursBlocks = exports.populateEvents = exports.HOUR_BLOCK_HEIGHT = void 0;
const inRange_1 = __importDefault(require("lodash/inRange"));
const xdate_1 = __importDefault(require("xdate"));
const constants_1 = __importDefault(require("../commons/constants"));
exports.HOUR_BLOCK_HEIGHT = 100;
const OVERLAP_EVENTS_SPACINGS = 10;
const RIGHT_EDGE_SPACING = 10;
function buildEvent(event, left, width, { dayStart = 0, hourBlockHeight = exports.HOUR_BLOCK_HEIGHT }) {
    const startTime = new xdate_1.default(event.start);
    const endTime = event.end ? new xdate_1.default(event.end) : new xdate_1.default(startTime).addHours(1);
    const dayStartTime = new xdate_1.default(startTime).clearTime();
    return {
        ...event,
        top: (dayStartTime.diffHours(startTime) - dayStart) * hourBlockHeight,
        height: startTime.diffHours(endTime) * hourBlockHeight,
        width,
        left
    };
}
function hasCollision(a, b) {
    return a.end > b.start && a.start < b.end;
}
function calcColumnSpan(event, columnIndex, columns) {
    let colSpan = 1;
    for (let i = columnIndex + 1; i < columns.length; i++) {
        const column = columns[i];
        const foundCollision = column.find(ev => hasCollision(event, ev));
        if (foundCollision) {
            return colSpan;
        }
        colSpan++;
    }
    return colSpan;
}
function packOverlappingEventGroup(columns, calculatedEvents, populateOptions) {
    const { screenWidth = constants_1.default.screenWidth, rightEdgeSpacing = RIGHT_EDGE_SPACING, overlapEventsSpacing = OVERLAP_EVENTS_SPACINGS } = populateOptions;
    columns.forEach((column, columnIndex) => {
        column.forEach(event => {
            const totalWidth = screenWidth - rightEdgeSpacing;
            const columnSpan = calcColumnSpan(event, columnIndex, columns);
            const eventLeft = (columnIndex / columns.length) * totalWidth;
            let eventWidth = totalWidth * (columnSpan / columns.length);
            if (columnIndex + columnSpan <= columns.length - 1) {
                eventWidth -= overlapEventsSpacing;
            }
            calculatedEvents.push(buildEvent(event, eventLeft, eventWidth, populateOptions));
        });
    });
}
function populateEvents(_events, populateOptions) {
    let lastEnd = null;
    let columns = [];
    const calculatedEvents = [];
    const events = _events
        .map((ev, index) => ({ ...ev, index: index }))
        .sort(function (a, b) {
        if (a.start < b.start)
            return -1;
        if (a.start > b.start)
            return 1;
        if (a.end < b.end)
            return -1;
        if (a.end > b.end)
            return 1;
        return 0;
    });
    events.forEach(function (ev) {
        // Reset recent overlapping event group and start a new one
        if (lastEnd !== null && ev.start >= lastEnd) {
            packOverlappingEventGroup(columns, calculatedEvents, populateOptions);
            columns = [];
            lastEnd = null;
        }
        // Place current event in the right column where it doesn't overlap
        let placed = false;
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            if (!hasCollision(col[col.length - 1], ev)) {
                col.push(ev);
                placed = true;
                break;
            }
        }
        // If curr event wasn't placed in any of the columns, create a new column for it
        if (!placed) {
            columns.push([ev]);
        }
        if (lastEnd === null || ev.end > lastEnd) {
            lastEnd = ev.end;
        }
    });
    if (columns.length > 0) {
        packOverlappingEventGroup(columns, calculatedEvents, populateOptions);
    }
    return calculatedEvents;
}
exports.populateEvents = populateEvents;
function buildUnavailableHoursBlocks(unavailableHours = [], options) {
    const { hourBlockHeight = exports.HOUR_BLOCK_HEIGHT, dayStart = 0, dayEnd = 24 } = options || {};
    const totalDayHours = dayEnd - dayStart;
    const totalDayHeight = (dayEnd - dayStart) * hourBlockHeight;
    return (unavailableHours
        .map(hours => {
        if (!(0, inRange_1.default)(hours.start, 0, 25) || !(0, inRange_1.default)(hours.end, 0, 25)) {
            console.error('Calendar Timeline unavailableHours is invalid. Hours should be between 0 and 24');
            return undefined;
        }
        if (hours.start >= hours.end) {
            console.error('Calendar Timeline availableHours is invalid. start hour should be earlier than end hour');
            return undefined;
        }
        const startFixed = Math.max(hours.start, dayStart);
        const endFixed = Math.min(hours.end, dayEnd);
        return {
            top: ((startFixed - dayStart) / totalDayHours) * totalDayHeight,
            height: (endFixed - startFixed) * hourBlockHeight
        };
    })
        // Note: this filter falsy values (undefined blocks)
        .filter(Boolean));
}
exports.buildUnavailableHoursBlocks = buildUnavailableHoursBlocks;
