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
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const constants_1 = __importDefault(require("../commons/constants"));
const interface_1 = require("../interface");
const componentUpdater_1 = require("../componentUpdater");
const calendar_1 = __importDefault(require("../calendar"));
const header_1 = __importDefault(require("../calendar/header"));
const infinite_list_1 = __importDefault(require("../infinite-list"));
const style_1 = __importDefault(require("./style"));
const NUMBER_OF_PAGES = 50;
const CALENDAR_HEIGHT = 360;
const CalendarList = (props) => {
    const { initialDate, horizontal, scrollRange = NUMBER_OF_PAGES, staticHeader, scrollViewProps, calendarProps, testID } = props;
    const style = (0, react_1.useRef)((0, style_1.default)(calendarProps?.theme));
    const list = (0, react_1.useRef)();
    const [items, setItems] = (0, react_1.useState)(getDatesArray(initialDate, scrollRange));
    const [positionIndex, setPositionIndex] = (0, react_1.useState)(scrollRange);
    /** Static Header */
    const [currentMonth, setCurrentMonth] = (0, react_1.useState)(initialDate || items[scrollRange]);
    const shouldRenderStaticHeader = staticHeader && horizontal;
    const headerProps = (0, componentUpdater_1.extractHeaderProps)(props);
    const staticHeaderStyle = (0, react_1.useMemo)(() => {
        return [style.current.staticHeader, calendarProps?.headerStyle];
    }, [calendarProps?.headerStyle]);
    (0, react_1.useEffect)(() => {
        scrollToMonth(currentMonth);
    }, [currentMonth]);
    const getMonthIndex = (0, react_1.useCallback)((month) => {
        if (!month) {
            return -1;
        }
        return items.findIndex(item => item.includes(month.toString('yyyy-MM')));
    }, [items]);
    const scrollToMonth = (0, react_1.useCallback)((month) => {
        if (month) {
            const index = getMonthIndex(new xdate_1.default(month));
            if (index !== -1) {
                const shouldAnimate = constants_1.default.isAndroid && !horizontal ? false : true;
                // @ts-expect-error
                list.current?.scrollToOffset?.(index * constants_1.default.screenWidth, 0, shouldAnimate);
            }
        }
    }, [getMonthIndex]);
    const updateMonth = (0, react_1.useCallback)((count, month) => {
        if (month) {
            const next = new xdate_1.default(month).addMonths(count, true);
            const nextNext = new xdate_1.default(month).addMonths(count * 2, true);
            const nextNextIndex = getMonthIndex(nextNext);
            if (nextNextIndex !== -1) {
                setCurrentMonth((0, interface_1.toMarkingFormat)(next));
            }
        }
    }, [getMonthIndex]);
    const scrollToNextMonth = (0, react_1.useCallback)((method, month) => {
        if (calendarProps?.onPressArrowLeft) {
            calendarProps?.onPressArrowLeft?.(method, month);
        }
        else {
            updateMonth(1, month);
        }
    }, [updateMonth]);
    const scrollToPreviousMonth = (0, react_1.useCallback)((method, month) => {
        if (calendarProps?.onPressArrowRight) {
            calendarProps?.onPressArrowRight?.(method, month);
        }
        else {
            updateMonth(-1, month);
        }
    }, [updateMonth]);
    const onPageChange = (0, react_1.useCallback)((pageIndex, _, info) => {
        if (shouldRenderStaticHeader && info.scrolledByUser) {
            setCurrentMonth(items[pageIndex]);
        }
    }, [items]);
    const renderStaticHeader = () => {
        if (shouldRenderStaticHeader) {
            return (<header_1.default {...headerProps} month={new xdate_1.default(currentMonth)} onPressArrowRight={scrollToNextMonth} onPressArrowLeft={scrollToPreviousMonth} style={staticHeaderStyle} accessibilityElementsHidden // iOS
             importantForAccessibility={'no-hide-descendants'} // Android
             testID={'static-header'}/>);
        }
    };
    /** Data */
    const reloadPages = (0, react_1.useCallback)(pageIndex => {
        horizontal ? replaceItems(pageIndex) : addItems(pageIndex);
    }, [items]);
    const replaceItems = (index) => {
        const newItems = getDatesArray(items[index], scrollRange);
        setItems(newItems);
    };
    const addItems = (index) => {
        const array = [...items];
        const startingDate = items[index];
        const shouldAppend = index > scrollRange;
        if (startingDate) {
            if (shouldAppend) {
                for (let i = 2; i <= scrollRange; i++) {
                    const newDate = getDate(startingDate, i);
                    array.push(newDate);
                }
            }
            else {
                for (let i = -1; i > -scrollRange; i--) {
                    const newDate = getDate(startingDate, i);
                    array.unshift(newDate);
                }
            }
            setPositionIndex(shouldAppend ? index : scrollRange - 1);
            setItems(array);
        }
    };
    /** List */
    const listContainerStyle = (0, react_1.useMemo)(() => {
        return [style.current.flatListContainer, { flex: horizontal ? undefined : 1 }];
    }, [style, horizontal]);
    const scrollProps = (0, react_1.useMemo)(() => {
        return {
            ...scrollViewProps,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false
        };
    }, [scrollViewProps]);
    const renderItem = (0, react_1.useCallback)((_type, item) => {
        return (<calendar_1.default {...calendarProps} {...headerProps} initialDate={item} disableMonthChange hideArrows={!horizontal} onPressArrowRight={scrollToNextMonth} onPressArrowLeft={scrollToPreviousMonth} hideExtraDays={calendarProps?.hideExtraDays || true} style={[style.current.calendar, calendarProps?.style]} headerStyle={horizontal ? calendarProps?.headerStyle : undefined} testID={`${testID}_${item}`}/>);
    }, [calendarProps, scrollToNextMonth, scrollToPreviousMonth]);
    return (<react_native_1.View style={listContainerStyle}>
      <infinite_list_1.default key="calendar-list" ref={list} data={items} renderItem={renderItem} reloadPages={reloadPages} onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)} extendedState={calendarProps?.markedDates} isHorizontal={horizontal} style={style.current.container} initialPageIndex={scrollRange} positionIndex={positionIndex} pageHeight={CALENDAR_HEIGHT} pageWidth={constants_1.default.screenWidth} onPageChange={onPageChange} scrollViewProps={scrollProps}/>
      {renderStaticHeader()}
    </react_native_1.View>);
};
exports.default = CalendarList;
function getDate(date, index) {
    const d = new xdate_1.default(date);
    d.addMonths(index, true);
    // if (index !== 0) {
    d.setDate(1);
    // }
    return (0, interface_1.toMarkingFormat)(d);
}
function getDatesArray(date, numberOfPages = NUMBER_OF_PAGES) {
    const d = date || new xdate_1.default().toString();
    const array = [];
    for (let index = -numberOfPages; index <= numberOfPages; index++) {
        const newDate = getDate(d, index);
        array.push(newDate);
    }
    return array;
}
