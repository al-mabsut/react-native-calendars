"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const dateutils_1 = require("../dateutils");
const WeekDaysNames = react_1.default.memo(({ firstDay, style }) => {
    const dayNames = (0, dateutils_1.weekDayNames)(firstDay);
    return dayNames.map((day, index) => (<react_native_1.Text allowFontScaling={false} key={index} style={style} numberOfLines={1} accessibilityLabel={''}>
      {day}
    </react_native_1.Text>));
});
exports.default = WeekDaysNames;
