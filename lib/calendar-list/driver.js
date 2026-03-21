"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarListDriver = void 0;
const react_native_1 = require("@testing-library/react-native");
const testUtils_1 = require("../testUtils");
class CalendarListDriver {
    testID;
    element;
    constructor(testID, element) {
        this.testID = testID;
        this.element = element;
        this.render(element);
    }
    render(element = this.element) {
        if (!element)
            throw 'Element is missing';
        return (0, react_native_1.render)(element);
    }
    /** List */
    // fireOnViewableItemsChanged(changed: any[], visibleItems: any[]) {
    //   fireEvent(screen.getByTestId(this.testID), 'viewabilityConfigCallbackPairs.onViewableItemsChanged', {info: {changed: changed, viewableItems: visibleItems}});
    // }
    getListProps() {
        const props = react_native_1.screen.getByTestId(`${this.testID}.list`).props;
        return props;
    }
    getItemTestID(date) {
        const [year, month] = date.split('-');
        return `${this.testID}.item_${year}-${month}`;
    }
    getListItem(date) {
        return react_native_1.screen.getByTestId(this.getItemTestID(date));
    }
    getListItemTitle(date) {
        return (0, react_native_1.within)(this.getListItem(date)).getByText((0, testUtils_1.getMonthTitle)(date));
    }
    /** Static header */
    get staticHeaderTestID() {
        return `${this.testID}.staticHeader`;
    }
    getStaticHeader() {
        return react_native_1.screen.getByTestId(this.staticHeaderTestID);
    }
    getStaticHeaderTitle() {
        return react_native_1.screen.getByTestId(`${this.staticHeaderTestID}.title`).children[0];
    }
    getStaticHeaderLeftArrow() {
        return react_native_1.screen.getByTestId(`${this.staticHeaderTestID}.leftArrow`);
    }
    getStaticHeaderRightArrow() {
        return react_native_1.screen.getByTestId(`${this.staticHeaderTestID}.rightArrow`);
    }
    pressLeftArrow() {
        (0, react_native_1.fireEvent)(this.getStaticHeaderLeftArrow(), 'onPress');
    }
    pressRightArrow() {
        (0, react_native_1.fireEvent)(this.getStaticHeaderRightArrow(), 'onPress');
    }
    /** Day press */
    getDayTestID(date) {
        const [year, month] = date.split('-');
        return `${this.testID}.item_${year}-${month}.day_${date}`;
    }
    getDay(date) {
        return react_native_1.screen.getByTestId(this.getDayTestID(date));
    }
    selectDay(date) {
        (0, react_native_1.fireEvent)(this.getDay(date), 'onPress');
    }
}
exports.CalendarListDriver = CalendarListDriver;
