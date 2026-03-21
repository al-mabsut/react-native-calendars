"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpandableCalendarWithContext = exports.expandableCalendarTestIDs = exports.testIdExpandableCalendar = void 0;
const react_1 = __importDefault(require("react"));
const react_native_calendars_1 = require("react-native-calendars");
const interface_1 = require("../../interface");
const XDate = require('xdate');
const today = new XDate();
exports.testIdExpandableCalendar = 'myExpandableCalendar';
const expandableCalendarTestIDs = (testId) => {
    return {
        leftArrow: `${testId}.leftArrow`,
        rightArrow: `${testId}.rightArrow`
    };
};
exports.expandableCalendarTestIDs = expandableCalendarTestIDs;
const generateExpandableCalendarWithContext = ({ expandableCalendarProps, calendarContextProps } = {}) => {
    const defaultContextProps = {
        date: (0, interface_1.toMarkingFormat)(today),
        showTodayButton: true
    };
    const defaultExpandableCalendarProps = {
        testID: exports.testIdExpandableCalendar
    };
    return (<react_native_calendars_1.CalendarProvider {...defaultContextProps} {...calendarContextProps}>
      <react_native_calendars_1.ExpandableCalendar {...defaultExpandableCalendarProps} {...expandableCalendarProps}/>
    </react_native_calendars_1.CalendarProvider>);
};
exports.generateExpandableCalendarWithContext = generateExpandableCalendarWithContext;
