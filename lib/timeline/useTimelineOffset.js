"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
exports.default = (props) => {
    const { onChangeOffset, scrollOffset, scrollViewRef } = props;
    (0, react_1.useEffect)(() => {
        // NOTE: The main reason for this feature is to sync the offset
        // between all of the timelines in the TimelineList component
        if (scrollOffset !== undefined) {
            scrollViewRef?.current?.scrollTo({
                y: scrollOffset,
                animated: false
            });
        }
    }, [scrollOffset]);
    const onScrollEndDrag = (0, react_1.useCallback)((event) => {
        const offset = event.nativeEvent.contentOffset.y;
        const velocity = event.nativeEvent.velocity?.y;
        if (velocity === 0) {
            onChangeOffset?.(offset);
        }
    }, []);
    const onMomentumScrollEnd = (0, react_1.useCallback)((event) => {
        onChangeOffset?.(event.nativeEvent.contentOffset.y);
    }, []);
    return {
        scrollEvents: {
            onScrollEndDrag,
            onMomentumScrollEnd
        }
    };
};
