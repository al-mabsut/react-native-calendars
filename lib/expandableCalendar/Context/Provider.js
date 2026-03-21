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
const lodash_1 = require("lodash");
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const dateutils_1 = require("../../dateutils");
const interface_1 = require("../../interface");
const hooks_1 = require("../../hooks");
const commons_1 = require("../commons");
const style_1 = __importDefault(require("../style"));
const index_1 = __importDefault(require("./index"));
const todayButton_1 = __importDefault(require("./todayButton"));
/**
 * @description: Calendar context provider component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const CalendarProvider = (props) => {
    const { theme, date, onDateChanged, onMonthChange, disableAutoDaySelection, showTodayButton = false, disabledOpacity, todayBottomMargin, todayButtonStyle, style: propsStyle, numberOfDays, timelineLeftInset = 72, children } = props;
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const todayButton = (0, react_1.useRef)();
    const prevDate = (0, react_1.useRef)(date);
    const currDate = (0, react_1.useRef)(date); // for setDate only to keep prevDate up to date
    const [currentDate, setCurrentDate] = (0, react_1.useState)(date);
    const [selectedDate, setSelectedDate] = (0, react_1.useState)(date);
    const [updateSource, setUpdateSource] = (0, react_1.useState)(commons_1.UpdateSources.CALENDAR_INIT);
    const wrapperStyle = (0, react_1.useMemo)(() => {
        return [style.current.contextWrapper, propsStyle];
    }, [style, propsStyle]);
    (0, hooks_1.useDidUpdate)(() => {
        if (date && date !== currentDate) {
            _setDate(date, commons_1.UpdateSources.PROP_UPDATE);
        }
    }, [date]);
    const getUpdateSource = (0, react_1.useCallback)((updateSource) => {
        // NOTE: this comes to avoid breaking those how listen to the update source in onDateChanged and onMonthChange - remove on V2
        if (updateSource === commons_1.UpdateSources.ARROW_PRESS || updateSource === commons_1.UpdateSources.WEEK_ARROW_PRESS) {
            return commons_1.UpdateSources.PAGE_SCROLL;
        }
        return updateSource;
    }, []);
    const _setDate = (0, react_1.useCallback)((date, updateSource) => {
        prevDate.current = currDate.current;
        currDate.current = date;
        setCurrentDate(date);
        if (!(0, lodash_1.includes)(disableAutoDaySelection, updateSource)) {
            setSelectedDate(date);
        }
        setUpdateSource(updateSource);
        const _updateSource = getUpdateSource(updateSource);
        onDateChanged?.(date, _updateSource);
        if (!(0, dateutils_1.sameMonth)(new xdate_1.default(date), new xdate_1.default(prevDate.current))) {
            onMonthChange?.((0, interface_1.xdateToData)(new xdate_1.default(date)), _updateSource);
        }
    }, [onDateChanged, onMonthChange, getUpdateSource]);
    const _setDisabled = (0, react_1.useCallback)((disabled) => {
        if (showTodayButton) {
            todayButton.current?.disable(disabled);
        }
    }, [showTodayButton]);
    const contextValue = (0, react_1.useMemo)(() => {
        return {
            date: currentDate,
            prevDate: prevDate.current,
            selectedDate,
            updateSource: updateSource,
            setDate: _setDate,
            setDisabled: _setDisabled,
            numberOfDays,
            timelineLeftInset
        };
    }, [currentDate, updateSource, numberOfDays, _setDisabled]);
    const renderTodayButton = () => {
        return (<todayButton_1.default ref={todayButton} disabledOpacity={disabledOpacity} margin={todayBottomMargin} style={todayButtonStyle} theme={theme}/>);
    };
    return (<index_1.default.Provider value={contextValue}>
      <react_native_1.View style={wrapperStyle} key={numberOfDays}>{children}</react_native_1.View>
      {showTodayButton && renderTodayButton()}
    </index_1.default.Provider>);
};
exports.default = CalendarProvider;
CalendarProvider.displayName = 'CalendarProvider';
