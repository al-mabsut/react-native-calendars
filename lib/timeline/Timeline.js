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
const min_1 = __importDefault(require("lodash/min"));
const map_1 = __importDefault(require("lodash/map"));
const times_1 = __importDefault(require("lodash/times"));
const groupBy_1 = __importDefault(require("lodash/groupBy"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const constants_1 = __importDefault(require("../commons/constants"));
const dateutils_1 = require("../dateutils");
const services_1 = require("../services");
const style_1 = __importDefault(require("./style"));
const Packer_1 = require("./Packer");
const presenter_1 = require("./helpers/presenter");
const TimelineHours_1 = __importDefault(require("./TimelineHours"));
const EventBlock_1 = __importDefault(require("./EventBlock"));
const NowIndicator_1 = __importDefault(require("./NowIndicator"));
const useTimelineOffset_1 = __importDefault(require("./useTimelineOffset"));
const Timeline = (props) => {
    const { format24h = true, start = 0, end = 24, date = '', events, onEventPress, onBackgroundLongPress, onBackgroundLongPressOut, renderEvent, theme, scrollToFirst, scrollToNow, initialTime, showNowIndicator, scrollOffset, onChangeOffset, overlapEventsSpacing = 0, rightEdgeSpacing = 0, unavailableHours, unavailableHoursColor, eventTapped, numberOfDays = 1, timelineLeftInset = 0, testID } = props;
    const pageDates = (0, react_1.useMemo)(() => {
        return typeof date === 'string' ? [date] : date;
    }, [date]);
    const groupedEvents = (0, react_1.useMemo)(() => {
        return (0, groupBy_1.default)(events, e => (0, services_1.getCalendarDateString)(e.start));
    }, [events]);
    const pageEvents = (0, react_1.useMemo)(() => {
        return (0, map_1.default)(pageDates, d => groupedEvents[d] || []);
    }, [pageDates, groupedEvents]);
    const scrollView = (0, react_1.useRef)();
    const calendarHeight = (0, react_1.useRef)((end - start) * Packer_1.HOUR_BLOCK_HEIGHT);
    const styles = (0, react_1.useRef)((0, style_1.default)(theme || props.styles, calendarHeight.current));
    const { scrollEvents } = (0, useTimelineOffset_1.default)({ onChangeOffset, scrollOffset, scrollViewRef: scrollView });
    const width = (0, react_1.useMemo)(() => {
        return constants_1.default.screenWidth - timelineLeftInset;
    }, [timelineLeftInset]);
    const packedEvents = (0, react_1.useMemo)(() => {
        return (0, map_1.default)(pageEvents, (_e, i) => {
            return (0, Packer_1.populateEvents)(pageEvents[i], {
                screenWidth: width / numberOfDays,
                dayStart: start,
                overlapEventsSpacing: overlapEventsSpacing / numberOfDays,
                rightEdgeSpacing: rightEdgeSpacing / numberOfDays
            });
        });
    }, [pageEvents, start, numberOfDays]);
    (0, react_1.useEffect)(() => {
        let initialPosition = 0;
        if (scrollToNow) {
            initialPosition = (0, presenter_1.calcTimeOffset)(Packer_1.HOUR_BLOCK_HEIGHT);
        }
        else if (scrollToFirst && packedEvents[0].length > 0) {
            initialPosition = (0, min_1.default)((0, map_1.default)(packedEvents[0], 'top')) ?? 0;
        }
        else if (initialTime) {
            initialPosition = (0, presenter_1.calcTimeOffset)(Packer_1.HOUR_BLOCK_HEIGHT, initialTime.hour, initialTime.minutes);
        }
        if (initialPosition) {
            setTimeout(() => {
                scrollView?.current?.scrollTo({
                    y: Math.max(0, initialPosition - Packer_1.HOUR_BLOCK_HEIGHT),
                    animated: true
                });
            }, 0);
        }
    }, []);
    const _onEventPress = (0, react_1.useCallback)((dateIndex, eventIndex) => {
        const event = packedEvents[dateIndex][eventIndex];
        if (eventTapped) {
            //TODO: remove after deprecation
            eventTapped(event);
        }
        else {
            onEventPress?.(event);
        }
    }, [onEventPress, eventTapped]);
    const renderEvents = (dayIndex) => {
        const events = packedEvents[dayIndex].map((event, eventIndex) => {
            const onEventPress = () => _onEventPress(dayIndex, eventIndex);
            return (<EventBlock_1.default key={eventIndex} index={eventIndex} event={event} styles={styles.current} format24h={format24h} onPress={onEventPress} renderEvent={renderEvent} testID={`${testID}.event.${event.id}`}/>);
        });
        return (<react_native_1.View pointerEvents={'box-none'} style={[{ marginLeft: dayIndex === 0 ? timelineLeftInset : undefined }, styles.current.eventsContainer]}>
        {events}
      </react_native_1.View>);
    };
    const renderTimelineDay = (dayIndex) => {
        const indexOfToday = pageDates.indexOf((0, dateutils_1.generateDay)(new Date().toString()));
        const left = timelineLeftInset + indexOfToday * width / numberOfDays;
        return (<react_1.default.Fragment key={dayIndex}>
        {renderEvents(dayIndex)}
        {indexOfToday !== -1 && showNowIndicator && <NowIndicator_1.default width={width / numberOfDays} left={left} styles={styles.current}/>}
      </react_1.default.Fragment>);
    };
    return (<react_native_1.ScrollView 
    // @ts-expect-error
    ref={scrollView} style={styles.current.container} contentContainerStyle={[styles.current.contentStyle, { width: constants_1.default.screenWidth }]} showsVerticalScrollIndicator={false} {...scrollEvents} testID={testID}>
      <TimelineHours_1.default start={start} end={end} date={pageDates[0]} format24h={format24h} styles={styles.current} unavailableHours={unavailableHours} unavailableHoursColor={unavailableHoursColor} onBackgroundLongPress={onBackgroundLongPress} onBackgroundLongPressOut={onBackgroundLongPressOut} width={width} numberOfDays={numberOfDays} timelineLeftInset={timelineLeftInset} testID={`${testID}.hours`}/>
      {(0, times_1.default)(numberOfDays, renderTimelineDay)}
    </react_native_1.ScrollView>);
};
exports.default = react_1.default.memo(Timeline);
