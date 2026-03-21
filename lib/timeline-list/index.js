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
const throttle_1 = __importDefault(require("lodash/throttle"));
const flatten_1 = __importDefault(require("lodash/flatten"));
const dropRight_1 = __importDefault(require("lodash/dropRight"));
const react_1 = __importStar(require("react"));
const dateutils_1 = require("../dateutils");
const infinite_list_1 = __importDefault(require("../infinite-list"));
const Context_1 = __importDefault(require("../expandableCalendar/Context"));
const commons_1 = require("../expandableCalendar/commons");
const Timeline_1 = __importDefault(require("../timeline/Timeline"));
const useTimelinePages_1 = __importStar(require("./useTimelinePages"));
const constants_1 = __importDefault(require("../commons/constants"));
const TimelineList = (props) => {
    const { timelineProps, events, renderItem, showNowIndicator, scrollToFirst, scrollToNow, initialTime } = props;
    const shouldFixRTL = (0, react_1.useMemo)(() => constants_1.default.isRTL && (constants_1.default.isRN73() || constants_1.default.isAndroid), []); // isHorizontal = true
    const { date, updateSource, setDate, numberOfDays = 1, timelineLeftInset } = (0, react_1.useContext)(Context_1.default);
    const listRef = (0, react_1.useRef)();
    const prevDate = (0, react_1.useRef)(date);
    const [timelineOffset, setTimelineOffset] = (0, react_1.useState)();
    const { pages, pagesRef, resetPages, resetPagesDebounce, scrollToPageDebounce, shouldResetPages, isOutOfRange } = (0, useTimelinePages_1.default)({ date, listRef, numberOfDays, shouldFixRTL });
    const scrollToCurrentDate = (0, react_1.useCallback)((date) => {
        const datePageIndex = pagesRef.current.indexOf(date);
        if (updateSource !== commons_1.UpdateSources.LIST_DRAG) {
            if (isOutOfRange(datePageIndex)) {
                updateSource === commons_1.UpdateSources.DAY_PRESS ? resetPages(date) : resetPagesDebounce(date);
            }
            else {
                scrollToPageDebounce(datePageIndex);
            }
        }
        prevDate.current = date;
    }, [updateSource]);
    const initialOffset = (0, react_1.useMemo)(() => {
        return shouldFixRTL ? constants_1.default.screenWidth * (useTimelinePages_1.PAGES_COUNT - useTimelinePages_1.INITIAL_PAGE - 1) : constants_1.default.screenWidth * useTimelinePages_1.INITIAL_PAGE;
    }, [shouldFixRTL]);
    (0, react_1.useEffect)(() => {
        if (date !== prevDate.current) {
            scrollToCurrentDate(date);
        }
    }, [date]);
    const onScroll = (0, react_1.useCallback)(() => {
        if (shouldResetPages.current) {
            resetPagesDebounce.cancel();
        }
    }, []);
    const onMomentumScrollEnd = (0, react_1.useCallback)(() => {
        if (shouldResetPages.current) {
            resetPagesDebounce(prevDate.current);
        }
    }, []);
    const onPageChange = (0, react_1.useCallback)((0, throttle_1.default)((pageIndex) => {
        const newDate = pages[shouldFixRTL ? pageIndex - 1 : pageIndex];
        if (newDate !== prevDate.current) {
            setDate(newDate, commons_1.UpdateSources.LIST_DRAG);
        }
    }, 0), [pages, shouldFixRTL]);
    const onReachNearEdge = (0, react_1.useCallback)(() => {
        shouldResetPages.current = true;
    }, []);
    const onTimelineOffsetChange = (0, react_1.useCallback)(offset => {
        setTimelineOffset(offset);
    }, []);
    const renderPage = (0, react_1.useCallback)((_type, item, index) => {
        const isCurrent = prevDate.current === item;
        const isInitialPage = index === useTimelinePages_1.INITIAL_PAGE;
        const _isToday = (0, dateutils_1.isToday)(item);
        const weekEvents = [events[item] || [], events[(0, dateutils_1.generateDay)(item, 1)] || [], events[(0, dateutils_1.generateDay)(item, 2)] || [], events[(0, dateutils_1.generateDay)(item, 3)] || [], events[(0, dateutils_1.generateDay)(item, 4)] || [], events[(0, dateutils_1.generateDay)(item, 5)] || [], events[(0, dateutils_1.generateDay)(item, 6)] || []];
        const weekDates = [item, (0, dateutils_1.generateDay)(item, 1), (0, dateutils_1.generateDay)(item, 2), (0, dateutils_1.generateDay)(item, 3), (0, dateutils_1.generateDay)(item, 4), (0, dateutils_1.generateDay)(item, 5), (0, dateutils_1.generateDay)(item, 6)];
        const numberOfDaysToDrop = (7 - numberOfDays);
        const _timelineProps = {
            ...timelineProps,
            key: item,
            date: (0, dropRight_1.default)(weekDates, numberOfDaysToDrop),
            events: (0, flatten_1.default)((0, dropRight_1.default)(weekEvents, numberOfDaysToDrop)),
            scrollToNow: _isToday && isInitialPage && scrollToNow,
            initialTime: !_isToday && isInitialPage ? initialTime : undefined,
            scrollToFirst: !_isToday && isInitialPage && scrollToFirst,
            scrollOffset: timelineOffset,
            onChangeOffset: onTimelineOffsetChange,
            showNowIndicator: _isToday && showNowIndicator,
            numberOfDays,
            timelineLeftInset
        };
        if (renderItem) {
            return renderItem(_timelineProps, { item, index, isCurrent, isInitialPage, isToday: _isToday });
        }
        return (<>
          <Timeline_1.default {..._timelineProps}/>
          {/* NOTE: Keeping this for easy debugging */}
          {/* <Text style={{position: 'absolute'}}>{item}</Text>*/}
        </>);
    }, [events, timelineOffset, showNowIndicator, numberOfDays]);
    return (<infinite_list_1.default isHorizontal ref={listRef} data={pages} renderItem={renderPage} onPageChange={onPageChange} onReachNearEdge={onReachNearEdge} onReachNearEdgeThreshold={useTimelinePages_1.NEAR_EDGE_THRESHOLD} onScroll={onScroll} extendedState={{ todayEvents: events[date], pages }} initialOffset={initialOffset} scrollViewProps={{
            onMomentumScrollEnd
        }}/>);
};
exports.default = TimelineList;
