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
const defaultStyle = __importStar(require("../../style"));
const constants_1 = __importDefault(require("../../commons/constants"));
function default_1(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    const rtlStyle = constants_1.default.isRTL ? { transform: [{ scaleX: -1 }] } : undefined;
    return react_native_1.StyleSheet.create({
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 6,
            alignItems: 'center'
        },
        partialHeader: {
            paddingHorizontal: 15
        },
        headerContainer: {
            flexDirection: 'row'
        },
        monthText: {
            fontSize: appStyle.textMonthFontSize,
            fontFamily: appStyle.textMonthFontFamily,
            fontWeight: appStyle.textMonthFontWeight,
            color: appStyle.monthTextColor,
            margin: 10
        },
        arrow: {
            padding: 10,
            ...appStyle.arrowStyle
        },
        arrowImage: {
            ...rtlStyle,
            tintColor: appStyle.arrowColor,
            ...react_native_1.Platform.select({
                web: {
                    width: appStyle.arrowWidth,
                    height: appStyle.arrowHeight
                }
            })
        },
        disabledArrowImage: {
            ...rtlStyle,
            tintColor: appStyle.disabledArrowColor
        },
        week: {
            marginTop: 7,
            flexDirection: 'row',
            justifyContent: 'space-around'
        },
        partialWeek: {
            paddingRight: 0
        },
        dayHeader: {
            marginTop: 2,
            marginBottom: 7,
            width: 32,
            textAlign: 'center',
            fontSize: appStyle.textDayHeaderFontSize,
            fontFamily: appStyle.textDayHeaderFontFamily,
            fontWeight: appStyle.textDayHeaderFontWeight,
            color: appStyle.textSectionTitleColor
        },
        disabledDayHeader: {
            color: appStyle.textSectionTitleDisabledColor
        },
        ...(theme['stylesheet.calendar.header'] || {})
    });
}
exports.default = default_1;
