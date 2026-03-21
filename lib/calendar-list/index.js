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
const findIndex_1 = __importDefault(require("lodash/findIndex"));
const prop_types_1 = __importDefault(require("prop-types"));
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const componentUpdater_1 = require("../componentUpdater");
const interface_1 = require("../interface");
const dateutils_1 = require("../dateutils");
const constants_1 = __importDefault(require("../commons/constants"));
const hooks_1 = require("../hooks");
const style_1 = __importDefault(require("./style"));
const calendar_1 = __importDefault(require("../calendar"));
const item_1 = __importDefault(require("./item"));
const index_1 = __importDefault(require("../calendar/header/index"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const CALENDAR_WIDTH = constants_1.default.screenWidth;
const CALENDAR_HEIGHT = 360;
const PAST_SCROLL_RANGE = 50;
const FUTURE_SCROLL_RANGE = 50;
/**
 * @description: Calendar List component for both vertical and horizontal calendars
 * @extends: Calendar
 * @extendslink: docs/Calendar
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarsList.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar-list.gif
 */
const CalendarList = (props, ref) => {
    (0, react_1.useImperativeHandle)(ref, () => ({
        scrollToDay: (date, offset, animated) => {
            scrollToDay(date, offset, animated);
        },
        scrollToMonth: (date) => {
            scrollToMonth(date);
        }
    }));
    const { 
    /** Calendar props */
    theme, current, firstDay, markedDates, headerStyle, onMonthChange, onVisibleMonthsChange, 
    /** CalendarList props */
    pastScrollRange = PAST_SCROLL_RANGE, futureScrollRange = FUTURE_SCROLL_RANGE, calendarHeight = CALENDAR_HEIGHT, calendarWidth = CALENDAR_WIDTH, calendarStyle, animateScroll = false, showScrollIndicator = false, staticHeader, 
    /** View props */
    testID, style: propsStyle, onLayout, removeClippedSubviews, 
    /** ScrollView props */
    horizontal = false, numberOfItemsInSnapToInterval, decelerationRate, pagingEnabled, scrollEnabled = true, nestedScrollEnabled = true, scrollsToTop = false, keyExtractor = (_, index) => String(index), keyboardShouldPersistTaps, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollBegin, onMomentumScrollEnd, 
    /** FlatList props */
    contentContainerStyle, onEndReachedThreshold, onEndReached, onHeaderLayout, accessibilityElementsHidden, importantForAccessibility, itemLayoutOffset = 0, ItemSeparatorComponentCalendarList } = props;
    const calendarProps = (0, componentUpdater_1.extractCalendarProps)(props);
    const headerProps = (0, componentUpdater_1.extractHeaderProps)(props);
    const calendarSize = horizontal ? calendarWidth : calendarHeight;
    // Single source of truth for FlatList "item size" math (layout, scrolling, snapping).
    // Keep any per-item size usage aligned to this to avoid drift.
    const listItemSize = calendarSize + itemLayoutOffset;
    const shouldUseStaticHeader = staticHeader && horizontal;
    const [currentMonth, setCurrentMonth] = (0, react_1.useState)((0, interface_1.parseDate)(current));
    const shouldFixRTL = (0, react_1.useMemo)(() => !constants_1.default.isRN73() && constants_1.default.isAndroidRTL && horizontal, [horizontal]);
    /**
     * we render a lot of months in the calendar list and we need to measure the header only once
     * so we use this ref to limit the header measurement to the first render
     */
    const shouldMeasureHeader = (0, react_1.useRef)(true);
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const list = (0, react_1.useRef)();
    const range = (0, react_1.useRef)(horizontal ? 1 : 3);
    const initialDate = (0, react_1.useRef)((0, interface_1.parseDate)(current) || new xdate_1.default());
    const visibleMonth = (0, react_1.useRef)(currentMonth);
    const items = (0, react_1.useMemo)(() => {
        const months = [];
        for (let i = 0; i <= pastScrollRange + futureScrollRange; i++) {
            const rangeDate = initialDate.current?.clone().addMonths(i - pastScrollRange, true);
            months.push(rangeDate);
        }
        return months;
    }, [pastScrollRange, futureScrollRange]);
    const staticHeaderStyle = (0, react_1.useMemo)(() => {
        return [style.current.staticHeader, headerStyle];
    }, [headerStyle]);
    const listStyle = (0, react_1.useMemo)(() => {
        return [style.current.container, propsStyle];
    }, [propsStyle]);
    const initialDateIndex = (0, react_1.useMemo)(() => {
        return (0, findIndex_1.default)(items, function (item) {
            return item.toString() === initialDate.current?.toString();
        });
    }, [items]);
    const getDateIndex = (0, react_1.useCallback)((date) => {
        return (0, findIndex_1.default)(items, function (item) {
            return item.toString() === date.toString();
        });
    }, [items]);
    (0, react_1.useEffect)(() => {
        if (current) {
            scrollToMonth(new xdate_1.default(current));
        }
    }, [current]);
    (0, hooks_1.useDidUpdate)(() => {
        const currMont = currentMonth?.clone();
        if (currMont) {
            const data = (0, interface_1.xdateToData)(currMont);
            onMonthChange?.(data);
            onVisibleMonthsChange?.([data]);
            react_native_1.AccessibilityInfo.announceForAccessibility(currMont.toString('MMMM yyyy'));
        }
    }, [currentMonth]);
    const scrollToDay = (date, offset, animated) => {
        const scrollTo = (0, interface_1.parseDate)(date);
        const diffMonths = Math.round(initialDate?.current?.clone().setDate(1).diffMonths(scrollTo?.clone().setDate(1)));
        let scrollAmount = listItemSize * pastScrollRange + diffMonths * listItemSize + (offset || 0);
        if (!horizontal) {
            let week = 0;
            const days = (0, dateutils_1.page)(scrollTo, firstDay);
            for (let i = 0; i < days.length; i++) {
                week = Math.floor(i / 7);
                if ((0, dateutils_1.sameDate)(days[i], scrollTo)) {
                    scrollAmount += 46 * week;
                    break;
                }
            }
        }
        if (scrollAmount !== 0) {
            list?.current?.scrollToOffset({ offset: scrollAmount, animated });
        }
    };
    const scrollToMonth = (0, react_1.useCallback)((date) => {
        const scrollTo = (0, interface_1.parseDate)(date);
        const diffMonths = Math.round(initialDate?.current?.clone().setDate(1).diffMonths(scrollTo?.clone().setDate(1)));
        const scrollAmount = listItemSize * (shouldFixRTL ? pastScrollRange - diffMonths : pastScrollRange + diffMonths);
        if (scrollAmount !== 0) {
            list?.current?.scrollToOffset({ offset: scrollAmount, animated: animateScroll });
        }
    }, [listItemSize, shouldFixRTL, pastScrollRange, animateScroll]);
    const addMonth = (0, react_1.useCallback)((count) => {
        const day = currentMonth?.clone().addMonths(count, true);
        if ((0, dateutils_1.sameMonth)(day, currentMonth) || getDateIndex(day) === -1) {
            return;
        }
        scrollToMonth(day);
        setCurrentMonth(day);
    }, [currentMonth, scrollToMonth]);
    const getMarkedDatesForItem = (0, react_1.useCallback)((item) => {
        if (markedDates && item) {
            for (const [key, _] of Object.entries(markedDates)) {
                if ((0, dateutils_1.sameMonth)(new xdate_1.default(key), new xdate_1.default(item))) {
                    return markedDates;
                }
            }
        }
    }, [markedDates]);
    const getItemLayout = (0, react_1.useCallback)((_, index) => {
        return {
            length: listItemSize,
            offset: listItemSize * index,
            index
        };
    }, [listItemSize]);
    const isDateInRange = (0, react_1.useCallback)(date => {
        for (let i = -range.current; i <= range.current; i++) {
            const newMonth = currentMonth?.clone().addMonths(i, true);
            if ((0, dateutils_1.sameMonth)(date, newMonth)) {
                return true;
            }
        }
        return false;
    }, [currentMonth]);
    const renderItem = (0, react_1.useCallback)(({ item }) => {
        const dateString = (0, interface_1.toMarkingFormat)(item);
        const [year, month] = dateString.split('-');
        const testId = `${testID}.item_${year}-${month}`;
        const onHeaderLayoutToPass = shouldMeasureHeader.current ? onHeaderLayout : undefined;
        shouldMeasureHeader.current = false;
        return (<item_1.default {...calendarProps} testID={testId} markedDates={getMarkedDatesForItem(item)} item={item} style={calendarStyle} 
        // @ts-expect-error - type mismatch - ScrollView's 'horizontal' is nullable
        horizontal={horizontal} calendarWidth={calendarWidth} calendarHeight={calendarHeight} scrollToMonth={scrollToMonth} visible={isDateInRange(item)} onHeaderLayout={onHeaderLayoutToPass}/>);
    }, [
        horizontal,
        calendarStyle,
        calendarWidth,
        calendarHeight,
        testID,
        onHeaderLayout,
        scrollToMonth,
        getMarkedDatesForItem,
        isDateInRange,
        calendarProps
    ]);
    const renderStaticHeader = () => {
        if (shouldUseStaticHeader) {
            const onHeaderLayoutToPass = shouldMeasureHeader.current ? onHeaderLayout : undefined;
            shouldMeasureHeader.current = false;
            return (<index_1.default {...headerProps} testID={`${testID}.staticHeader`} style={staticHeaderStyle} month={currentMonth} addMonth={addMonth} onHeaderLayout={onHeaderLayoutToPass} accessibilityElementsHidden={accessibilityElementsHidden} // iOS
             importantForAccessibility={importantForAccessibility} // Android
            />);
        }
    };
    /** Viewable month */
    const viewabilityConfig = (0, react_1.useRef)({
        viewAreaCoveragePercentThreshold: 20
    });
    const onViewableItemsChanged = (0, react_1.useCallback)(({ viewableItems }) => {
        const newVisibleMonth = (0, interface_1.parseDate)(viewableItems[0]?.item);
        if (shouldFixRTL) {
            const centerIndex = items.findIndex(item => (0, isEqual_1.default)((0, interface_1.parseDate)(current), item));
            const adjustedOffset = centerIndex - items.findIndex(item => (0, isEqual_1.default)(newVisibleMonth, item));
            visibleMonth.current = items[centerIndex + adjustedOffset];
            setCurrentMonth(visibleMonth.current);
        }
        else {
            if (!(0, dateutils_1.sameDate)(visibleMonth?.current, newVisibleMonth)) {
                visibleMonth.current = newVisibleMonth;
                setCurrentMonth(visibleMonth.current);
            }
        }
    }, [items, shouldFixRTL, current]);
    const viewabilityConfigCallbackPairs = (0, react_1.useRef)([
        {
            viewabilityConfig: viewabilityConfig.current,
            onViewableItemsChanged
        }
    ]);
    return (<react_native_1.View style={style.current.flatListContainer} testID={testID}>
      <react_native_1.FlatList ref={list} windowSize={shouldFixRTL ? pastScrollRange + futureScrollRange + 1 : undefined} style={listStyle} showsVerticalScrollIndicator={showScrollIndicator} showsHorizontalScrollIndicator={showScrollIndicator} data={items} renderItem={renderItem} getItemLayout={getItemLayout} initialNumToRender={range.current} initialScrollIndex={initialDateIndex} viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current} testID={`${testID}.list`} onLayout={onLayout} removeClippedSubviews={removeClippedSubviews} {...(numberOfItemsInSnapToInterval !== undefined
        ? { snapToInterval: listItemSize * numberOfItemsInSnapToInterval }
        : {})} {...(decelerationRate !== undefined ? { decelerationRate: decelerationRate } : {})} pagingEnabled={pagingEnabled} scrollEnabled={scrollEnabled} scrollsToTop={scrollsToTop} horizontal={horizontal} keyboardShouldPersistTaps={keyboardShouldPersistTaps} keyExtractor={keyExtractor} onEndReachedThreshold={onEndReachedThreshold} onEndReached={onEndReached} nestedScrollEnabled={nestedScrollEnabled} onMomentumScrollBegin={onMomentumScrollBegin} onMomentumScrollEnd={onMomentumScrollEnd} onScrollBeginDrag={onScrollBeginDrag} onScrollEndDrag={onScrollEndDrag} contentContainerStyle={contentContainerStyle} ItemSeparatorComponent={ItemSeparatorComponentCalendarList}/>
      {renderStaticHeader()}
    </react_native_1.View>);
};
exports.default = (0, react_1.forwardRef)(CalendarList);
CalendarList.displayName = 'CalendarList';
CalendarList.propTypes = {
    ...calendar_1.default.propTypes,
    pastScrollRange: prop_types_1.default.number,
    futureScrollRange: prop_types_1.default.number,
    calendarWidth: prop_types_1.default.number,
    calendarHeight: prop_types_1.default.number,
    calendarStyle: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.number, prop_types_1.default.array]),
    staticHeader: prop_types_1.default.bool,
    showScrollIndicator: prop_types_1.default.bool,
    animateScroll: prop_types_1.default.bool,
    scrollEnabled: prop_types_1.default.bool,
    scrollsToTop: prop_types_1.default.bool,
    pagingEnabled: prop_types_1.default.bool,
    horizontal: prop_types_1.default.bool,
    keyboardShouldPersistTaps: prop_types_1.default.oneOf(['never', 'always', 'handled']),
    keyExtractor: prop_types_1.default.func,
    onEndReachedThreshold: prop_types_1.default.number,
    onEndReached: prop_types_1.default.func,
    nestedScrollEnabled: prop_types_1.default.bool
};
