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
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const debounce_1 = __importDefault(require("lodash/debounce"));
const infinite_list_1 = __importDefault(require("../../infinite-list"));
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const hooks_1 = require("../../hooks");
const momentResolver_1 = require("../../momentResolver");
const dateutils_1 = require("../../dateutils");
const services_1 = require("../../services");
const commons_1 = require("../commons");
const style_1 = __importDefault(require("../style"));
const Context_1 = __importDefault(require("../Context"));
const constants_1 = __importDefault(require("../../commons/constants"));
const interface_1 = require("../../interface");
const LayoutProvider_1 = require("recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider");
const commons_2 = require("./commons");
/**
 * @description: AgendaList component that use InfiniteList to improve performance
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: InfiniteList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const InfiniteAgendaList = ({ theme, sections, scrollToNextEvent, avoidDateUpdates, onScroll, renderSectionHeader, sectionStyle, dayFormatter, dayFormat = 'dddd, MMM d', useMoment, markToday = true, infiniteListProps, renderItem, onEndReached, onEndReachedThreshold, ...others }) => {
    const { date, updateSource, setDate } = (0, react_1.useContext)(Context_1.default);
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const list = (0, react_1.useRef)();
    const _topSection = (0, react_1.useRef)(sections[0]?.title);
    const didScroll = (0, react_1.useRef)(false);
    const sectionScroll = (0, react_1.useRef)(false);
    const [data, setData] = (0, react_1.useState)([]);
    const dataRef = (0, react_1.useRef)(data);
    (0, react_1.useEffect)(() => {
        const items = sections.reduce((acc, cur) => {
            return [...acc, { title: cur.title, isTitle: true }, ...cur.data];
        }, []);
        setData(items);
        dataRef.current = items;
        if (date !== _topSection.current) {
            setTimeout(() => {
                scrollToSection(date);
            }, 500);
        }
    }, [sections]);
    (0, hooks_1.useDidUpdate)(() => {
        // NOTE: on first init data should set first section to the current date!!!
        if (updateSource !== commons_1.UpdateSources.LIST_DRAG && updateSource !== commons_1.UpdateSources.CALENDAR_INIT) {
            scrollToSection(date);
        }
    }, [date]);
    const getSectionIndex = (date) => {
        let dataIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].title === date) {
                return dataIndex;
            }
            dataIndex += sections[i].data.length + 1;
        }
    };
    const getNextSectionIndex = (date) => {
        const cur = new xdate_1.default(date);
        let dataIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            const titleDate = (0, interface_1.parseDate)(sections[i].title);
            if ((0, dateutils_1.isGTE)(titleDate, cur)) {
                return dataIndex;
            }
            dataIndex += sections[i].data.length + 1;
        }
    };
    const getSectionTitle = (0, react_1.useCallback)((title) => {
        if (!title)
            return;
        let sectionTitle = title;
        if (dayFormatter) {
            sectionTitle = dayFormatter(title);
        }
        else if (dayFormat) {
            if (useMoment) {
                const moment = (0, momentResolver_1.getMoment)();
                sectionTitle = moment(title).format(dayFormat);
            }
            else {
                sectionTitle = new xdate_1.default(title).toString(dayFormat);
            }
        }
        if (markToday) {
            const string = (0, services_1.getDefaultLocale)().today || commons_1.todayString;
            const today = (0, dateutils_1.isToday)(title);
            sectionTitle = today ? `${string}, ${sectionTitle}` : sectionTitle;
        }
        return sectionTitle;
    }, []);
    const scrollToSection = (0, react_1.useCallback)((0, debounce_1.default)((requestedDate) => {
        const sectionIndex = scrollToNextEvent ? getNextSectionIndex(requestedDate) : getSectionIndex(requestedDate);
        if ((0, isUndefined_1.default)(sectionIndex)) {
            return;
        }
        if (list?.current && sectionIndex !== undefined) {
            sectionScroll.current = true; // to avoid setDate() in _onVisibleIndicesChanged
            if (requestedDate !== _topSection.current) {
                _topSection.current = sections[findItemTitleIndex(sectionIndex)]?.title;
                list.current?.scrollToIndex(sectionIndex, true);
            }
            setTimeout(() => {
                _onMomentumScrollEnd(); // the RecyclerListView doesn't trigger onMomentumScrollEnd when calling scrollToSection
            }, 500);
        }
    }, 1000, { leading: true, trailing: true }), [sections]);
    const layoutProvider = (0, react_1.useMemo)(() => new LayoutProvider_1.LayoutProvider((index) => dataRef.current[index]?.isTitle ? 'title' : dataRef.current[index]?.itemCustomHeightType ?? 'page', (type, dim) => {
        dim.width = constants_1.default.screenWidth;
        switch (type) {
            case 'title':
                dim.height = infiniteListProps?.titleHeight ?? 60;
                break;
            case 'page':
                dim.height = infiniteListProps?.itemHeight ?? 80;
                break;
            default:
                dim.height = infiniteListProps?.itemHeightByType?.[type] ?? infiniteListProps?.itemHeight ?? 80;
        }
    }), []);
    const _onScroll = (0, react_1.useCallback)((rawEvent) => {
        if (!didScroll.current) {
            didScroll.current = true;
            scrollToSection.cancel();
        }
        // Convert to a format similar to NativeSyntheticEvent<NativeScrollEvent>
        const event = {
            nativeEvent: {
                contentOffset: rawEvent.nativeEvent.contentOffset,
                layoutMeasurement: rawEvent.nativeEvent.layoutMeasurement,
                contentSize: rawEvent.nativeEvent.contentSize
            }
        };
        onScroll?.(event);
    }, [onScroll]);
    const _onVisibleIndicesChanged = (0, react_1.useCallback)((all) => {
        if (all && all.length && !sectionScroll.current) {
            const topItemIndex = all[0];
            const topSection = data[findItemTitleIndex(topItemIndex)];
            if (topSection && topSection !== _topSection.current) {
                _topSection.current = topSection.title;
                if (didScroll.current && !avoidDateUpdates) {
                    // to avoid setDate() on first load (while setting the initial context.date value)
                    setDate?.(topSection.title, commons_1.UpdateSources.LIST_DRAG);
                }
            }
        }
    }, [avoidDateUpdates, setDate, data]);
    const findItemTitleIndex = (0, react_1.useCallback)((itemIndex) => {
        let titleIndex = itemIndex;
        while (titleIndex > 0 && !data[titleIndex]?.isTitle) {
            titleIndex--;
        }
        return titleIndex;
    }, [data]);
    const _onMomentumScrollEnd = (0, react_1.useCallback)(() => {
        sectionScroll.current = false;
    }, []);
    const headerTextStyle = (0, react_1.useMemo)(() => [style.current.sectionText, sectionStyle], [sectionStyle]);
    const _renderSectionHeader = (0, react_1.useCallback)((info) => {
        const title = info?.section?.title;
        if (renderSectionHeader) {
            return renderSectionHeader(title);
        }
        const headerTitle = getSectionTitle(title);
        return <commons_2.AgendaSectionHeader title={headerTitle} style={headerTextStyle}/>;
    }, [headerTextStyle]);
    const _renderItem = (0, react_1.useCallback)((_type, item) => {
        if (item?.isTitle) {
            return _renderSectionHeader({ section: item });
        }
        if (renderItem) {
            return renderItem({ item });
        }
        return <></>;
    }, [renderItem]);
    const _onEndReached = (0, react_1.useCallback)(() => {
        if (onEndReached) {
            onEndReached({ distanceFromEnd: 0 }); // The RecyclerListView doesn't provide the distanceFromEnd, so we just pass 0
        }
    }, [onEndReached]);
    return (<infinite_list_1.default ref={list} renderItem={_renderItem} data={data} style={style.current.container} layoutProvider={layoutProvider} onScroll={_onScroll} onVisibleIndicesChanged={_onVisibleIndicesChanged} scrollViewProps={{ nestedScrollEnabled: true, ...others, onMomentumScrollEnd: _onMomentumScrollEnd }} onEndReached={_onEndReached} onEndReachedThreshold={onEndReachedThreshold} disableScrollOnDataChange renderFooter={infiniteListProps?.renderFooter}/>);
};
exports.default = InfiniteAgendaList;
InfiniteAgendaList.displayName = 'InfiniteAgendaList';
InfiniteAgendaList.propTypes = {
    dayFormat: prop_types_1.default.string,
    dayFormatter: prop_types_1.default.func,
    useMoment: prop_types_1.default.bool,
    markToday: prop_types_1.default.bool,
    sectionStyle: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.number, prop_types_1.default.array]),
    avoidDateUpdates: prop_types_1.default.bool
};
