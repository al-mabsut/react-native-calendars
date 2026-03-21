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
exports.Positions = void 0;
const first_1 = __importDefault(require("lodash/first"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const isNumber_1 = __importDefault(require("lodash/isNumber"));
const throttle_1 = __importDefault(require("lodash/throttle"));
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const dateutils_1 = require("../dateutils");
const interface_1 = require("../interface");
const style_1 = __importStar(require("./style"));
const WeekDaysNames_1 = __importDefault(require("../commons/WeekDaysNames"));
const calendar_1 = __importDefault(require("../calendar"));
const calendar_list_1 = __importDefault(require("../calendar-list"));
const week_1 = __importDefault(require("./week"));
const WeekCalendar_1 = __importDefault(require("./WeekCalendar"));
const Context_1 = __importDefault(require("./Context"));
const constants_1 = __importDefault(require("../commons/constants"));
const commons_1 = require("./commons");
var Positions;
(function (Positions) {
    Positions["CLOSED"] = "closed";
    Positions["OPEN"] = "open";
})(Positions = exports.Positions || (exports.Positions = {}));
const SPEED = 20;
const BOUNCINESS = 6;
const WEEK_HEIGHT = 46;
const DAY_NAMES_PADDING = 24;
const PAN_GESTURE_THRESHOLD = 30;
const LEFT_ARROW = require('../calendar/img/previous.png');
const RIGHT_ARROW = require('../calendar/img/next.png');
const knobHitSlop = { left: 10, right: 10, top: 10, bottom: 10 };
const DEFAULT_HEADER_HEIGHT = 78;
const headerStyleOverride = {
    stylesheet: {
        calendar: {
            header: {
                week: {
                    marginTop: 7,
                    marginBottom: -4,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }
            }
        }
    }
};
/**
 * @description: Expandable calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const ExpandableCalendar = (0, react_1.forwardRef)((props, ref) => {
    const _context = (0, react_1.useContext)(Context_1.default);
    const { date, setDate, numberOfDays, timelineLeftInset } = _context;
    const { 
    /** ExpandableCalendar props */
    initialPosition = Positions.CLOSED, onCalendarToggled, disablePan, hideKnob = numberOfDays && numberOfDays > 1, leftArrowImageSource = LEFT_ARROW, rightArrowImageSource = RIGHT_ARROW, allowShadow = true, disableWeekScroll, openThreshold = PAN_GESTURE_THRESHOLD, closeThreshold = PAN_GESTURE_THRESHOLD, closeOnDayPress = true, 
    /** CalendarList props */
    horizontal = true, calendarStyle, theme, style: propsStyle, firstDay = 0, onDayPress, hideArrows, onPressArrowLeft, onPressArrowRight, renderArrow, testID, ...others } = props;
    const [screenReaderEnabled, setScreenReaderEnabled] = (0, react_1.useState)(false);
    const [headerHeight, setHeaderHeight] = (0, react_1.useState)(0);
    const onHeaderLayout = (0, react_1.useCallback)(({ nativeEvent: { layout: { height } } }) => {
        setHeaderHeight(height || DEFAULT_HEADER_HEIGHT);
    }, []);
    /** Date */
    const getYear = (date) => {
        const d = new xdate_1.default(date);
        return d.getFullYear();
    };
    const getMonth = (date) => {
        const d = new xdate_1.default(date);
        return d.getMonth() + 1; // getMonth() returns month's index' (0-11)
    };
    const visibleMonth = (0, react_1.useRef)(getMonth(date));
    const visibleYear = (0, react_1.useRef)(getYear(date));
    const isLaterDate = (date1, date2) => {
        if (date1 && date2) {
            if (date1.year > getYear(date2)) {
                return true;
            }
            if (date1.year === getYear(date2)) {
                if (date1.month > getMonth(date2)) {
                    return true;
                }
            }
        }
        return false;
    };
    (0, react_1.useEffect)(() => {
        // date was changed from AgendaList, arrows or scroll
        scrollToDate(date);
    }, [date]);
    /** Number of weeks */
    const getNumberOfWeeksInMonth = (month) => {
        const days = (0, dateutils_1.page)(new xdate_1.default(month), firstDay);
        return days.length / 7;
    };
    const numberOfWeeks = (0, react_1.useRef)(getNumberOfWeeksInMonth(date));
    /** Position */
    const [position, setPosition] = (0, react_1.useState)(numberOfDays ? Positions.CLOSED : initialPosition);
    const isOpen = position === Positions.OPEN;
    const getOpenHeight = (0, react_1.useCallback)(() => {
        if (!horizontal) {
            return Math.max(constants_1.default.screenHeight, constants_1.default.screenWidth);
        }
        return headerHeight + (WEEK_HEIGHT * (numberOfWeeks.current)) + (hideKnob ? 0 : style_1.KNOB_CONTAINER_HEIGHT);
    }, [headerHeight, horizontal, hideKnob, numberOfWeeks]);
    const openHeight = (0, react_1.useRef)(getOpenHeight());
    const closedHeight = (0, react_1.useMemo)(() => headerHeight + WEEK_HEIGHT + (hideKnob || Number(numberOfDays) > 1 ? 0 : style_1.KNOB_CONTAINER_HEIGHT), [numberOfDays, hideKnob, headerHeight]);
    const startHeight = (0, react_1.useMemo)(() => isOpen ? getOpenHeight() : closedHeight, [closedHeight, isOpen, getOpenHeight]);
    const _height = (0, react_1.useRef)(startHeight);
    const deltaY = (0, react_1.useMemo)(() => new react_native_1.Animated.Value(startHeight), [startHeight]);
    const headerDeltaY = (0, react_1.useRef)(new react_native_1.Animated.Value(isOpen ? -headerHeight : 0));
    (0, react_1.useEffect)(() => {
        _height.current = startHeight;
        deltaY.setValue(startHeight);
        _wrapperStyles.current.style.height = startHeight;
    }, [startHeight]);
    (0, react_1.useEffect)(() => {
        openHeight.current = getOpenHeight();
    }, [headerHeight]);
    (0, react_1.useEffect)(() => {
        if (numberOfDays) {
            setPosition(Positions.CLOSED);
        }
    }, [numberOfDays]);
    /** Components' refs */
    const wrapper = (0, react_1.useRef)();
    const calendarList = (0, react_1.useRef)();
    const header = (0, react_1.useRef)();
    const weekCalendarWrapper = (0, react_1.useRef)();
    /** Styles */
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const themeObject = Object.assign(headerStyleOverride, theme);
    const _wrapperStyles = (0, react_1.useRef)({ style: { height: startHeight } });
    const _headerStyles = { style: { top: isOpen ? -headerHeight : 0 } };
    const _weekCalendarStyles = { style: { opacity: isOpen ? 0 : 1 } };
    const shouldHideArrows = !horizontal ? true : hideArrows || false;
    const updateNativeStyles = () => {
        wrapper?.current?.setNativeProps(_wrapperStyles.current);
        if (!horizontal) {
            header?.current?.setNativeProps(_headerStyles);
        }
        else {
            weekCalendarWrapper?.current?.setNativeProps(_weekCalendarStyles);
        }
    };
    const weekDaysStyle = (0, react_1.useMemo)(() => {
        const leftPaddings = calendarStyle?.paddingLeft;
        const rightPaddings = calendarStyle?.paddingRight;
        return [
            style.current.weekDayNames,
            {
                paddingLeft: (0, isNumber_1.default)(leftPaddings) ? leftPaddings + 6 : DAY_NAMES_PADDING,
                paddingRight: (0, isNumber_1.default)(rightPaddings) ? rightPaddings + 6 : DAY_NAMES_PADDING
            }
        ];
    }, [calendarStyle]);
    const animatedHeaderStyle = (0, react_1.useMemo)(() => {
        return [style.current.header, { height: headerHeight, top: headerDeltaY.current }];
    }, [headerDeltaY.current, headerHeight]);
    const weekCalendarStyle = (0, react_1.useMemo)(() => {
        return [style.current.weekContainer, isOpen ? style.current.hidden : style.current.visible, { top: headerHeight }];
    }, [isOpen, headerHeight]);
    const containerStyle = (0, react_1.useMemo)(() => {
        return [allowShadow && style.current.containerShadow, propsStyle, headerHeight === 0 && style.current.hidden, { overflow: 'hidden' }];
    }, [allowShadow, propsStyle, headerHeight]);
    const wrapperStyle = (0, react_1.useMemo)(() => {
        return { height: deltaY };
    }, [deltaY]);
    const numberOfDaysHeaderStyle = (0, react_1.useMemo)(() => {
        if (numberOfDays && numberOfDays > 1) {
            return { paddingHorizontal: 0 };
        }
    }, [numberOfDays]);
    const _headerStyle = (0, react_1.useMemo)(() => {
        return [numberOfDaysHeaderStyle, props.headerStyle];
    }, [props.headerStyle, numberOfDaysHeaderStyle]);
    /** AccessibilityInfo */
    (0, react_1.useEffect)(() => {
        if (react_native_1.AccessibilityInfo) {
            if (react_native_1.AccessibilityInfo.isScreenReaderEnabled) {
                react_native_1.AccessibilityInfo.isScreenReaderEnabled().then(handleScreenReaderStatus);
                //@ts-expect-error
            }
            else if (react_native_1.AccessibilityInfo.fetch) {
                // Support for older RN versions
                //@ts-expect-error
                react_native_1.AccessibilityInfo.fetch().then(handleScreenReaderStatus);
            }
        }
    }, []);
    const handleScreenReaderStatus = (screenReaderEnabled) => {
        setScreenReaderEnabled(screenReaderEnabled);
    };
    /** Scroll */
    const scrollToDate = (date) => {
        if (!horizontal) {
            calendarList?.current?.scrollToDay(date, 0, true);
        }
        else if (getYear(date) !== visibleYear.current || getMonth(date) !== visibleMonth.current) {
            // don't scroll if the month is already visible
            calendarList?.current?.scrollToMonth(date);
        }
    };
    const scrollPage = (0, react_1.useCallback)((next, updateSource = commons_1.UpdateSources.PAGE_SCROLL) => {
        if (horizontal) {
            const d = (0, interface_1.parseDate)(date);
            if (isOpen) {
                d.setDate(1);
                d.addMonths(next ? 1 : -1);
            }
            else {
                let dayOfTheWeek = d.getDay();
                if (dayOfTheWeek < firstDay && firstDay > 0) {
                    dayOfTheWeek = 7 + dayOfTheWeek;
                }
                if (numberOfDays) {
                    const daysToAdd = numberOfDays <= 1 ? 7 : numberOfDays;
                    d.addDays(next ? daysToAdd : -daysToAdd);
                }
                else {
                    const firstDayOfWeek = (next ? 7 : -7) - dayOfTheWeek + firstDay;
                    d.addDays(firstDayOfWeek);
                }
            }
            setDate?.((0, interface_1.toMarkingFormat)(d), updateSource);
        }
    }, [horizontal, isOpen, firstDay, numberOfDays, setDate, date]);
    /** Pan Gesture */
    const handleMoveShouldSetPanResponder = (_, gestureState) => {
        if (disablePan) {
            return false;
        }
        if (!horizontal && isOpen) {
            // disable pan detection when vertical calendar is open to allow calendar scroll
            return false;
        }
        if (!isOpen && gestureState.dy < 0) {
            // disable pan detection to limit to closed height
            return false;
        }
        return gestureState.dy > 5 || gestureState.dy < -5;
    };
    const handlePanResponderMove = (_, gestureState) => {
        // limit min height to closed height and max to open height
        _wrapperStyles.current.style.height = Math.min(Math.max(closedHeight, _height.current + gestureState.dy), openHeight.current);
        if (!horizontal) {
            // vertical CalenderList header
            _headerStyles.style.top = Math.min(Math.max(-gestureState.dy, -headerHeight), 0);
        }
        else {
            // horizontal Week view
            if (!isOpen) {
                _weekCalendarStyles.style.opacity = Math.min(1, Math.max(1 - gestureState.dy / 100, 0));
            }
            else if (gestureState.dy < 0) {
                _weekCalendarStyles.style.opacity = Math.max(0, Math.min(Math.abs(gestureState.dy / 200), 1));
            }
        }
        updateNativeStyles();
    };
    const handlePanResponderEnd = () => {
        _height.current = Number(_wrapperStyles.current.style.height);
        bounceToPosition();
    };
    const numberOfDaysCondition = (0, react_1.useMemo)(() => {
        return !numberOfDays || numberOfDays && numberOfDays <= 1;
    }, [numberOfDays]);
    const panResponder = (0, react_1.useMemo)(() => numberOfDaysCondition ? react_native_1.PanResponder.create({
        onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd
    }) : react_native_1.PanResponder.create({}), [numberOfDays, position, headerHeight]); // All the functions here rely on headerHeight directly or indirectly through refs that are updated in useEffect
    /** Animated */
    const bounceToPosition = (toValue = 0) => {
        const threshold = isOpen ? openHeight.current - closeThreshold : closedHeight + openThreshold;
        let _isOpen = _height.current >= threshold;
        const newValue = _isOpen ? openHeight.current : closedHeight;
        deltaY.setValue(_height.current); // set the start position for the animated value
        _height.current = toValue || newValue;
        _isOpen = _height.current >= threshold; // re-check after _height.current was set
        resetWeekCalendarOpacity(_isOpen);
        react_native_1.Animated.spring(deltaY, {
            toValue: _height.current,
            speed: SPEED,
            bounciness: BOUNCINESS,
            useNativeDriver: false
        }).start(() => {
            onCalendarToggled?.(_isOpen);
            setPosition(() => _height.current === closedHeight ? Positions.CLOSED : Positions.OPEN);
        });
        toggleAnimatedHeader(_isOpen);
    };
    const resetWeekCalendarOpacity = async (isOpen) => {
        _weekCalendarStyles.style.opacity = isOpen ? 0 : 1;
        updateNativeStyles();
    };
    const toggleAnimatedHeader = (isOpen) => {
        headerDeltaY.current.setValue(Number(_headerStyles.style.top)); // set the start position for the animated value
        if (!horizontal) {
            react_native_1.Animated.spring(headerDeltaY.current, {
                toValue: isOpen ? -headerHeight : 0,
                speed: SPEED / 10,
                bounciness: 1,
                useNativeDriver: false
            }).start();
        }
    };
    const closeCalendar = (0, react_1.useCallback)(() => {
        setTimeout(() => {
            // to allows setDate to be completed
            if (isOpen) {
                bounceToPosition(closedHeight);
            }
        }, 0);
    }, [isOpen, closedHeight]);
    const toggleCalendarPosition = (0, react_1.useCallback)(() => {
        bounceToPosition(isOpen ? closedHeight : openHeight.current);
        return !isOpen;
    }, [isOpen, bounceToPosition, closedHeight]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        toggleCalendarPosition
    }), [toggleCalendarPosition]);
    /** Events */
    const _onPressArrowLeft = (0, react_1.useCallback)((method, month) => {
        onPressArrowLeft?.(method, month);
        scrollPage(false, isOpen ? commons_1.UpdateSources.ARROW_PRESS : commons_1.UpdateSources.WEEK_ARROW_PRESS);
    }, [onPressArrowLeft, scrollPage]);
    const _onPressArrowRight = (0, react_1.useCallback)((method, month) => {
        onPressArrowRight?.(method, month);
        scrollPage(true, isOpen ? commons_1.UpdateSources.ARROW_PRESS : commons_1.UpdateSources.WEEK_ARROW_PRESS);
    }, [onPressArrowRight, scrollPage]);
    const _onDayPress = (0, react_1.useCallback)((value) => {
        if (numberOfDaysCondition) {
            setDate?.(value.dateString, commons_1.UpdateSources.DAY_PRESS);
        }
        if (closeOnDayPress && !disablePan) {
            closeCalendar();
        }
        onDayPress?.(value);
    }, [onDayPress, closeOnDayPress, closeCalendar, numberOfDaysCondition]);
    const onVisibleMonthsChange = (0, react_1.useCallback)((0, throttle_1.default)((value) => {
        const newDate = (0, first_1.default)(value);
        if (newDate) {
            const month = newDate.month;
            if (month && visibleMonth.current !== month) {
                visibleMonth.current = month;
                const year = newDate.year;
                if (year) {
                    visibleYear.current = year;
                }
                // for horizontal scroll
                if (visibleMonth.current !== getMonth(date)) {
                    const next = isLaterDate(newDate, date);
                    scrollPage(next);
                }
                // updating openHeight
                setTimeout(() => {
                    // to wait for setDate() call in horizontal scroll (scrollPage())
                    const _numberOfWeeks = getNumberOfWeeksInMonth(newDate.dateString);
                    if (_numberOfWeeks !== numberOfWeeks.current) {
                        numberOfWeeks.current = _numberOfWeeks;
                        openHeight.current = getOpenHeight();
                        if (isOpen) {
                            bounceToPosition(openHeight.current);
                        }
                    }
                }, 0);
            }
        }
    }, 100, { trailing: true, leading: false }), [date, scrollPage]);
    /** Renders */
    const _renderArrow = (0, react_1.useCallback)((direction) => {
        if ((0, isFunction_1.default)(renderArrow)) {
            return renderArrow(direction);
        }
        return (<react_native_1.Image source={direction === 'right' ? rightArrowImageSource : leftArrowImageSource} style={style.current.arrowImage} testID={`${testID}.${direction}Arrow`}/>);
    }, [renderArrow, rightArrowImageSource, leftArrowImageSource, testID]);
    const renderWeekDaysNames = () => {
        return (<react_native_1.View style={weekDaysStyle}>
        <WeekDaysNames_1.default firstDay={firstDay} style={style.current.dayHeader}/>
      </react_native_1.View>);
    };
    const renderAnimatedHeader = () => {
        const monthYear = new xdate_1.default(date)?.toString('MMMM yyyy');
        return (<react_native_1.Animated.View ref={header} style={animatedHeaderStyle} pointerEvents={'none'}>
        <react_native_1.Text allowFontScaling={false} style={style.current.headerTitle}>
          {monthYear}
        </react_native_1.Text>
        {renderWeekDaysNames()}
      </react_native_1.Animated.View>);
    };
    const renderKnob = () => {
        return (<react_native_1.View style={style.current.knobContainer} pointerEvents={'box-none'}>
        <react_native_1.TouchableOpacity style={style.current.knob} testID={`${testID}.knob`} onPress={toggleCalendarPosition} hitSlop={knobHitSlop}/>
      </react_native_1.View>);
    };
    const renderWeekCalendar = () => {
        const WeekComponent = disableWeekScroll ? week_1.default : WeekCalendar_1.default;
        return (<react_native_1.Animated.View ref={weekCalendarWrapper} style={weekCalendarStyle} pointerEvents={isOpen ? 'none' : 'auto'}>
        <WeekComponent testID={`${testID}.weekCalendar`} firstDay={firstDay} {...others} allowShadow={disableWeekScroll ? undefined : false} current={disableWeekScroll ? date : undefined} theme={themeObject} style={calendarStyle} hideDayNames={true} onDayPress={_onDayPress} accessibilityElementsHidden // iOS
         importantForAccessibility={'no-hide-descendants'} // Android
        />
      </react_native_1.Animated.View>);
    };
    const renderCalendarList = () => {
        return (<calendar_list_1.default testID={`${testID}.calendarList`} horizontal={horizontal} firstDay={firstDay} calendarStyle={calendarStyle} onHeaderLayout={onHeaderLayout} {...others} current={date} theme={themeObject} ref={calendarList} onDayPress={_onDayPress} onVisibleMonthsChange={onVisibleMonthsChange} pagingEnabled scrollEnabled={isOpen} hideArrows={shouldHideArrows} onPressArrowLeft={_onPressArrowLeft} onPressArrowRight={_onPressArrowRight} hideExtraDays={!horizontal && isOpen} renderArrow={_renderArrow} staticHeader numberOfDays={numberOfDays} headerStyle={_headerStyle} timelineLeftInset={timelineLeftInset} context={_context}/>);
    };
    return (<react_native_1.View testID={testID} style={containerStyle}>
      {screenReaderEnabled ? (<calendar_1.default testID={`${testID}.calendarAccessible`} {...others} theme={themeObject} onHeaderLayout={onHeaderLayout} onDayPress={_onDayPress} hideExtraDays renderArrow={_renderArrow}/>) : (<react_native_1.Animated.View testID={`${testID}.expandableContainer`} ref={wrapper} style={wrapperStyle} {...panResponder.panHandlers}>
          {renderCalendarList()}
          {renderWeekCalendar()}
          {!hideKnob && renderKnob()}
          {!horizontal && renderAnimatedHeader()}
        </react_native_1.Animated.View>)}
    </react_native_1.View>);
});
exports.default = Object.assign(ExpandableCalendar, {
    displayName: 'ExpandableCalendar',
    positions: Positions,
    navigationTypes: commons_1.CalendarNavigationTypes,
    defaultProps: {
        horizontal: true,
        initialPosition: Positions.CLOSED,
        firstDay: 0,
        leftArrowImageSource: LEFT_ARROW,
        rightArrowImageSource: RIGHT_ARROW,
        allowShadow: true,
        openThreshold: PAN_GESTURE_THRESHOLD,
        closeThreshold: PAN_GESTURE_THRESHOLD,
        closeOnDayPress: true
    }
});
