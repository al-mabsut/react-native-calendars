"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekCalendarDriver = void 0;
const react_native_1 = require("@testing-library/react-native");
class WeekCalendarDriver {
    testID;
    element;
    renderTree;
    constructor(testID, element) {
        this.testID = testID;
        this.element = element;
        this.renderTree = this.render(element);
    }
    render(element = this.element) {
        if (!element)
            throw 'Element is missing';
        this.renderTree = (0, react_native_1.render)(element);
        return this.renderTree;
    }
    getWeekCalendar() {
        return this.renderTree.getByTestId(`${this.testID}.weekCalendar.list`);
    }
    /** List */
    getListProps() {
        const props = react_native_1.screen.getByTestId(`${this.testID}.list`).props;
        return props;
    }
    getItemTestID(date) {
        return `${this.testID}.week_${date}`;
    }
    getListItem(date) {
        return react_native_1.screen.getByTestId(this.getItemTestID(date));
    }
    /** Day */
    getDayTestID(date) {
        return `${this.testID}.day_${date}`;
    }
    getDay(date) {
        return this.renderTree?.getByTestId(this.getDayTestID(date));
    }
    selectDay(date) {
        (0, react_native_1.fireEvent)(this.getDay(date), 'onPress');
    }
}
exports.WeekCalendarDriver = WeekCalendarDriver;
