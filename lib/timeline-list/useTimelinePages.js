"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_PAGE = exports.NEAR_EDGE_THRESHOLD = exports.PAGES_COUNT = void 0;
const react_1 = require("react");
const inRange_1 = __importDefault(require("lodash/inRange"));
const times_1 = __importDefault(require("lodash/times"));
const debounce_1 = __importDefault(require("lodash/debounce"));
const constants_1 = __importDefault(require("../commons/constants"));
const dateutils_1 = require("../dateutils");
exports.PAGES_COUNT = 100;
exports.NEAR_EDGE_THRESHOLD = 10;
exports.INITIAL_PAGE = Math.floor(exports.PAGES_COUNT / 2);
const UseTimelinePages = ({ date, listRef, numberOfDays, shouldFixRTL }) => {
    const pagesRef = (0, react_1.useRef)((0, times_1.default)(exports.PAGES_COUNT, i => {
        return (0, dateutils_1.generateDay)(date, numberOfDays * (i - Math.floor(exports.PAGES_COUNT / 2)));
    }));
    const [pages, setPages] = (0, react_1.useState)(pagesRef.current);
    const shouldResetPages = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        const updatedDays = (0, times_1.default)(exports.PAGES_COUNT, i => {
            return (0, dateutils_1.generateDay)(date, numberOfDays * (i - Math.floor(exports.PAGES_COUNT / 2)));
        });
        pagesRef.current = updatedDays;
        setPages(updatedDays);
    }, [numberOfDays]);
    const isOutOfRange = (0, react_1.useCallback)((index) => {
        return !(0, inRange_1.default)(index, 0, exports.PAGES_COUNT);
    }, []);
    const isNearEdges = (0, react_1.useCallback)(index => {
        return !(0, inRange_1.default)(index, exports.NEAR_EDGE_THRESHOLD, exports.PAGES_COUNT - exports.NEAR_EDGE_THRESHOLD);
    }, []);
    const isOnEdgePages = (0, react_1.useCallback)(index => {
        return !(0, inRange_1.default)(index, 1, exports.PAGES_COUNT - 1);
    }, []);
    const scrollToPage = (pageIndex) => {
        listRef.current?.scrollToOffset(shouldFixRTL ? ((exports.PAGES_COUNT - 1 - pageIndex) * constants_1.default.screenWidth) : (pageIndex * constants_1.default.screenWidth), 0, false);
    };
    const resetPages = (date) => {
        pagesRef.current = (0, times_1.default)(exports.PAGES_COUNT, i => {
            return (0, dateutils_1.generateDay)(date, numberOfDays * (i - Math.floor(exports.PAGES_COUNT / 2)));
        });
        setPages(pagesRef.current);
        setTimeout(() => {
            scrollToPage(exports.INITIAL_PAGE);
            shouldResetPages.current = false;
        }, 0);
    };
    return {
        resetPages: (0, react_1.useCallback)(resetPages, []),
        resetPagesDebounce: (0, react_1.useCallback)((0, debounce_1.default)(resetPages, 500, { leading: false, trailing: true }), []),
        scrollToPage: (0, react_1.useCallback)(scrollToPage, []),
        scrollToPageDebounce: (0, react_1.useCallback)((0, debounce_1.default)(scrollToPage, 250, { leading: false, trailing: true }), []),
        pagesRef,
        pages,
        shouldResetPages,
        isOutOfRange,
        isNearEdges,
        isOnEdgePages
    };
};
exports.default = UseTimelinePages;
