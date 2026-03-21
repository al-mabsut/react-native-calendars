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
exports.NUMBER_OF_PAGES = void 0;
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const dateutils_1 = require("../../dateutils");
const interface_1 = require("../../interface");
const style_1 = __importDefault(require("../style"));
const WeekDaysNames_1 = __importDefault(require("../../commons/WeekDaysNames"));
const week_1 = __importDefault(require("../week"));
const commons_1 = require("../commons");
const constants_1 = __importDefault(require("../../commons/constants"));
const componentUpdater_1 = require("../../componentUpdater");
const Context_1 = __importDefault(require("../Context"));
const hooks_1 = require("../../hooks");
exports.NUMBER_OF_PAGES = 6;
const NUM_OF_ITEMS = exports.NUMBER_OF_PAGES * 2 + 1; // NUMBER_OF_PAGES before + NUMBER_OF_PAGES after + current
/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const WeekCalendar = (props) => {
    const { calendarWidth, hideDayNames, current, theme, testID, markedDates } = props;
    const context = (0, react_1.useContext)(Context_1.default);
    const { allowShadow = true, ...calendarListProps } = props;
    const { style: propsStyle, onDayPress, firstDay = 0, ...others } = (0, componentUpdater_1.extractCalendarProps)(calendarListProps);
    const { date, numberOfDays, updateSource, setDate, timelineLeftInset } = context;
    const visibleWeek = (0, react_1.useRef)(date);
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const items = (0, react_1.useRef)(getDatesArray(current ?? date, firstDay, numberOfDays));
    const [listData, setListData] = (0, react_1.useState)(items.current);
    const changedItems = (0, react_1.useRef)(constants_1.default.isRTL);
    const list = (0, react_1.useRef)(null);
    const currentIndex = (0, react_1.useRef)(exports.NUMBER_OF_PAGES);
    const shouldFixRTL = (0, react_1.useMemo)(() => !constants_1.default.isRN73() && constants_1.default.isAndroidRTL, []);
    (0, hooks_1.useDidUpdate)(() => {
        items.current = getDatesArray(date, firstDay, numberOfDays);
        setListData(items.current);
        visibleWeek.current = date;
        list?.current?.scrollToIndex({ index: exports.NUMBER_OF_PAGES, animated: false });
    }, [numberOfDays]);
    (0, hooks_1.useDidUpdate)(() => {
        if (updateSource !== commons_1.UpdateSources.WEEK_SCROLL) {
            const pageIndex = items.current.findIndex(item => isCustomNumberOfDays(numberOfDays) ?
                (0, dateutils_1.onSameDateRange)({
                    firstDay: item,
                    secondDay: date,
                    numberOfDays: numberOfDays,
                    firstDateInRange: item
                }) :
                (0, dateutils_1.sameWeek)(item, date, firstDay));
            if (pageIndex !== currentIndex.current) {
                const adjustedIndexFrScroll = shouldFixRTL ? NUM_OF_ITEMS - 1 - pageIndex : pageIndex;
                if (pageIndex >= 0) {
                    visibleWeek.current = items.current[adjustedIndexFrScroll];
                    currentIndex.current = adjustedIndexFrScroll;
                }
                else {
                    visibleWeek.current = date;
                    currentIndex.current = exports.NUMBER_OF_PAGES;
                }
                pageIndex <= 0 ? onEndReached() : list?.current?.scrollToIndex({ index: adjustedIndexFrScroll, animated: false });
            }
        }
    }, [date, updateSource, shouldFixRTL]);
    const containerWidth = (0, react_1.useMemo)(() => {
        return calendarWidth ?? constants_1.default.screenWidth;
    }, [calendarWidth]);
    const _onDayPress = (0, react_1.useCallback)((value) => {
        if (onDayPress) {
            onDayPress(value);
        }
        else {
            setDate?.(value.dateString, commons_1.UpdateSources.DAY_PRESS);
        }
    }, [onDayPress]);
    const getCurrentWeekMarkings = (0, react_1.useCallback)((date, markings) => {
        if (!markings) {
            return;
        }
        const dates = (0, dateutils_1.getWeekDates)(date, firstDay);
        return dates?.reduce((acc, date) => {
            const dateString = (0, interface_1.toMarkingFormat)(date);
            return {
                ...acc,
                ...(markings[dateString] && { [dateString]: markings[dateString] })
            };
        }, {});
    }, []);
    const weekStyle = (0, react_1.useMemo)(() => {
        return [{ width: containerWidth }, propsStyle];
    }, [containerWidth, propsStyle]);
    const renderItem = (0, react_1.useCallback)(({ item }) => {
        const currentContext = (0, dateutils_1.sameWeek)(date, item, firstDay) ? context : undefined;
        const markings = getCurrentWeekMarkings(item, markedDates);
        return (<week_1.default {...others} markedDates={markings} current={item} firstDay={firstDay} style={weekStyle} context={currentContext} onDayPress={_onDayPress} numberOfDays={numberOfDays} timelineLeftInset={timelineLeftInset}/>);
    }, [firstDay, _onDayPress, context, date, markedDates]);
    const keyExtractor = (0, react_1.useCallback)((item, index) => `${item}-${index}`, []);
    const renderWeekDaysNames = (0, react_1.useMemo)(() => {
        return (<WeekDaysNames_1.default firstDay={firstDay} style={style.current.dayHeader}/>);
    }, [firstDay]);
    const weekCalendarStyle = (0, react_1.useMemo)(() => {
        return [
            allowShadow && style.current.containerShadow,
            !hideDayNames && style.current.containerWrapper
        ];
    }, [allowShadow, hideDayNames]);
    const containerStyle = (0, react_1.useMemo)(() => {
        return [style.current.week, style.current.weekCalendar];
    }, []);
    const getItemLayout = (0, react_1.useCallback)((_, index) => {
        return {
            length: containerWidth,
            offset: containerWidth * index,
            index
        };
    }, [containerWidth]);
    const onEndReached = (0, react_1.useCallback)(() => {
        changedItems.current = true;
        items.current = (getDatesArray(visibleWeek.current, firstDay, numberOfDays));
        setListData(items.current);
        currentIndex.current = exports.NUMBER_OF_PAGES;
        list?.current?.scrollToIndex({ index: exports.NUMBER_OF_PAGES, animated: false });
    }, [firstDay, numberOfDays]);
    const onViewableItemsChanged = (0, react_1.useCallback)(({ viewableItems }) => {
        if (changedItems.current || viewableItems.length === 0) {
            changedItems.current = false;
            return;
        }
        const currItems = items.current;
        const newDate = viewableItems[0]?.item;
        if (newDate !== visibleWeek.current) {
            if (shouldFixRTL) {
                //in android RTL the item we see is the one in the opposite direction
                const newDateOffset = -1 * (exports.NUMBER_OF_PAGES - currItems.indexOf(newDate));
                const adjustedNewDate = currItems[exports.NUMBER_OF_PAGES - newDateOffset];
                visibleWeek.current = adjustedNewDate;
                currentIndex.current = currItems.indexOf(adjustedNewDate);
                setDate(adjustedNewDate, commons_1.UpdateSources.WEEK_SCROLL);
                if (visibleWeek.current === currItems[currItems.length - 1]) {
                    onEndReached();
                }
            }
            else {
                currentIndex.current = currItems.indexOf(newDate);
                visibleWeek.current = newDate;
                setDate(newDate, commons_1.UpdateSources.WEEK_SCROLL);
                if (visibleWeek.current === currItems[0]) {
                    onEndReached();
                }
            }
        }
    }, [onEndReached, shouldFixRTL]);
    const viewabilityConfigCallbackPairs = (0, react_1.useRef)([{
            viewabilityConfig: {
                itemVisiblePercentThreshold: 20
            },
            onViewableItemsChanged
        }]);
    return (<react_native_1.View testID={testID} style={weekCalendarStyle}>
      {!hideDayNames && (<react_native_1.View style={containerStyle}>
          {renderWeekDaysNames}
        </react_native_1.View>)}
      <react_native_1.View style={style.current.container}>
          <react_native_1.FlatList testID={`${testID}.list`} ref={list} style={style.current.container} data={listData} horizontal showsHorizontalScrollIndicator={false} pagingEnabled scrollEnabled renderItem={renderItem} keyExtractor={keyExtractor} initialScrollIndex={exports.NUMBER_OF_PAGES} getItemLayout={getItemLayout} viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current} onEndReached={onEndReached} onEndReachedThreshold={1 / NUM_OF_ITEMS}/>
      </react_native_1.View>
    </react_native_1.View>);
};
function getDateForDayRange(date, weekIndex, numberOfDays) {
    const d = new xdate_1.default(date);
    if (weekIndex !== 0) {
        d.addDays(numberOfDays * weekIndex);
    }
    return (0, interface_1.toMarkingFormat)(d);
}
function getDate(date, firstDay, weekIndex, numberOfDays) {
    const d = new xdate_1.default(date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
        dayOfTheWeek = 7 + dayOfTheWeek;
    }
    if (weekIndex !== 0) {
        d.addDays(firstDay - dayOfTheWeek);
    }
    const newDate = numberOfDays && numberOfDays > 1 ? d.addDays(weekIndex * numberOfDays) : d.addWeeks(weekIndex);
    const today = new xdate_1.default();
    const offsetFromNow = newDate.diffDays(today);
    const isSameWeek = offsetFromNow > 0 && offsetFromNow < (numberOfDays ?? 7);
    return (0, interface_1.toMarkingFormat)(isSameWeek ? today : newDate);
}
function getDatesArray(date, firstDay, numberOfDays) {
    return [...Array(NUM_OF_ITEMS).keys()].map((index) => {
        if (isCustomNumberOfDays(numberOfDays)) {
            return getDateForDayRange(date, index - exports.NUMBER_OF_PAGES, numberOfDays);
        }
        return getDate(date, firstDay, index - exports.NUMBER_OF_PAGES);
    });
}
function isCustomNumberOfDays(numberOfDays) {
    return numberOfDays && numberOfDays > 1;
}
WeekCalendar.displayName = 'WeekCalendar';
exports.default = WeekCalendar;
