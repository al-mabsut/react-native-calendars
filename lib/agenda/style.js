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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const defaultStyle = __importStar(require("../style"));
const platform_style_1 = __importDefault(require("./platform-style"));
function styleConstructor(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    const { knob, weekdays } = (0, platform_style_1.default)(appStyle);
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            overflow: 'hidden'
        },
        animatedContainer: {
            flex: 1
        },
        knob,
        weekdays,
        header: {
            overflow: 'hidden',
            justifyContent: 'flex-end',
            position: 'absolute',
            height: '100%',
            width: '100%'
        },
        knobContainer: {
            flex: 1,
            position: 'absolute',
            left: 0,
            right: 0,
            height: 24,
            bottom: 0,
            alignItems: 'center',
            backgroundColor: appStyle.calendarBackground
        },
        dayHeader: {
            width: 32,
            textAlign: 'center',
            fontSize: appStyle.textDayHeaderFontSize,
            fontFamily: appStyle.textDayHeaderFontFamily,
            fontWeight: appStyle.textDayHeaderFontWeight,
            color: appStyle.textSectionTitleColor
        },
        reservations: {
            flex: 1,
            marginTop: 104,
            backgroundColor: appStyle.reservationsBackgroundColor || appStyle.backgroundColor //TODO: remove 2nd in V2
        },
        scrollPadStyle: {
            position: 'absolute',
            width: '100%',
            alignSelf: 'center'
        },
        ...(theme['stylesheet.agenda.main'] || {})
    });
}
exports.default = styleConstructor;
