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
const includes_1 = __importDefault(require("lodash/includes"));
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const dateutils_1 = require("../../dateutils");
const style_1 = __importDefault(require("./style"));
const accessibilityActions = [
    { name: 'increment', label: 'increment' },
    { name: 'decrement', label: 'decrement' }
];
const CalendarHeader = (0, react_1.forwardRef)((props, ref) => {
    const { theme, style: propsStyle, addMonth: propsAddMonth, month, monthFormat = 'MMMM yyyy', firstDay, hideDayNames, showWeekNumbers, hideArrows, renderArrow, onPressArrowLeft, onPressArrowRight, arrowsHitSlop = 20, disableArrowLeft, disableArrowRight, disabledDaysIndexes, displayLoadingIndicator, customHeaderTitle, renderHeader, webAriaLevel = 1, testID, accessibilityElementsHidden, importantForAccessibility, numberOfDays, current = '', timelineLeftInset, onHeaderLayout } = props;
    const numberOfDaysCondition = (0, react_1.useMemo)(() => {
        return numberOfDays && numberOfDays > 1;
    }, [numberOfDays]);
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const headerStyle = (0, react_1.useMemo)(() => {
        return [style.current.header, numberOfDaysCondition ? style.current.partialHeader : undefined];
    }, [numberOfDaysCondition]);
    const partialWeekStyle = (0, react_1.useMemo)(() => {
        return [style.current.partialWeek, { paddingLeft: timelineLeftInset }];
    }, [timelineLeftInset]);
    const dayNamesStyle = (0, react_1.useMemo)(() => {
        return [style.current.week, numberOfDaysCondition ? partialWeekStyle : undefined];
    }, [numberOfDaysCondition, partialWeekStyle]);
    const hitSlop = (0, react_1.useMemo)(() => typeof arrowsHitSlop === 'number'
        ? { top: arrowsHitSlop, left: arrowsHitSlop, bottom: arrowsHitSlop, right: arrowsHitSlop }
        : arrowsHitSlop, [arrowsHitSlop]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        onPressLeft,
        onPressRight
    }));
    const addMonth = (0, react_1.useCallback)(() => {
        propsAddMonth?.(1);
    }, [propsAddMonth]);
    const subtractMonth = (0, react_1.useCallback)(() => {
        propsAddMonth?.(-1);
    }, [propsAddMonth]);
    const onPressLeft = (0, react_1.useCallback)(() => {
        if (typeof onPressArrowLeft === 'function') {
            return onPressArrowLeft(subtractMonth, month);
        }
        return subtractMonth();
    }, [onPressArrowLeft, subtractMonth, month]);
    const onPressRight = (0, react_1.useCallback)(() => {
        if (typeof onPressArrowRight === 'function') {
            return onPressArrowRight(addMonth, month);
        }
        return addMonth();
    }, [onPressArrowRight, addMonth, month]);
    const onAccessibilityAction = (0, react_1.useCallback)((event) => {
        switch (event.nativeEvent.actionName) {
            case 'decrement':
                onPressLeft();
                break;
            case 'increment':
                onPressRight();
                break;
            default:
                break;
        }
    }, [onPressLeft, onPressRight]);
    const renderWeekDays = (0, react_1.useMemo)(() => {
        const dayOfTheWeek = new xdate_1.default(current).getDay();
        const weekDaysNames = numberOfDaysCondition ? (0, dateutils_1.weekDayNames)(dayOfTheWeek) : (0, dateutils_1.weekDayNames)(firstDay);
        const dayNames = numberOfDaysCondition ? weekDaysNames.slice(0, numberOfDays) : weekDaysNames;
        return dayNames.map((day, index) => {
            const dayStyle = [style.current.dayHeader];
            if ((0, includes_1.default)(disabledDaysIndexes, index)) {
                dayStyle.push(style.current.disabledDayHeader);
            }
            const dayTextAtIndex = `dayTextAtIndex${index}`;
            if (style.current[dayTextAtIndex]) {
                dayStyle.push(style.current[dayTextAtIndex]);
            }
            return (<react_native_1.Text allowFontScaling={false} key={index} style={dayStyle} numberOfLines={1} accessibilityLabel={''} testID={`${testID}.dayName_${day}`}>
          {day}
        </react_native_1.Text>);
        });
    }, [firstDay, current, numberOfDaysCondition, numberOfDays, disabledDaysIndexes]);
    const _renderHeader = () => {
        const webProps = react_native_1.Platform.OS === 'web' ? { 'aria-level': webAriaLevel } : {};
        if (renderHeader) {
            return renderHeader(month, { testID });
        }
        if (customHeaderTitle) {
            return customHeaderTitle;
        }
        return (<react_1.Fragment>
        <react_native_1.Text allowFontScaling={false} style={style.current.monthText} testID={`${testID}.title`} {...webProps}>
          {(0, dateutils_1.formatNumbers)(month?.toString(monthFormat))}
        </react_native_1.Text>
      </react_1.Fragment>);
    };
    const _renderArrow = (direction) => {
        if (hideArrows) {
            return <react_native_1.View />;
        }
        const isLeft = direction === 'left';
        const arrowDirection = isLeft ? 'left' : 'right';
        const arrowId = `${arrowDirection}Arrow`;
        const shouldDisable = isLeft ? disableArrowLeft : disableArrowRight;
        const onPress = !shouldDisable ? isLeft ? onPressLeft : onPressRight : undefined;
        const imageSource = isLeft ? require('../img/previous.png') : require('../img/next.png');
        return (<react_native_1.TouchableOpacity onPress={onPress} disabled={shouldDisable} style={style.current.arrow} hitSlop={hitSlop} testID={`${testID}.${arrowId}`} importantForAccessibility={'no-hide-descendants'}>
        {renderArrow ? renderArrow(arrowDirection) : <react_native_1.Image source={imageSource} style={shouldDisable ? style.current.disabledArrowImage : style.current.arrowImage}/>}
      </react_native_1.TouchableOpacity>);
    };
    const renderIndicator = () => {
        if (displayLoadingIndicator) {
            return (<react_native_1.ActivityIndicator color={theme?.indicatorColor} testID={`${testID}.loader`}/>);
        }
    };
    const renderWeekNumbersSpace = () => {
        return showWeekNumbers && <react_native_1.View style={style.current.dayHeader}/>;
    };
    const renderDayNames = () => {
        if (!hideDayNames) {
            return (<react_native_1.View style={dayNamesStyle} testID={`${testID}.dayNames`} importantForAccessibility={'no-hide-descendants'}>
          {renderWeekNumbersSpace()}
          {renderWeekDays}
        </react_native_1.View>);
        }
    };
    return (<react_native_1.View testID={testID} style={propsStyle} accessible accessibilityRole={'adjustable'} accessibilityActions={accessibilityActions} onAccessibilityAction={onAccessibilityAction} accessibilityElementsHidden={accessibilityElementsHidden} // iOS
     importantForAccessibility={importantForAccessibility} // Android
     onLayout={onHeaderLayout}>
      <react_native_1.View style={headerStyle}>
        {_renderArrow('left')}
        <react_native_1.View style={style.current.headerContainer} importantForAccessibility={'no-hide-descendants'}>
          {_renderHeader()}
          {renderIndicator()}
        </react_native_1.View>
        {_renderArrow('right')}
      </react_native_1.View>
      {renderDayNames()}
    </react_native_1.View>);
});
exports.default = CalendarHeader;
CalendarHeader.displayName = 'CalendarHeader';
CalendarHeader.defaultProps = {
    monthFormat: 'MMMM yyyy',
    webAriaLevel: 1,
    arrowsHitSlop: 20
};
