"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const defaultStyle = __importStar(require("../../../style"));
const FILLER_HEIGHT = 34;
function styleConstructor(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    return react_native_1.StyleSheet.create({
        container: {
            alignSelf: 'stretch',
            alignItems: 'center'
        },
        base: {
            width: 38,
            height: FILLER_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center'
        },
        today: {
            backgroundColor: appStyle.todayBackgroundColor,
            borderRadius: 17
        },
        fillers: {
            position: 'absolute',
            height: FILLER_HEIGHT,
            flexDirection: 'row',
            left: 0,
            right: 0
        },
        leftFiller: {
            backgroundColor: appStyle.calendarBackground,
            height: FILLER_HEIGHT,
            flex: 1
        },
        rightFiller: {
            backgroundColor: appStyle.calendarBackground,
            height: FILLER_HEIGHT,
            flex: 1
        },
        text: {
            fontSize: appStyle.textDayFontSize,
            fontFamily: appStyle.textDayFontFamily,
            fontWeight: appStyle.textDayFontWeight,
            color: appStyle.dayTextColor,
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        todayText: {
            fontWeight: '500',
            color: theme.todayTextColor
        },
        selectedText: {
            color: appStyle.selectedDayTextColor
        },
        disabledText: {
            color: appStyle.textDisabledColor
        },
        inactiveText: {
            color: appStyle.textInactiveColor
        },
        ...(theme['stylesheet.day.period'] || {})
    });
}
exports.default = styleConstructor;
