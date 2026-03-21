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
const get_1 = __importDefault(require("lodash/get"));
const map_1 = __importDefault(require("lodash/map"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const debounce_1 = __importDefault(require("lodash/debounce"));
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const hooks_1 = require("../../hooks");
const momentResolver_1 = require("../../momentResolver");
const dateutils_1 = require("../../dateutils");
const interface_1 = require("../../interface");
const services_1 = require("../../services");
const commons_1 = require("../commons");
const constants_1 = __importDefault(require("../../commons/constants"));
const style_1 = __importDefault(require("../style"));
const Context_1 = __importDefault(require("../Context"));
const infiniteAgendaList_1 = __importDefault(require("./infiniteAgendaList"));
const commons_2 = require("./commons");
const viewabilityConfig = {
    itemVisiblePercentThreshold: 20 // 50 means if 50% of the item is visible
};
/**
 * @description: AgendaList component
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: SectionList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const AgendaList = (0, react_1.forwardRef)((props, ref) => {
    const { theme, sections, scrollToNextEvent, viewOffset = 0, avoidDateUpdates, onScroll, onMomentumScrollBegin, onMomentumScrollEnd, onScrollToIndexFailed, renderSectionHeader, sectionStyle, keyExtractor, dayFormatter, dayFormat = 'dddd, MMM d', useMoment, markToday = true, onViewableItemsChanged } = props;
    const { date, updateSource, setDate, setDisabled } = (0, react_1.useContext)(Context_1.default);
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const list = (0, hooks_1.useCombinedRefs)(ref);
    const _topSection = (0, react_1.useRef)(sections[0]?.title);
    const didScroll = (0, react_1.useRef)(false);
    const sectionScroll = (0, react_1.useRef)(false);
    const sectionHeight = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        if (date !== _topSection.current) {
            setTimeout(() => {
                scrollToSection(date);
            }, 500);
        }
    }, []);
    (0, hooks_1.useDidUpdate)(() => {
        // NOTE: on first init data should set first section to the current date!!!
        if (updateSource !== commons_1.UpdateSources.LIST_DRAG && updateSource !== commons_1.UpdateSources.CALENDAR_INIT) {
            scrollToSection(date);
        }
    }, [date]);
    const getSectionIndex = (date) => {
        let i;
        (0, map_1.default)(sections, (section, index) => {
            // NOTE: sections titles should match current date format!!!
            if (section.title === date) {
                i = index;
            }
        });
        return i;
    };
    const getNextSectionIndex = (date) => {
        let i = 0;
        for (let j = 1; j < sections.length; j++) {
            const prev = (0, interface_1.parseDate)(sections[j - 1]?.title);
            const next = (0, interface_1.parseDate)(sections[j]?.title);
            const cur = new xdate_1.default(date);
            if ((0, dateutils_1.isGTE)(cur, prev) && (0, dateutils_1.isGTE)(next, cur)) {
                i = (0, dateutils_1.sameDate)(prev, cur) ? j - 1 : j;
                break;
            }
            else if ((0, dateutils_1.isGTE)(cur, next)) {
                i = j;
            }
        }
        return i;
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
    const scrollToSection = (0, react_1.useCallback)((0, debounce_1.default)((d) => {
        const sectionIndex = scrollToNextEvent ? getNextSectionIndex(d) : getSectionIndex(d);
        if ((0, isUndefined_1.default)(sectionIndex)) {
            return;
        }
        if (list?.current && sectionIndex !== undefined) {
            sectionScroll.current = true; // to avoid setDate() in onViewableItemsChanged
            _topSection.current = sections[sectionIndex]?.title;
            // @ts-expect-error should be fixed when we fix the typings of the ref.
            list?.current.scrollToLocation({
                animated: true,
                sectionIndex: sectionIndex,
                itemIndex: 1,
                viewPosition: 0,
                viewOffset: (constants_1.default.isAndroid ? sectionHeight.current : 0) + viewOffset
            });
        }
    }, 1000, { leading: true, trailing: true }), [viewOffset, sections]);
    const _onViewableItemsChanged = (0, react_1.useCallback)((info) => {
        if (info?.viewableItems && !sectionScroll.current) {
            const topSection = (0, get_1.default)(info?.viewableItems[0], 'section.title');
            if (topSection && topSection !== _topSection.current) {
                _topSection.current = topSection;
                if (didScroll.current && !avoidDateUpdates) {
                    // to avoid setDate() on first load (while setting the initial context.date value)
                    setDate?.(_topSection.current, commons_1.UpdateSources.LIST_DRAG);
                }
            }
        }
        onViewableItemsChanged?.(info);
    }, [avoidDateUpdates, setDate, onViewableItemsChanged]);
    const _onScroll = (0, react_1.useCallback)((event) => {
        if (!didScroll.current) {
            didScroll.current = true;
            scrollToSection.cancel();
        }
        onScroll?.(event);
    }, [onScroll]);
    const _onMomentumScrollBegin = (0, react_1.useCallback)((event) => {
        setDisabled?.(true);
        onMomentumScrollBegin?.(event);
    }, [onMomentumScrollBegin, setDisabled]);
    const _onMomentumScrollEnd = (0, react_1.useCallback)((event) => {
        // when list momentum ends AND when scrollToSection scroll ends
        sectionScroll.current = false;
        setDisabled?.(false);
        onMomentumScrollEnd?.(event);
    }, [onMomentumScrollEnd, setDisabled]);
    const headerTextStyle = (0, react_1.useMemo)(() => [style.current.sectionText, sectionStyle], [sectionStyle]);
    const _onScrollToIndexFailed = (0, react_1.useCallback)((info) => {
        if (onScrollToIndexFailed) {
            onScrollToIndexFailed(info);
        }
        else {
            console.log('onScrollToIndexFailed info: ', info);
        }
    }, [onScrollToIndexFailed]);
    const onHeaderLayout = (0, react_1.useCallback)((event) => {
        sectionHeight.current = event.nativeEvent.layout.height;
    }, []);
    const _renderSectionHeader = (0, react_1.useCallback)((info) => {
        const title = info?.section?.title;
        if (renderSectionHeader) {
            return renderSectionHeader(title);
        }
        const headerTitle = getSectionTitle(title);
        return <commons_2.AgendaSectionHeader title={headerTitle} style={headerTextStyle} onLayout={onHeaderLayout}/>;
    }, [headerTextStyle]);
    const _keyExtractor = (0, react_1.useCallback)((item, index) => {
        return (0, isFunction_1.default)(keyExtractor) ? keyExtractor(item, index) : String(index);
    }, [keyExtractor]);
    if (props.infiniteListProps) {
        return <infiniteAgendaList_1.default {...props}/>;
    }
    return (<react_native_1.SectionList stickySectionHeadersEnabled {...props} 
    // @ts-expect-error
    ref={list} keyExtractor={_keyExtractor} showsVerticalScrollIndicator={false} onViewableItemsChanged={_onViewableItemsChanged} viewabilityConfig={viewabilityConfig} renderSectionHeader={_renderSectionHeader} onScroll={_onScroll} onMomentumScrollBegin={_onMomentumScrollBegin} onMomentumScrollEnd={_onMomentumScrollEnd} onScrollToIndexFailed={_onScrollToIndexFailed}/>);
    // _getItemLayout = (data, index) => {
    //   return {length: constants.screenWidth, offset: constants.screenWidth * index, index};
    // }
});
exports.default = AgendaList;
AgendaList.displayName = 'AgendaList';
AgendaList.propTypes = {
    dayFormat: prop_types_1.default.string,
    dayFormatter: prop_types_1.default.func,
    useMoment: prop_types_1.default.bool,
    markToday: prop_types_1.default.bool,
    // @ts-expect-error TODO Figure out why forwardRef causes error about the number type
    sectionStyle: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.number, prop_types_1.default.array]),
    avoidDateUpdates: prop_types_1.default.bool
};
