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
const xdate_1 = __importDefault(require("xdate"));
const infinite_list_1 = __importDefault(require("../../infinite-list"));
const week_1 = __importDefault(require("../week"));
const WeekDaysNames_1 = __importDefault(require("../../commons/WeekDaysNames"));
const Context_1 = __importDefault(require("../../expandableCalendar/Context"));
const style_1 = __importDefault(require("../style"));
const interface_1 = require("../../interface");
const componentUpdater_1 = require("../../componentUpdater");
const constants_1 = __importDefault(require("../../commons/constants"));
const commons_1 = require("../commons");
const dateutils_1 = require("../../dateutils");
const NUMBER_OF_PAGES = 50;
const DEFAULT_PAGE_HEIGHT = 48;
const WeekCalendar = (props) => {
    const { current, firstDay = 0, markedDates, allowShadow = true, hideDayNames, theme, calendarWidth, calendarHeight = DEFAULT_PAGE_HEIGHT, testID } = props;
    const context = (0, react_1.useContext)(Context_1.default);
    const { date, updateSource } = context;
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const list = (0, react_1.useRef)();
    const [items, setItems] = (0, react_1.useState)(getDatesArray(current || date, firstDay, NUMBER_OF_PAGES));
    const extraData = {
        current,
        date: context.date,
        firstDay
    };
    const containerWidth = calendarWidth || constants_1.default.screenWidth;
    const weekStyle = (0, react_1.useMemo)(() => {
        return [{ width: containerWidth }, props.style];
    }, [containerWidth, props.style]);
    (0, react_1.useEffect)(() => {
        if (updateSource !== commons_1.UpdateSources.WEEK_SCROLL) {
            const pageIndex = items.findIndex(item => (0, dateutils_1.sameWeek)(item, date, firstDay));
            // @ts-expect-error
            list.current?.scrollToOffset?.(pageIndex * containerWidth, 0, false);
        }
    }, [date]);
    const onDayPress = (0, react_1.useCallback)((dateData) => {
        context.setDate?.(dateData.dateString, commons_1.UpdateSources.DAY_PRESS);
        props.onDayPress?.(dateData);
    }, [props.onDayPress]);
    const onPageChange = (0, react_1.useCallback)((pageIndex, _prevPage, { scrolledByUser }) => {
        if (scrolledByUser) {
            context?.setDate(items[pageIndex], commons_1.UpdateSources.WEEK_SCROLL);
        }
    }, [items]);
    const reloadPages = (0, react_1.useCallback)(pageIndex => {
        const date = items[pageIndex];
        setItems(getDatesArray(date, firstDay, NUMBER_OF_PAGES));
    }, [items]);
    const renderItem = (0, react_1.useCallback)((_type, item) => {
        const { allowShadow, ...calendarListProps } = props;
        const { /* style,  */ ...others } = (0, componentUpdater_1.extractCalendarProps)(calendarListProps);
        const isSameWeek = (0, dateutils_1.sameWeek)(item, date, firstDay);
        return (<week_1.default {...others} key={item} current={isSameWeek ? date : item} firstDay={firstDay} style={weekStyle} markedDates={markedDates} onDayPress={onDayPress} context={context}/>);
    }, [date, markedDates]);
    return (<react_native_1.View testID={testID} style={[allowShadow && style.current.containerShadow, !hideDayNames && style.current.containerWrapper]}>
      {!hideDayNames && (<react_native_1.View style={[style.current.week, style.current.weekCalendar]}>
          <WeekDaysNames_1.default firstDay={firstDay} style={style.current.dayHeader}/>
        </react_native_1.View>)}
      <react_native_1.View>
        <infinite_list_1.default key="week-list" isHorizontal ref={list} data={items} renderItem={renderItem} reloadPages={reloadPages} onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)} extendedState={extraData} style={style.current.container} initialPageIndex={NUMBER_OF_PAGES} pageHeight={calendarHeight} pageWidth={containerWidth} onPageChange={onPageChange} scrollViewProps={{
            showsHorizontalScrollIndicator: false
        }}/>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.default = WeekCalendar;
// function getDate({current, context, firstDay = 0}: WeekCalendarProps, weekIndex: number) {
function getDate(date, firstDay, weekIndex) {
    // const d = new XDate(current || context.date);
    const d = new xdate_1.default(date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
        dayOfTheWeek = 7 + dayOfTheWeek;
    }
    // leave the current date in the visible week as is
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    const newDate = dd.addWeeks(weekIndex);
    return (0, interface_1.toMarkingFormat)(newDate);
}
// function getDatesArray(args: WeekCalendarProps, numberOfPages = NUMBER_OF_PAGES) => {
function getDatesArray(date, firstDay, numberOfPages = NUMBER_OF_PAGES) {
    const array = [];
    for (let index = -numberOfPages; index <= numberOfPages; index++) {
        const d = getDate(date, firstDay, index);
        array.push(d);
    }
    return array;
}
