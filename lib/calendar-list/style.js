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
const defaultStyle = __importStar(require("../style"));
function getStyle(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    return react_native_1.StyleSheet.create({
        flatListContainer: {
            flex: react_native_1.Platform.OS === 'web' ? 1 : undefined
        },
        container: {
            backgroundColor: appStyle.calendarBackground
        },
        placeholder: {
            backgroundColor: appStyle.calendarBackground,
            alignItems: 'center',
            justifyContent: 'center'
        },
        placeholderText: {
            fontSize: 20,
            fontWeight: '200',
            color: appStyle.dayTextColor
        },
        calendar: {
            paddingLeft: 15,
            paddingRight: 15
        },
        staticHeader: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: appStyle.calendarBackground,
            paddingHorizontal: 15
        },
        ...(theme['stylesheet.calendar-list.main'] || {})
    });
}
exports.default = getStyle;
