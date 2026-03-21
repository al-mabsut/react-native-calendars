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
const defaultStyle = __importStar(require("../../style"));
function styleConstructor(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    return react_native_1.StyleSheet.create({
        container: {
            flexDirection: 'row'
        },
        innerContainer: {
            flex: 1
        },
        dayNum: {
            fontSize: 28,
            fontWeight: '200',
            fontFamily: appStyle.textDayFontFamily,
            color: appStyle.agendaDayNumColor
        },
        dayText: {
            fontSize: 14,
            fontWeight: appStyle.textDayFontWeight,
            fontFamily: appStyle.textDayFontFamily,
            color: appStyle.agendaDayTextColor,
            backgroundColor: 'rgba(0,0,0,0)',
            marginTop: -5
        },
        day: {
            width: 63,
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 32
        },
        today: {
            color: appStyle.agendaTodayColor
        },
        indicator: {
            marginTop: 80
        },
        ...(theme['stylesheet.agenda.list'] || {})
    });
}
exports.default = styleConstructor;
