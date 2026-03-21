"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarDriver = void 0;
const react_native_1 = require("@testing-library/react-native");
//@ts-ignore
const react_native_swipe_gestures_1 = require("react-native-swipe-gestures");
const driver_1 = require("./day/driver");
const driver_2 = require("./header/driver");
class CalendarDriver {
    testID;
    element;
    renderTree;
    constructor(element) {
        this.element = element;
        this.renderTree = (0, react_native_1.render)(element);
        this.testID = element.props.testID;
    }
    /** Days */
    getDay(date) {
        return new driver_1.DayDriver(this.element, `${this.testID}.day_${date}`);
    }
    getTextValues(elements) {
        const values = elements.map(element => {
            const testID = element.props.testID;
            if (testID?.endsWith('.text')) {
                return this.renderTree.getByTestId(testID).children[0];
            }
        });
        return values.filter(value => !!value);
    }
    getDays() {
        return this.getTextValues(this.renderTree.queryAllByTestId(/day_/));
    }
    getWeekNumbers() {
        return this.getTextValues(this.renderTree.queryAllByTestId(/weekNumber_/));
    }
    /** Header */
    getHeader() {
        return new driver_2.CalendarHeaderDriver(this.element, `${this.testID}.header`);
    }
    /** GestureRecognizer */
    queryElement(testID) {
        const elements = this.renderTree.queryAllByTestId(testID);
        if (elements.length > 1) {
            console.warn(`Found more than one element with testID: ${testID}`);
        }
        return elements?.[0];
    }
    isRootGestureRecognizer() {
        const node = this.queryElement(`${this.testID}.container`);
        return !!node?.props?.onSwipe;
    }
    swipe(direction) {
        // direction === 'left' ? this.getHeader().tapLeftArrow() : this.getHeader().tapRightArrow();
        const node = this.queryElement(`${this.testID}.container`);
        // console.log(this.element.props, tree?.props?.onSwipe);
        // tree?.props?.onSwipe?.(direction);
        // act(() => fireEvent(tree, 'onSwipe', direction));
        (0, react_native_1.act)(() => node?.props?.onSwipe?.(direction));
        // fireEvent(tree, 'onSwipe', direction);
    }
    swipeLeft() {
        this.swipe(react_native_swipe_gestures_1.swipeDirections.SWIPE_LEFT);
    }
    swipeRight() {
        this.swipe(react_native_swipe_gestures_1.swipeDirections.SWIPE_RIGHT);
    }
}
exports.CalendarDriver = CalendarDriver;
