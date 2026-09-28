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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const interface_1 = require("../../../interface");
const marking_1 = __importStar(require("../marking"));
const style_1 = __importDefault(require("./style"));
const yellowStripe = require('./yellowStripe.png');
const PeriodDay = (props) => {
    const { theme, date, onPress, onLongPress, marking, state, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays, accessibilityLabel, children, testID } = props;
    const dateData = date ? (0, interface_1.xdateToData)(date) : undefined;
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const isDisabled = typeof marking?.disabled !== 'undefined' ? marking.disabled : state === 'disabled';
    const isInactive = typeof marking?.inactive !== 'undefined' ? marking.inactive : state === 'inactive';
    const isToday = typeof marking?.today !== 'undefined' ? marking.today : state === 'today';
    const shouldDisableTouchEvent = (0, react_1.useCallback)(() => {
        const { disableTouchEvent } = marking || {};
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
    }, [marking, isDisabled, isInactive, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays]);
    const markingStyle = (0, react_1.useMemo)(() => {
        const defaultStyle = { textStyle: {}, containerStyle: {} };
        if (!marking) {
            return defaultStyle;
        }
        // Handle text color based on state
        if (marking.disabled) {
            defaultStyle.textStyle = { color: style.current.disabledText.color };
        }
        else if (marking.inactive) {
            defaultStyle.textStyle = { color: style.current.inactiveText.color };
        }
        else if (marking.selected) {
            defaultStyle.textStyle = { color: style.current.selectedText.color };
        }
        // Handle period styling
        if (marking.startingDay) {
            defaultStyle.startingDay = {
                backgroundColor: marking.color,
                borderColor: marking.borderColor || marking.color,
                borderWidth: marking.borderWith || 0.7,
                borderRadius: marking.borderRadius || 9
            };
        }
        if (marking.endingDay) {
            defaultStyle.endingDay = {
                backgroundColor: marking.color,
                borderColor: marking.borderColor || marking.color,
                borderWidth: marking.borderWith || 0.7,
                borderRadius: marking.borderRadius || 9
            };
        }
        if (!marking.startingDay && !marking.endingDay) {
            defaultStyle.day = {
                backgroundColor: marking.color,
                borderColor: marking.borderColor || marking.color,
                borderWidth: marking.borderWith || 0.7
            };
        }
        if (marking.textColor) {
            defaultStyle.textStyle = { color: marking.textColor };
        }
        if (marking.customTextStyle) {
            defaultStyle.textStyle = marking.customTextStyle;
        }
        if (marking.customContainerStyle) {
            defaultStyle.containerStyle = marking.customContainerStyle;
        }
        return defaultStyle;
    }, [marking, style]);
    const containerStyle = (0, react_1.useMemo)(() => {
        const containerStyle = [style.current.base];
        if (isToday) {
            containerStyle.push(style.current.today);
        }
        if (marking) {
            const baseContainerStyle = {
                borderRadius: marking.borderRadius || 17,
                overflow: 'hidden',
                paddingTop: 5
            };
            containerStyle.push(baseContainerStyle);
            // For multi-section, use transparent background to let fillers show through
            if (marking.isMultiPeriod) {
                containerStyle.push({ backgroundColor: 'transparent' });
            }
            else {
                const start = markingStyle.startingDay;
                const end = markingStyle.endingDay;
                if (start && !end) {
                    containerStyle.push({ backgroundColor: start.backgroundColor });
                }
                else if ((end && !start) || (end && start)) {
                    containerStyle.push({ backgroundColor: end.backgroundColor });
                }
            }
            if (markingStyle.containerStyle) {
                containerStyle.push(markingStyle.containerStyle);
            }
        }
        return containerStyle;
    }, [marking, markingStyle, isToday, style]);
    const textStyle = (0, react_1.useMemo)(() => {
        const textStyle = [style.current.text];
        if (isDisabled) {
            textStyle.push(style.current.disabledText);
        }
        else if (isInactive) {
            textStyle.push(style.current.inactiveText);
        }
        else if (isToday) {
            textStyle.push(style.current.todayText);
        }
        if (marking) {
            if (markingStyle.textStyle) {
                textStyle.push(markingStyle.textStyle);
            }
        }
        return textStyle;
    }, [marking, markingStyle, isDisabled, isInactive, isToday, style]);
    // Reusable function to apply border styles to any section
    const applyBorderToSection = (0, react_1.useCallback)((section, backgroundColor, borderColor, borderWidth, borderRadius, borders) => {
        if (backgroundColor) {
            section.backgroundColor = backgroundColor;
        }
        if (borderColor) {
            section.borderColor = borderColor;
        }
        // Apply border widths
        if (borders.top)
            section.borderTopWidth = borderWidth;
        if (borders.bottom)
            section.borderBottomWidth = borderWidth;
        if (borders.left)
            section.borderLeftWidth = borderWidth;
        if (borders.right)
            section.borderRightWidth = borderWidth;
        // Apply border radius
        if (borders.topLeft)
            section.borderTopLeftRadius = borderRadius;
        if (borders.bottomLeft)
            section.borderBottomLeftRadius = borderRadius;
        if (borders.topRight)
            section.borderTopRightRadius = borderRadius;
        if (borders.bottomRight)
            section.borderBottomRightRadius = borderRadius;
    }, []);
    // Helper to create a fully closed border (used for single day periods)
    const applyFullyClosedBorder = (0, react_1.useCallback)((section, backgroundColor, borderColor, borderWidth, borderRadius) => {
        applyBorderToSection(section, backgroundColor, borderColor, borderWidth, borderRadius, {
            top: true,
            bottom: true,
            left: true,
            right: true,
            topLeft: true,
            bottomLeft: true,
            topRight: true,
            bottomRight: true
        });
    }, [applyBorderToSection]);
    // Helper function to handle two-section multi-period layout
    const handleTwoSectionMultiPeriod = (0, react_1.useCallback)((leftFillerStyle, rightFillerStyle, marking, borderWidth, borderRadius) => {
        // Left Section
        if (marking.leftSectionIsSingleDay) {
            // Single-day period in left section - fully closed
            applyFullyClosedBorder(leftFillerStyle, marking.leftSectionColor, marking.leftSectionBorderColor, borderWidth, borderRadius);
        }
        else {
            // Ending period - only right border closed
            applyBorderToSection(leftFillerStyle, marking.leftSectionColor, marking.leftSectionBorderColor, borderWidth, borderRadius, { top: true, bottom: true, right: true, topRight: true, bottomRight: true });
        }
        // Right Section
        if (marking.rightSectionIsSingleDay) {
            // Single-day period in right section - fully closed
            applyFullyClosedBorder(rightFillerStyle, marking.rightSectionColor, marking.rightSectionBorderColor, borderWidth, borderRadius);
        }
        else {
            // Starting period - only left border closed
            applyBorderToSection(rightFillerStyle, marking.rightSectionColor, marking.rightSectionBorderColor, borderWidth, borderRadius, { top: true, bottom: true, left: true, topLeft: true, bottomLeft: true });
        }
    }, [applyBorderToSection, applyFullyClosedBorder]);
    // Helper function to handle three-section multi-period layout
    const handleThreeSectionMultiPeriod = (0, react_1.useCallback)((leftFillerStyle, middleFillerStyle, rightFillerStyle, marking, borderWidth, borderRadius) => {
        // Left Section (ending period) - has right border only
        applyBorderToSection(leftFillerStyle, marking.leftSectionColor, marking.leftSectionBorderColor, borderWidth, borderRadius, { top: true, bottom: true, right: true, topRight: true, bottomRight: true });
        // Middle Section (single day period) - fully closed borders
        applyFullyClosedBorder(middleFillerStyle, marking.middleSectionColor, marking.middleSectionBorderColor, borderWidth, borderRadius);
        // Right Section (starting period) - has left border only
        applyBorderToSection(rightFillerStyle, marking.rightSectionColor, marking.rightSectionBorderColor, borderWidth, borderRadius, { top: true, bottom: true, left: true, topLeft: true, bottomLeft: true });
    }, [applyBorderToSection, applyFullyClosedBorder]);
    // Helper function to handle fallback multi-period cases
    const handleFallbackMultiPeriod = (0, react_1.useCallback)((leftFillerStyle, middleFillerStyle, rightFillerStyle, marking, borderWidth, borderRadius, hasLeft, hasMiddle, hasRight) => {
        if (hasLeft) {
            if (!hasMiddle && !hasRight) {
                // Only left section - fully closed
                applyFullyClosedBorder(leftFillerStyle, marking.leftSectionColor, marking.leftSectionBorderColor, borderWidth, borderRadius);
            }
            else {
                // Has other sections - right border closed
                applyBorderToSection(leftFillerStyle, marking.leftSectionColor, marking.leftSectionBorderColor, borderWidth, borderRadius, { top: true, bottom: true, right: true, topRight: true, bottomRight: true });
            }
        }
        if (hasMiddle) {
            // Middle section is always fully closed
            applyFullyClosedBorder(middleFillerStyle, marking.middleSectionColor, marking.middleSectionBorderColor, borderWidth, borderRadius);
        }
        if (hasRight) {
            if (!hasMiddle && !hasLeft) {
                // Only right section - fully closed
                applyFullyClosedBorder(rightFillerStyle, marking.rightSectionColor, marking.rightSectionBorderColor, borderWidth, borderRadius);
            }
            else {
                // Has other sections - left border closed
                applyBorderToSection(rightFillerStyle, marking.rightSectionColor, marking.rightSectionBorderColor, borderWidth, borderRadius, { top: true, bottom: true, left: true, topLeft: true, bottomLeft: true });
            }
        }
    }, [applyBorderToSection, applyFullyClosedBorder]);
    // Helper function to handle single section period styling
    const handleSinglePeriod = (0, react_1.useCallback)((leftFillerStyle, rightFillerStyle, fillerStyle, markingStyle, borderWidth, borderRadius) => {
        const start = markingStyle.startingDay;
        const end = markingStyle.endingDay;
        if (start && !end) {
            // Starting day - left border closed, right border open
            applyBorderToSection(leftFillerStyle, start.backgroundColor, start.borderColor, borderWidth, borderRadius, {
                top: true,
                bottom: true,
                left: true,
                topLeft: true,
                bottomLeft: true
            });
            applyBorderToSection(rightFillerStyle, start.backgroundColor, start.borderColor, borderWidth, borderRadius, {
                top: true,
                bottom: true
            });
        }
        else if (end && !start) {
            // Ending day - left border open, right border closed
            applyBorderToSection(leftFillerStyle, end.backgroundColor, end.borderColor, borderWidth, borderRadius, {
                top: true,
                bottom: true
            });
            applyBorderToSection(rightFillerStyle, end.backgroundColor, end.borderColor, borderWidth, borderRadius, {
                top: true,
                bottom: true,
                right: true,
                topRight: true,
                bottomRight: true
            });
        }
        else if (start && end) {
            // Single day period - FULLY CLOSED BORDERS
            return {
                borderColor: start.borderColor || end.borderColor,
                backgroundColor: start.backgroundColor || end.backgroundColor,
                borderTopWidth: borderWidth,
                borderBottomWidth: borderWidth,
                borderLeftWidth: borderWidth,
                borderRightWidth: borderWidth,
                borderTopLeftRadius: borderRadius,
                borderBottomLeftRadius: borderRadius,
                borderTopRightRadius: borderRadius,
                borderBottomRightRadius: borderRadius
            };
        }
        else if (markingStyle.day) {
            // Middle day - no left/right borders (period continues)
            return {
                borderColor: markingStyle.day.borderColor,
                backgroundColor: markingStyle.day.backgroundColor,
                borderTopWidth: borderWidth,
                borderBottomWidth: borderWidth
            };
        }
        return fillerStyle;
    }, [applyBorderToSection]);
    const threeSectionFillerStyles = (0, react_1.useMemo)(() => {
        const leftFillerStyle = { backgroundColor: 'transparent' };
        const middleFillerStyle = { backgroundColor: 'transparent' };
        const rightFillerStyle = { backgroundColor: 'transparent' };
        let fillerStyle = {};
        if (!marking) {
            return { leftFillerStyle, middleFillerStyle, rightFillerStyle, fillerStyle };
        }
        const borderWidth = marking.borderWith || 0.7;
        const borderRadius = marking.borderRadius || 9;
        if (marking.isMultiPeriod) {
            const hasLeft = !!marking.leftSectionColor;
            const hasMiddle = !!marking.middleSectionColor;
            const hasRight = !!marking.rightSectionColor;
            if (hasLeft && hasRight && !hasMiddle) {
                // CASE 1: 2 rulings - handle edge cases for single-day periods
                handleTwoSectionMultiPeriod(leftFillerStyle, rightFillerStyle, marking, borderWidth, borderRadius);
            }
            else if (hasLeft && hasMiddle && hasRight) {
                // CASE 2: 3 rulings - ending period, single-day period, starting period
                handleThreeSectionMultiPeriod(leftFillerStyle, middleFillerStyle, rightFillerStyle, marking, borderWidth, borderRadius);
            }
            else {
                // Fallback for other multi-period cases
                handleFallbackMultiPeriod(leftFillerStyle, middleFillerStyle, rightFillerStyle, marking, borderWidth, borderRadius, hasLeft, hasMiddle, hasRight);
            }
        }
        else {
            // Handle single section (original logic)
            fillerStyle = handleSinglePeriod(leftFillerStyle, rightFillerStyle, fillerStyle, markingStyle, borderWidth, borderRadius);
        }
        return { leftFillerStyle, middleFillerStyle, rightFillerStyle, fillerStyle };
    }, [
        marking,
        markingStyle,
        handleTwoSectionMultiPeriod,
        handleThreeSectionMultiPeriod,
        handleFallbackMultiPeriod,
        handleSinglePeriod
    ]);
    const _onPress = (0, react_1.useCallback)(() => {
        onPress?.(dateData);
    }, [onPress, date]);
    const _onLongPress = (0, react_1.useCallback)(() => {
        onLongPress?.(dateData);
    }, [onLongPress, date]);
    const renderFillers = (0, react_1.useCallback)(() => {
        if (!marking)
            return null;
        if (marking.isMultiPeriod) {
            const hasLeft = !!marking.leftSectionColor;
            const hasMiddle = !!marking.middleSectionColor;
            const hasRight = !!marking.rightSectionColor;
            if (hasLeft && hasRight && !hasMiddle) {
                // 2 rulings: only render left and right sections (NO MIDDLE!)
                return (<react_native_1.View style={[style.current.fillers]}>
            <react_native_1.View style={[style.current.leftFiller, threeSectionFillerStyles.leftFillerStyle]}/>
            <react_native_1.View style={[style.current.rightFiller, threeSectionFillerStyles.rightFillerStyle]}/>
          </react_native_1.View>);
            }
            else {
                // 3 rulings: render all three sections
                return (<react_native_1.View style={[style.current.fillers]}>
            <react_native_1.View style={[style.current.leftFiller, threeSectionFillerStyles.leftFillerStyle]}/>
            <react_native_1.View style={[
                        style.current.middleFiller || style.current.leftFiller,
                        threeSectionFillerStyles.middleFillerStyle
                    ]}/>
            <react_native_1.View style={[style.current.rightFiller, threeSectionFillerStyles.rightFillerStyle]}/>
          </react_native_1.View>);
            }
        }
        else {
            // Single period: render 2-section layout (original)
            return (<react_native_1.View style={[style.current.fillers, threeSectionFillerStyles.fillerStyle]}>
          <react_native_1.View style={[style.current.leftFiller, threeSectionFillerStyles.leftFillerStyle]}/>
          <react_native_1.View style={[style.current.rightFiller, threeSectionFillerStyles.rightFillerStyle]}/>
        </react_native_1.View>);
        }
    }, [marking, threeSectionFillerStyles, style]);
    const renderMarking = (0, react_1.useCallback)(() => {
        if (!marking)
            return null;
        const { marked, dotColor } = marking;
        return (<marking_1.default type={'dot'} theme={theme} marked={marked} disabled={isDisabled} inactive={isInactive} today={isToday} dotColor={dotColor} dischargeIcon={marking?.dischargeIcon}/>);
    }, [marking, theme, isDisabled, isInactive, isToday]);
    const renderText = (0, react_1.useCallback)(() => {
        return (<react_native_1.Text allowFontScaling={false} style={textStyle}>
        {String(children)}
      </react_native_1.Text>);
    }, [textStyle, children]);
    const Component = marking ? react_native_1.TouchableWithoutFeedback : react_native_1.TouchableOpacity;
    const touchDisabled = shouldDisableTouchEvent();
    return (<Component testID={testID} disabled={touchDisabled} onPress={!touchDisabled ? _onPress : undefined} onLongPress={!touchDisabled ? _onLongPress : undefined} accessible accessibilityRole={isDisabled ? undefined : 'button'} accessibilityLabel={accessibilityLabel}>
      <react_native_1.View style={style.current.container}>
        {marking?.inProgressImagePosition && (<react_native_1.Image source={yellowStripe} style={[
                // eslint-disable-next-line react-native/no-inline-styles
                {
                    width: marking?.inProgressImagePosition === marking_1.InProgressImagePositions.full
                        ? '100%'
                        : [
                            marking_1.InProgressImagePositions.left,
                            marking_1.InProgressImagePositions.right,
                            marking_1.InProgressImagePositions.middle
                        ].includes(marking?.inProgressImagePosition)
                            ? '33%'
                            : '50%',
                    height: '100%',
                    tintColor: marking?.inProgressImageTint,
                    position: 'absolute',
                    top: marking?.borderWith || 0.7,
                    left: marking?.inProgressImagePosition === marking_1.InProgressImagePositions.right
                        ? '66%'
                        : marking?.inProgressImagePosition === marking_1.InProgressImagePositions.fullRight
                            ? '50%'
                            : 0,
                    zIndex: 1
                },
                marking?.inProgressImagePosition === marking_1.InProgressImagePositions.left
                    ? {
                        borderBottomRightRadius: marking?.borderRadius || 9,
                        borderTopRightRadius: marking?.borderRadius || 9
                    }
                    : marking?.inProgressImagePosition === marking_1.InProgressImagePositions.right
                        ? {
                            borderBottomLeftRadius: marking?.borderRadius || 9,
                            borderTopLeftRadius: marking?.borderRadius || 9
                        }
                        : {}
            ]}/>)}
        {marking?.customComponent}
        {renderFillers()}
        <react_native_1.View style={containerStyle}>      
          {marking && marking.selected ? (<react_native_1.View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
              <react_native_1.View style={{ position: 'absolute', top: -6, zIndex: 3 }}>{renderText()}</react_native_1.View>
              <react_native_1.View style={{ position: 'absolute', bottom: 2 }}>{renderMarking()}</react_native_1.View>
            </react_native_1.View>) : (<>
              {renderText()}
            </>)}
        </react_native_1.View>
      </react_native_1.View>
    </Component>);
};
exports.default = PeriodDay;
PeriodDay.displayName = 'PeriodDay';
PeriodDay.propTypes = {
    state: prop_types_1.default.oneOf(['selected', 'disabled', 'inactive', 'today', '']),
    marking: prop_types_1.default.any,
    theme: prop_types_1.default.object,
    onPress: prop_types_1.default.func,
    onLongPress: prop_types_1.default.func,
    date: prop_types_1.default.string
};
