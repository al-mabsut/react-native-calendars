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
const interface_1 = require("../../../interface");
const marking_1 = __importDefault(require("../marking"));
const style_1 = __importDefault(require("./style"));
const BasicDay = (props) => {
    const { theme, date, onPress, onLongPress, markingType, marking, state, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays, accessibilityLabel, children, testID } = props;
    const dateData = date ? (0, interface_1.xdateToData)(date) : undefined;
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const _marking = marking || {};
    const isSelected = _marking.selected || state === 'selected';
    const isDisabled = typeof _marking.disabled !== 'undefined' ? _marking.disabled : state === 'disabled';
    const isInactive = typeof marking?.inactive !== 'undefined' ? marking.inactive : state === 'inactive';
    const isToday = typeof marking?.today !== 'undefined' ? marking.today : state === 'today';
    const isMultiDot = markingType === marking_1.default.markings.MULTI_DOT;
    const isMultiPeriod = markingType === marking_1.default.markings.MULTI_PERIOD;
    const isCustom = markingType === marking_1.default.markings.CUSTOM;
    const shouldDisableTouchEvent = () => {
        const { disableTouchEvent } = _marking;
        let disableTouch = false;
        if (typeof disableTouchEvent === 'boolean') {
            disableTouch = disableTouchEvent;
        }
        else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
            disableTouch = disableAllTouchEventsForDisabledDays;
        }
        else if (typeof disableAllTouchEventsForInactiveDays === 'boolean' && isInactive) {
            disableTouch = disableAllTouchEventsForInactiveDays;
        }
        return disableTouch;
    };
    const getContainerStyle = () => {
        const { customStyles, selectedColor } = _marking;
        const styles = [style.current.base];
        if (isSelected) {
            styles.push(style.current.selected);
            if (selectedColor) {
                styles.push({ backgroundColor: selectedColor });
            }
        }
        else if (isToday) {
            styles.push(style.current.today);
        }
        //Custom marking type
        if (isCustom && customStyles && customStyles.container) {
            if (customStyles.container.borderRadius === undefined) {
                customStyles.container.borderRadius = 16;
            }
            styles.push(customStyles.container);
        }
        return styles;
    };
    const getTextStyle = () => {
        const { customStyles, selectedTextColor } = _marking;
        const styles = [style.current.text];
        if (isSelected) {
            styles.push(style.current.selectedText);
            if (selectedTextColor) {
                styles.push({ color: selectedTextColor });
            }
        }
        else if (isDisabled) {
            styles.push(style.current.disabledText);
        }
        else if (isToday) {
            styles.push(style.current.todayText);
        }
        else if (isInactive) {
            styles.push(style.current.inactiveText);
        }
        // Custom marking type
        if (isCustom && customStyles && customStyles.text) {
            styles.push(customStyles.text);
        }
        return styles;
    };
    const _onPress = (0, react_1.useCallback)(() => {
        onPress?.(dateData);
    }, [onPress, date]);
    const _onLongPress = (0, react_1.useCallback)(() => {
        onLongPress?.(dateData);
    }, [onLongPress, date]);
    const renderMarking = () => {
        const { marked, dotColor, dots, periods } = _marking;
        return (<marking_1.default type={markingType} theme={theme} marked={isMultiDot ? true : marked} selected={isSelected} disabled={isDisabled} inactive={isInactive} today={isToday} dotColor={dotColor} dots={dots} periods={periods}/>);
    };
    const renderText = () => {
        return (<react_native_1.Text allowFontScaling={false} style={getTextStyle()} testID={`${testID}.text`}>
        {String(children)}
      </react_native_1.Text>);
    };
    const renderContent = () => {
        return (<react_1.Fragment>
        {renderText()}
        {renderMarking()}
      </react_1.Fragment>);
    };
    const renderContainer = () => {
        const { activeOpacity } = _marking;
        return (<react_native_1.TouchableOpacity testID={testID} style={getContainerStyle()} activeOpacity={activeOpacity} disabled={shouldDisableTouchEvent()} onPress={!shouldDisableTouchEvent() ? _onPress : undefined} onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined} accessible accessibilityRole={isDisabled ? undefined : 'button'} accessibilityLabel={accessibilityLabel}>
        {isMultiPeriod ? renderText() : renderContent()}
      </react_native_1.TouchableOpacity>);
    };
    const renderPeriodsContainer = () => {
        return (<react_native_1.View style={style.current.container}>
        {renderContainer()}
        {renderMarking()}
      </react_native_1.View>);
    };
    return isMultiPeriod ? renderPeriodsContainer() : renderContainer();
};
exports.default = BasicDay;
BasicDay.displayName = 'BasicDay';
