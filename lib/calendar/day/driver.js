"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayDriver = void 0;
const react_native_1 = require("@testing-library/react-native");
const testUtils_1 = require("../../testUtils");
class DayDriver {
    testID;
    element;
    renderTree;
    constructor(element, testID) {
        this.element = element;
        this.renderTree = (0, react_native_1.render)(element);
        this.testID = testID || element.props.testID;
    }
    getStyle() {
        return (0, testUtils_1.extractStyles)(this.renderTree.getByTestId(this.testID));
    }
    getDayText() {
        return this.renderTree.getByTestId(`${this.testID}.text`).children.join('');
    }
    getTextStyle() {
        return (0, testUtils_1.extractStyles)(this.renderTree.getByTestId(`${this.testID}.text`));
    }
    getAccessibilityLabel() {
        const node = this.renderTree.getByTestId(this.testID);
        return node?.props?.accessibilityLabel.trim();
    }
    tap() {
        const node = this.renderTree.getByTestId(this.testID);
        if (!node) {
            throw new Error('Day not found.');
        }
        react_native_1.fireEvent.press(node);
    }
}
exports.DayDriver = DayDriver;
