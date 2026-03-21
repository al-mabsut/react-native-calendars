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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const interface_1 = require("../interface");
const componentUpdater_1 = require("../componentUpdater");
const style_1 = __importDefault(require("./style"));
const calendar_1 = __importDefault(require("../calendar"));
const CalendarListItem = react_1.default.memo((props) => {
    const { item, theme, scrollToMonth, horizontal, calendarHeight, calendarWidth, style: propsStyle, headerStyle, onPressArrowLeft, onPressArrowRight, visible } = props;
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const calendarProps = (0, componentUpdater_1.extractCalendarProps)(props);
    const dateString = (0, interface_1.toMarkingFormat)(item);
    const calendarStyle = (0, react_1.useMemo)(() => {
        return [
            {
                width: calendarWidth,
                minHeight: calendarHeight
            },
            style.current.calendar,
            propsStyle
        ];
    }, [calendarWidth, calendarHeight, propsStyle]);
    const textStyle = (0, react_1.useMemo)(() => {
        return [calendarStyle, style.current.placeholderText];
    }, [calendarStyle]);
    const _onPressArrowLeft = (0, react_1.useCallback)((method, month) => {
        const monthClone = month?.clone();
        if (monthClone) {
            if (onPressArrowLeft) {
                onPressArrowLeft(method, monthClone);
            }
            else if (scrollToMonth) {
                const currentMonth = monthClone.getMonth();
                monthClone.addMonths(-1);
                // Make sure we actually get the previous month, not just 30 days before currentMonth.
                while (monthClone.getMonth() === currentMonth) {
                    monthClone.setDate(monthClone.getDate() - 1);
                }
                scrollToMonth(monthClone);
            }
        }
    }, [onPressArrowLeft, scrollToMonth]);
    const _onPressArrowRight = (0, react_1.useCallback)((method, month) => {
        const monthClone = month?.clone();
        if (monthClone) {
            if (onPressArrowRight) {
                onPressArrowRight(method, monthClone);
            }
            else if (scrollToMonth) {
                monthClone.addMonths(1);
                scrollToMonth(monthClone);
            }
        }
    }, [onPressArrowRight, scrollToMonth]);
    const formattedDate = (0, react_1.useMemo)(() => {
        const date = new Date(dateString);
        return date.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });
    }, [dateString]);
    if (!visible) {
        return <react_native_1.Text style={textStyle}>{formattedDate}</react_native_1.Text>;
    }
    return (<calendar_1.default hideArrows={true} hideExtraDays={true} {...calendarProps} current={dateString} style={calendarStyle} headerStyle={horizontal ? headerStyle : undefined} disableMonthChange onPressArrowLeft={horizontal ? _onPressArrowLeft : onPressArrowLeft} onPressArrowRight={horizontal ? _onPressArrowRight : onPressArrowRight}/>);
});
exports.default = CalendarListItem;
CalendarListItem.displayName = 'CalendarListItem';
