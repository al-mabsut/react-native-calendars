import PropTypes from 'prop-types';
import React, {useCallback, useRef, useMemo} from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  ViewProps,
  TextStyle,
  StyleProp,
  ColorValue,
  Image
} from 'react-native';
import {xdateToData} from '../../../interface';
import {Theme, DayState, DateData} from '../../../types';
import Marking, {MarkingProps, InProgressImagePositions} from '../marking';
import styleConstructor from './style';
const yellowStripe = require('./yellowStripe.png');

export interface PeriodDayProps extends ViewProps {
  theme?: Theme;
  state?: DayState; // no 'selected' state
  marking?: MarkingProps;
  // markingType?: MarkingTypes; // only 'dot' is supported
  onPress?: (date?: DateData) => void;
  onLongPress?: (date?: DateData) => void;
  date?: string;
  disableAllTouchEventsForDisabledDays?: boolean;
  disableAllTouchEventsForInactiveDays?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

type MarkingStyle = {
  containerStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  startingDay?: ViewStyle;
  endingDay?: ViewStyle;
  day?: ViewStyle;
};

type ThreeSectionFillerStyles = {
  leftFillerStyle: ViewStyle;
  middleFillerStyle: ViewStyle;
  rightFillerStyle: ViewStyle;
  fillerStyle: ViewStyle;
};

const PeriodDay = (props: PeriodDayProps) => {
  const {
    theme,
    date,
    onPress,
    onLongPress,
    marking,
    state,
    disableAllTouchEventsForDisabledDays,
    disableAllTouchEventsForInactiveDays,
    accessibilityLabel,
    children,
    testID
  } = props;

  const dateData = date ? xdateToData(date) : undefined;
  const style = useRef(styleConstructor(theme));
  const isDisabled = typeof marking?.disabled !== 'undefined' ? marking.disabled : state === 'disabled';
  const isInactive = typeof marking?.inactive !== 'undefined' ? marking.inactive : state === 'inactive';
  const isToday = typeof marking?.today !== 'undefined' ? marking.today : state === 'today';

  const shouldDisableTouchEvent = useCallback(() => {
    const {disableTouchEvent} = marking || {};
    let disableTouch = false;

    if (typeof disableTouchEvent === 'boolean') {
      disableTouch = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
      disableTouch = disableAllTouchEventsForDisabledDays;
    } else if (typeof disableAllTouchEventsForInactiveDays === 'boolean' && isInactive) {
      disableTouch = disableAllTouchEventsForInactiveDays;
    }
    return disableTouch;
  }, [marking, isDisabled, isInactive, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays]);

  const markingStyle = useMemo((): MarkingStyle => {
    const defaultStyle: MarkingStyle = {textStyle: {}, containerStyle: {}};

    if (!marking) {
      return defaultStyle;
    }

    // Handle text color based on state
    if (marking.disabled) {
      defaultStyle.textStyle = {color: style.current.disabledText.color};
    } else if (marking.inactive) {
      defaultStyle.textStyle = {color: style.current.inactiveText.color};
    } else if (marking.selected) {
      defaultStyle.textStyle = {color: style.current.selectedText.color};
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
      defaultStyle.textStyle = {color: marking.textColor};
    }
    if (marking.customTextStyle) {
      defaultStyle.textStyle = marking.customTextStyle;
    }
    if (marking.customContainerStyle) {
      defaultStyle.containerStyle = marking.customContainerStyle;
    }

    return defaultStyle;
  }, [marking, style]);

  const containerStyle = useMemo(() => {
    const containerStyle = [style.current.base];

    if (isToday) {
      containerStyle.push(style.current.today);
    }

    if (marking) {
      const baseContainerStyle = {
        borderRadius: marking.borderRadius || 17,
        overflow: 'hidden' as const,
        paddingTop: 5
      };

      containerStyle.push(baseContainerStyle);

      // For multi-section, use transparent background to let fillers show through
      if (marking.isMultiPeriod) {
        containerStyle.push({backgroundColor: 'transparent'});
      } else {
        const start = markingStyle.startingDay;
        const end = markingStyle.endingDay;

        if (start && !end) {
          containerStyle.push({backgroundColor: start.backgroundColor});
        } else if ((end && !start) || (end && start)) {
          containerStyle.push({backgroundColor: end.backgroundColor});
        }
      }

      if (markingStyle.containerStyle) {
        containerStyle.push(markingStyle.containerStyle);
      }
    }

    return containerStyle;
  }, [marking, markingStyle, isToday, style]);

  const textStyle = useMemo(() => {
    const textStyle = [style.current.text];

    if (isDisabled) {
      textStyle.push(style.current.disabledText);
    } else if (isInactive) {
      textStyle.push(style.current.inactiveText);
    } else if (isToday) {
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
  const applyBorderToSection = useCallback(
    (
      section: ViewStyle,
      backgroundColor: ColorValue | undefined,
      borderColor: ColorValue | undefined,
      borderWidth: number,
      borderRadius: number,
      borders: {
        top?: boolean;
        bottom?: boolean;
        left?: boolean;
        right?: boolean;
        topLeft?: boolean;
        bottomLeft?: boolean;
        topRight?: boolean;
        bottomRight?: boolean;
      }
    ) => {
      if (backgroundColor) {
        section.backgroundColor = backgroundColor;
      }

      if (borderColor) {
        section.borderColor = borderColor;
      }

      // Apply border widths
      if (borders.top) section.borderTopWidth = borderWidth;
      if (borders.bottom) section.borderBottomWidth = borderWidth;
      if (borders.left) section.borderLeftWidth = borderWidth;
      if (borders.right) section.borderRightWidth = borderWidth;

      // Apply border radius
      if (borders.topLeft) section.borderTopLeftRadius = borderRadius;
      if (borders.bottomLeft) section.borderBottomLeftRadius = borderRadius;
      if (borders.topRight) section.borderTopRightRadius = borderRadius;
      if (borders.bottomRight) section.borderBottomRightRadius = borderRadius;
    },
    []
  );

  // Helper to create a fully closed border (used for single day periods)
  const applyFullyClosedBorder = useCallback(
    (
      section: ViewStyle,
      backgroundColor: ColorValue | undefined,
      borderColor: ColorValue | undefined,
      borderWidth: number,
      borderRadius: number
    ) => {
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
    },
    [applyBorderToSection]
  );

  // Helper function to handle two-section multi-period layout
  const handleTwoSectionMultiPeriod = useCallback(
    (
      leftFillerStyle: ViewStyle,
      rightFillerStyle: ViewStyle,
      marking: MarkingProps,
      borderWidth: number,
      borderRadius: number
    ) => {
      // Left Section
      if (marking.leftSectionIsSingleDay) {
        // Single-day period in left section - fully closed
        applyFullyClosedBorder(
          leftFillerStyle,
          marking.leftSectionColor,
          marking.leftSectionBorderColor,
          borderWidth,
          borderRadius
        );
      } else {
        // Ending period - only right border closed
        applyBorderToSection(
          leftFillerStyle,
          marking.leftSectionColor,
          marking.leftSectionBorderColor,
          borderWidth,
          borderRadius,
          {top: true, bottom: true, right: true, topRight: true, bottomRight: true}
        );
      }

      // Right Section
      if (marking.rightSectionIsSingleDay) {
        // Single-day period in right section - fully closed
        applyFullyClosedBorder(
          rightFillerStyle,
          marking.rightSectionColor,
          marking.rightSectionBorderColor,
          borderWidth,
          borderRadius
        );
      } else {
        // Starting period - only left border closed
        applyBorderToSection(
          rightFillerStyle,
          marking.rightSectionColor,
          marking.rightSectionBorderColor,
          borderWidth,
          borderRadius,
          {top: true, bottom: true, left: true, topLeft: true, bottomLeft: true}
        );
      }
    },
    [applyBorderToSection, applyFullyClosedBorder]
  );

  // Helper function to handle three-section multi-period layout
  const handleThreeSectionMultiPeriod = useCallback(
    (
      leftFillerStyle: ViewStyle,
      middleFillerStyle: ViewStyle,
      rightFillerStyle: ViewStyle,
      marking: MarkingProps,
      borderWidth: number,
      borderRadius: number
    ) => {
      // Left Section (ending period) - has right border only
      applyBorderToSection(
        leftFillerStyle,
        marking.leftSectionColor,
        marking.leftSectionBorderColor,
        borderWidth,
        borderRadius,
        {top: true, bottom: true, right: true, topRight: true, bottomRight: true}
      );

      // Middle Section (single day period) - fully closed borders
      applyFullyClosedBorder(
        middleFillerStyle,
        marking.middleSectionColor,
        marking.middleSectionBorderColor,
        borderWidth,
        borderRadius
      );

      // Right Section (starting period) - has left border only
      applyBorderToSection(
        rightFillerStyle,
        marking.rightSectionColor,
        marking.rightSectionBorderColor,
        borderWidth,
        borderRadius,
        {top: true, bottom: true, left: true, topLeft: true, bottomLeft: true}
      );
    },
    [applyBorderToSection, applyFullyClosedBorder]
  );

  // Helper function to handle fallback multi-period cases
  const handleFallbackMultiPeriod = useCallback(
    (
      leftFillerStyle: ViewStyle,
      middleFillerStyle: ViewStyle,
      rightFillerStyle: ViewStyle,
      marking: MarkingProps,
      borderWidth: number,
      borderRadius: number,
      hasLeft: boolean,
      hasMiddle: boolean,
      hasRight: boolean
    ) => {
      if (hasLeft) {
        if (!hasMiddle && !hasRight) {
          // Only left section - fully closed
          applyFullyClosedBorder(
            leftFillerStyle,
            marking.leftSectionColor,
            marking.leftSectionBorderColor,
            borderWidth,
            borderRadius
          );
        } else {
          // Has other sections - right border closed
          applyBorderToSection(
            leftFillerStyle,
            marking.leftSectionColor,
            marking.leftSectionBorderColor,
            borderWidth,
            borderRadius,
            {top: true, bottom: true, right: true, topRight: true, bottomRight: true}
          );
        }
      }

      if (hasMiddle) {
        // Middle section is always fully closed
        applyFullyClosedBorder(
          middleFillerStyle,
          marking.middleSectionColor,
          marking.middleSectionBorderColor,
          borderWidth,
          borderRadius
        );
      }

      if (hasRight) {
        if (!hasMiddle && !hasLeft) {
          // Only right section - fully closed
          applyFullyClosedBorder(
            rightFillerStyle,
            marking.rightSectionColor,
            marking.rightSectionBorderColor,
            borderWidth,
            borderRadius
          );
        } else {
          // Has other sections - left border closed
          applyBorderToSection(
            rightFillerStyle,
            marking.rightSectionColor,
            marking.rightSectionBorderColor,
            borderWidth,
            borderRadius,
            {top: true, bottom: true, left: true, topLeft: true, bottomLeft: true}
          );
        }
      }
    },
    [applyBorderToSection, applyFullyClosedBorder]
  );

  // Helper function to handle single section period styling
  const handleSinglePeriod = useCallback(
    (
      leftFillerStyle: ViewStyle,
      rightFillerStyle: ViewStyle,
      fillerStyle: ViewStyle,
      markingStyle: MarkingStyle,
      borderWidth: number,
      borderRadius: number
    ): ViewStyle => {
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
      } else if (end && !start) {
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
      } else if (start && end) {
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
      } else if (markingStyle.day) {
        // Middle day - no left/right borders (period continues)
        return {
          borderColor: markingStyle.day.borderColor,
          backgroundColor: markingStyle.day.backgroundColor,
          borderTopWidth: borderWidth,
          borderBottomWidth: borderWidth
        };
      }

      return fillerStyle;
    },
    [applyBorderToSection]
  );

  const threeSectionFillerStyles = useMemo((): ThreeSectionFillerStyles => {
    const leftFillerStyle: ViewStyle = {backgroundColor: 'transparent'};
    const middleFillerStyle: ViewStyle = {backgroundColor: 'transparent'};
    const rightFillerStyle: ViewStyle = {backgroundColor: 'transparent'};
    let fillerStyle: ViewStyle = {};

    if (!marking) {
      return {leftFillerStyle, middleFillerStyle, rightFillerStyle, fillerStyle};
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
      } else if (hasLeft && hasMiddle && hasRight) {
        // CASE 2: 3 rulings - ending period, single-day period, starting period
        handleThreeSectionMultiPeriod(
          leftFillerStyle,
          middleFillerStyle,
          rightFillerStyle,
          marking,
          borderWidth,
          borderRadius
        );
      } else {
        // Fallback for other multi-period cases
        handleFallbackMultiPeriod(
          leftFillerStyle,
          middleFillerStyle,
          rightFillerStyle,
          marking,
          borderWidth,
          borderRadius,
          hasLeft,
          hasMiddle,
          hasRight
        );
      }
    } else {
      // Handle single section (original logic)
      fillerStyle = handleSinglePeriod(
        leftFillerStyle,
        rightFillerStyle,
        fillerStyle,
        markingStyle,
        borderWidth,
        borderRadius
      );
    }

    return {leftFillerStyle, middleFillerStyle, rightFillerStyle, fillerStyle};
  }, [
    marking,
    markingStyle,
    handleTwoSectionMultiPeriod,
    handleThreeSectionMultiPeriod,
    handleFallbackMultiPeriod,
    handleSinglePeriod
  ]);

  const _onPress = useCallback(() => {
    onPress?.(dateData);
  }, [onPress, date]);

  const _onLongPress = useCallback(() => {
    onLongPress?.(dateData);
  }, [onLongPress, date]);

  const renderFillers = useCallback(() => {
    if (!marking) return null;

    if (marking.isMultiPeriod) {
      const hasLeft = !!marking.leftSectionColor;
      const hasMiddle = !!marking.middleSectionColor;
      const hasRight = !!marking.rightSectionColor;

      if (hasLeft && hasRight && !hasMiddle) {
        // 2 rulings: only render left and right sections (NO MIDDLE!)
        return (
          <View style={[style.current.fillers]}>
            <View style={[style.current.leftFiller, threeSectionFillerStyles.leftFillerStyle]} />
            <View style={[style.current.rightFiller, threeSectionFillerStyles.rightFillerStyle]} />
          </View>
        );
      } else {
        // 3 rulings: render all three sections
        return (
          <View style={[style.current.fillers]}>
            <View style={[style.current.leftFiller, threeSectionFillerStyles.leftFillerStyle]} />
            <View
              style={[
                style.current.middleFiller || style.current.leftFiller,
                threeSectionFillerStyles.middleFillerStyle
              ]}
            />
            <View style={[style.current.rightFiller, threeSectionFillerStyles.rightFillerStyle]} />
          </View>
        );
      }
    } else {
      // Single period: render 2-section layout (original)
      return (
        <View style={[style.current.fillers, threeSectionFillerStyles.fillerStyle]}>
          <View style={[style.current.leftFiller, threeSectionFillerStyles.leftFillerStyle]} />
          <View style={[style.current.rightFiller, threeSectionFillerStyles.rightFillerStyle]} />
        </View>
      );
    }
  }, [marking, threeSectionFillerStyles, style]);

  const renderMarking = useCallback(() => {
    if (!marking) return null;

    const {marked, dotColor} = marking;

    return (
      <Marking
        type={'dot'}
        theme={theme}
        marked={marked}
        disabled={isDisabled}
        inactive={isInactive}
        today={isToday}
        dotColor={dotColor}
        dischargeIcon={marking?.dischargeIcon}
      />
    );
  }, [marking, theme, isDisabled, isInactive, isToday]);

  const renderText = useCallback(() => {
    return (
      <Text allowFontScaling={false} style={textStyle}>
        {String(children)}
      </Text>
    );
  }, [textStyle, children]);

  const Component = marking ? TouchableWithoutFeedback : TouchableOpacity;
  const touchDisabled = shouldDisableTouchEvent();

  return (
    <Component
      testID={testID}
      disabled={touchDisabled}
      onPress={!touchDisabled ? _onPress : undefined}
      onLongPress={!touchDisabled ? _onLongPress : undefined}
      accessible
      accessibilityRole={isDisabled ? undefined : 'button'}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={style.current.container}>
        {marking?.inProgressImagePosition && (
          <Image
            source={yellowStripe}
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {
                width:
                  marking?.inProgressImagePosition === InProgressImagePositions.full
                    ? '100%'
                    : [
                        InProgressImagePositions.left,
                        InProgressImagePositions.right,
                        InProgressImagePositions.middle
                      ].includes(marking?.inProgressImagePosition)
                    ? '33%'
                    : '50%',
                height: '100%',
                shadowColor: '#fff',
                position: 'absolute',
                top: marking?.borderWith || 0.7,
                left:
                  marking?.inProgressImagePosition === InProgressImagePositions.right
                    ? '66%'
                    : marking?.inProgressImagePosition === InProgressImagePositions.fullRight
                    ? '50%'
                    : 0,
                zIndex: 1
              },
              marking?.inProgressImagePosition === InProgressImagePositions.left
                ? {
                    borderBottomRightRadius: marking?.borderRadius || 9,
                    borderTopRightRadius: marking?.borderRadius || 9
                  }
                : marking?.inProgressImagePosition === InProgressImagePositions.right
                ? {
                    borderBottomLeftRadius: marking?.borderRadius || 9,
                    borderTopLeftRadius: marking?.borderRadius || 9
                  }
                : {}
            ]}
          />
        )}
        {marking?.customComponent}
        {renderFillers()}
        <View style={containerStyle}>      
          {marking && marking.selected ? (
            <>
              <View style={{ position: "absolute", top: 2, right: 6 }}>
                {renderText()}
              </View>
              <View style={{ position: "absolute", bottom: 2, left: 6 }}>
                {renderMarking()}
              </View>
            </>
          ) : (
            <>
              {renderText()}
            </>
          )}
        </View>
      </View>
    </Component>
  );
};

export default PeriodDay;
PeriodDay.displayName = 'PeriodDay';
PeriodDay.propTypes = {
  state: PropTypes.oneOf(['selected', 'disabled', 'inactive', 'today', '']),
  marking: PropTypes.any,
  theme: PropTypes.object,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  date: PropTypes.string
};
