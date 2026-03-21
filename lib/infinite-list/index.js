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
const inRange_1 = __importDefault(require("lodash/inRange"));
const debounce_1 = __importDefault(require("lodash/debounce"));
const noop_1 = __importDefault(require("lodash/noop"));
const react_1 = __importStar(require("react"));
const recyclerlistview_1 = require("recyclerlistview");
const constants_1 = __importDefault(require("../commons/constants"));
const hooks_1 = require("../hooks");
const dataProviderMaker = (items) => new recyclerlistview_1.DataProvider((item1, item2) => item1 !== item2).cloneWithRows(items);
const InfiniteList = (props, ref) => {
    const { isHorizontal, renderItem, data, reloadPages = noop_1.default, pageWidth = constants_1.default.screenWidth, pageHeight = constants_1.default.screenHeight, onPageChange, onReachEdge, onReachNearEdge, onReachNearEdgeThreshold, initialPageIndex = 0, initialOffset, extendedState, scrollViewProps, positionIndex = 0, disableScrollOnDataChange, onEndReachedThreshold, onVisibleIndicesChanged, layoutProvider, onScroll, onEndReached, renderFooter } = props;
    const dataProvider = (0, react_1.useMemo)(() => {
        return dataProviderMaker(data);
    }, [data]);
    const _layoutProvider = (0, react_1.useRef)(new recyclerlistview_1.LayoutProvider(() => 'page', (_type, dim) => {
        dim.width = pageWidth;
        dim.height = pageHeight;
    }));
    const shouldFixRTL = (0, react_1.useMemo)(() => {
        return isHorizontal && constants_1.default.isRTL && (constants_1.default.isRN73() || constants_1.default.isAndroid);
    }, [isHorizontal]);
    const listRef = (0, hooks_1.useCombinedRefs)(ref);
    const pageIndex = (0, react_1.useRef)();
    const isOnEdge = (0, react_1.useRef)(false);
    const isNearEdge = (0, react_1.useRef)(false);
    const scrolledByUser = (0, react_1.useRef)(false);
    const reloadPagesDebounce = (0, react_1.useCallback)((0, debounce_1.default)(reloadPages, 500, { leading: false, trailing: true }), [reloadPages]);
    (0, react_1.useEffect)(() => {
        if (disableScrollOnDataChange) {
            return;
        }
        setTimeout(() => {
            const x = isHorizontal ? shouldFixRTL ? Math.floor(data.length / 2) + 1 : Math.floor(data.length / 2) * pageWidth : 0;
            const y = isHorizontal ? 0 : positionIndex * pageHeight;
            // @ts-expect-error
            listRef.current?.scrollToOffset?.(x, y, false);
        }, 0);
    }, [data, disableScrollOnDataChange, isHorizontal]);
    const _onScroll = (0, react_1.useCallback)((event, offsetX, offsetY) => {
        reloadPagesDebounce?.cancel();
        const contentOffset = event.nativeEvent.contentOffset;
        const y = contentOffset.y;
        const x = shouldFixRTL ? (pageWidth * data.length - contentOffset.x) : contentOffset.x;
        const newPageIndex = Math.round(isHorizontal ? x / pageWidth : y / pageHeight);
        if (pageIndex.current !== newPageIndex) {
            if (pageIndex.current !== undefined) {
                onPageChange?.(newPageIndex, pageIndex.current, { scrolledByUser: scrolledByUser.current });
                scrolledByUser.current = false;
                isOnEdge.current = false;
                isNearEdge.current = false;
                if (newPageIndex === 0 || newPageIndex === data.length - 1) {
                    isOnEdge.current = true;
                }
                else if (onReachNearEdgeThreshold &&
                    !(0, inRange_1.default)(newPageIndex, onReachNearEdgeThreshold, data.length - onReachNearEdgeThreshold)) {
                    isNearEdge.current = true;
                }
            }
            if (isHorizontal && constants_1.default.isAndroid) {
                // NOTE: this is done only to handle 'onMomentumScrollEnd' not being called on Android
                setTimeout(() => {
                    onMomentumScrollEnd(event);
                }, 100);
            }
            pageIndex.current = newPageIndex;
        }
        onScroll?.(event, offsetX, offsetY);
    }, [onScroll, onPageChange, data.length, reloadPagesDebounce, isHorizontal, shouldFixRTL]);
    const onMomentumScrollEnd = (0, react_1.useCallback)(event => {
        if (pageIndex.current) {
            if (isOnEdge.current) {
                onReachEdge?.(pageIndex.current);
                reloadPagesDebounce?.(pageIndex.current);
            }
            else if (isNearEdge.current) {
                reloadPagesDebounce?.(pageIndex.current);
                onReachNearEdge?.(pageIndex.current);
            }
            scrollViewProps?.onMomentumScrollEnd?.(event);
        }
    }, [scrollViewProps?.onMomentumScrollEnd, onReachEdge, onReachNearEdge, reloadPagesDebounce]);
    const onScrollBeginDrag = (0, react_1.useCallback)(() => {
        scrolledByUser.current = true;
    }, []);
    const scrollViewPropsMemo = (0, react_1.useMemo)(() => {
        return {
            pagingEnabled: isHorizontal,
            bounces: false,
            ...scrollViewProps,
            onScrollBeginDrag,
            onMomentumScrollEnd
        };
    }, [onScrollBeginDrag, onMomentumScrollEnd, scrollViewProps, isHorizontal]);
    const style = (0, react_1.useMemo)(() => {
        return { height: pageHeight };
    }, [pageHeight]);
    return (<recyclerlistview_1.RecyclerListView 
    // @ts-expect-error
    ref={listRef} isHorizontal={isHorizontal} rowRenderer={renderItem} dataProvider={dataProvider} layoutProvider={layoutProvider ?? _layoutProvider.current} extendedState={extendedState} initialRenderIndex={initialOffset ? undefined : initialPageIndex} initialOffset={initialOffset} renderAheadOffset={5 * pageWidth} onScroll={_onScroll} style={style} scrollViewProps={scrollViewPropsMemo} onEndReached={onEndReached} onEndReachedThreshold={onEndReachedThreshold} onVisibleIndicesChanged={onVisibleIndicesChanged} renderFooter={renderFooter}/>);
};
exports.default = (0, react_1.forwardRef)(InfiniteList);
