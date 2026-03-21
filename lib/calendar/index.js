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
const prop_types_1 = __importDefault(require("prop-types"));
const xdate_1 = __importDefault(require("xdate"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
// @ts-expect-error
const react_native_swipe_gestures_1 = __importStar(require("react-native-swipe-gestures"));
const constants_1 = __importDefault(require("../commons/constants"));
const dateutils_1 = require("../dateutils");
const interface_1 = require("../interface");
const day_state_manager_1 = require("../day-state-manager");
const componentUpdater_1 = require("../componentUpdater");
const hooks_1 = require("../hooks");
const style_1 = __importDefault(require("./style"));
const header_1 = __importDefault(require("./header"));
const index_1 = __importDefault(require("./day/index"));
const basic_1 = __importDefault(require("./day/basic"));
/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif
 */
const Calendar = (props) => {
    const { initialDate, current, theme, markedDates, minDate, maxDate, allowSelectionOutOfRange, onDayPress, onDayLongPress, onMonthChange, onVisibleMonthsChange, disableMonthChange, enableSwipeMonths, hideExtraDays, firstDay, showSixWeeks, displayLoadingIndicator, customHeader, headerStyle, accessibilityElementsHidden, importantForAccessibility, testID, style: propsStyle } = props;
    const [currentMonth, setCurrentMonth] = (0, react_1.useState)(current || initialDate ? (0, interface_1.parseDate)(current || initialDate) : new xdate_1.default());
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const header = (0, react_1.useRef)();
    const weekNumberMarking = (0, react_1.useRef)({ disabled: true, disableTouchEvent: true });
    (0, react_1.useEffect)(() => {
        if (initialDate) {
            setCurrentMonth((0, interface_1.parseDate)(initialDate));
        }
    }, [initialDate]);
    (0, hooks_1.useDidUpdate)(() => {
        const _currentMonth = currentMonth.clone();
        onMonthChange?.((0, interface_1.xdateToData)(_currentMonth));
        onVisibleMonthsChange?.([(0, interface_1.xdateToData)(_currentMonth)]);
        react_native_1.AccessibilityInfo.announceForAccessibility(_currentMonth.toString('MMMM yyyy'));
    }, [currentMonth]);
    const updateMonth = (0, react_1.useCallback)((newMonth) => {
        if ((0, dateutils_1.sameMonth)(newMonth, currentMonth)) {
            return;
        }
        setCurrentMonth(newMonth);
    }, [currentMonth]);
    const addMonth = (0, react_1.useCallback)((count) => {
        const newMonth = currentMonth.clone().addMonths(count, true);
        updateMonth(newMonth);
    }, [currentMonth, updateMonth]);
    const handleDayInteraction = (0, react_1.useCallback)((date, interaction) => {
        const day = new xdate_1.default(date.dateString);
        if (allowSelectionOutOfRange || !(minDate && !(0, dateutils_1.isGTE)(day, new xdate_1.default(minDate))) && !(maxDate && !(0, dateutils_1.isLTE)(day, new xdate_1.default(maxDate)))) {
            if (!disableMonthChange) {
                updateMonth(day);
            }
            if (interaction) {
                interaction(date);
            }
        }
    }, [minDate, maxDate, allowSelectionOutOfRange, disableMonthChange, updateMonth]);
    const _onDayPress = (0, react_1.useCallback)((date) => {
        if (date)
            handleDayInteraction(date, onDayPress);
    }, [handleDayInteraction, onDayPress]);
    const onLongPressDay = (0, react_1.useCallback)((date) => {
        if (date)
            handleDayInteraction(date, onDayLongPress);
    }, [handleDayInteraction, onDayLongPress]);
    const onSwipeLeft = (0, react_1.useCallback)(() => {
        // @ts-expect-error
        header.current?.onPressRight();
    }, [header]);
    const onSwipeRight = (0, react_1.useCallback)(() => {
        // @ts-expect-error
        header.current?.onPressLeft();
    }, [header]);
    const onSwipe = (0, react_1.useCallback)((gestureName) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = react_native_swipe_gestures_1.swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
            case SWIPE_DOWN:
                break;
            case SWIPE_LEFT:
                constants_1.default.isRTL ? onSwipeRight() : onSwipeLeft();
                break;
            case SWIPE_RIGHT:
                constants_1.default.isRTL ? onSwipeLeft() : onSwipeRight();
                break;
        }
    }, [onSwipeLeft, onSwipeRight]);
    const renderWeekNumber = (weekNumber) => {
        return (<react_native_1.View style={style.current.dayContainer} key={`week-container-${weekNumber}`}>
        <basic_1.default key={`week-${weekNumber}`} marking={weekNumberMarking.current} 
        // state='disabled'
        theme={theme} testID={`${testID}.weekNumber_${weekNumber}`}>
          {weekNumber}
        </basic_1.default>
      </react_native_1.View>);
    };
    const renderDay = (day, id) => {
        if (!(0, dateutils_1.sameMonth)(day, currentMonth) && hideExtraDays) {
            return <react_native_1.View key={id} style={style.current.emptyDayContainer}/>;
        }
        const dayProps = (0, componentUpdater_1.extractDayProps)(props);
        const dateString = (0, interface_1.toMarkingFormat)(day);
        const disableDaySelection = (0, isEmpty_1.default)(props.context);
        return (<react_native_1.View style={style.current.dayContainer} key={id}>
        <index_1.default {...dayProps} testID={`${testID}.day_${dateString}`} date={dateString} state={(0, day_state_manager_1.getState)(day, currentMonth, props, disableDaySelection)} marking={markedDates?.[dateString]} onPress={_onDayPress} onLongPress={onLongPressDay}/>
      </react_native_1.View>);
    };
    const renderWeek = (days, id) => {
        const week = [];
        days.forEach((day, id2) => {
            week.push(renderDay(day, id2));
        }, this);
        if (props.showWeekNumbers) {
            week.unshift(renderWeekNumber(days[days.length - 1].getWeek()));
        }
        return (<react_native_1.View style={style.current.week} key={id}>
        {week}
      </react_native_1.View>);
    };
    const renderMonth = () => {
        const shouldShowSixWeeks = showSixWeeks && !hideExtraDays;
        const days = (0, dateutils_1.page)(currentMonth, firstDay, shouldShowSixWeeks);
        const weeks = [];
        while (days.length) {
            weeks.push(renderWeek(days.splice(0, 7), weeks.length));
        }
        return <react_native_1.View style={style.current.monthView}>{weeks}</react_native_1.View>;
    };
    const shouldDisplayIndicator = (0, react_1.useMemo)(() => {
        if (currentMonth) {
            const lastMonthOfDay = (0, interface_1.toMarkingFormat)(currentMonth.clone().addMonths(1, true).setDate(1).addDays(-1));
            if (displayLoadingIndicator && !markedDates?.[lastMonthOfDay]) {
                return true;
            }
        }
        return false;
    }, [currentMonth, displayLoadingIndicator, markedDates]);
    const renderHeader = () => {
        const headerProps = (0, componentUpdater_1.extractHeaderProps)(props);
        const ref = customHeader ? undefined : header;
        const CustomHeader = customHeader;
        const HeaderComponent = customHeader ? CustomHeader : header_1.default;
        return (<HeaderComponent {...headerProps} testID={`${testID}.header`} style={headerStyle} ref={ref} month={currentMonth} addMonth={addMonth} displayLoadingIndicator={shouldDisplayIndicator}/>);
    };
    const GestureComponent = enableSwipeMonths ? react_native_swipe_gestures_1.default : react_native_1.View;
    const swipeProps = {
        onSwipe: (direction) => onSwipe(direction)
    };
    const gestureProps = enableSwipeMonths ? swipeProps : undefined;
    return (<GestureComponent {...gestureProps} testID={`${testID}.container`}>
      <react_native_1.View style={[style.current.container, propsStyle]} testID={testID} accessibilityElementsHidden={accessibilityElementsHidden} // iOS
     importantForAccessibility={importantForAccessibility} // Android
    >
        {renderHeader()}
        {renderMonth()}
      </react_native_1.View>
    </GestureComponent>);
};
exports.default = Calendar;
Calendar.displayName = 'Calendar';
Calendar.propTypes = {
    ...header_1.default.propTypes,
    ...index_1.default.propTypes,
    theme: prop_types_1.default.object,
    style: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.array, prop_types_1.default.number]),
    current: prop_types_1.default.string,
    initialDate: prop_types_1.default.string,
    minDate: prop_types_1.default.string,
    maxDate: prop_types_1.default.string,
    markedDates: prop_types_1.default.object,
    hideExtraDays: prop_types_1.default.bool,
    showSixWeeks: prop_types_1.default.bool,
    onDayPress: prop_types_1.default.func,
    onDayLongPress: prop_types_1.default.func,
    onMonthChange: prop_types_1.default.func,
    onVisibleMonthsChange: prop_types_1.default.func,
    disableMonthChange: prop_types_1.default.bool,
    enableSwipeMonths: prop_types_1.default.bool,
    disabledByDefault: prop_types_1.default.bool,
    headerStyle: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.number, prop_types_1.default.array]),
    customHeader: prop_types_1.default.any,
    allowSelectionOutOfRange: prop_types_1.default.bool
};
