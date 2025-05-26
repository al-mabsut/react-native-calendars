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
  StyleProp
} from 'react-native';
import {xdateToData} from '../../../interface';
import {Theme, DayState, DateData} from '../../../types';
import Marking, {MarkingProps} from '../marking';
import styleConstructor from './style';

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

  const shouldDisableTouchEvent = () => {
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
  };

  const markingStyle = useMemo(() => {
    const defaultStyle: MarkingStyle = {textStyle: {}, containerStyle: {}};

    if (!marking) {
      return defaultStyle;
    } else {
      if (marking.disabled) {
        defaultStyle.textStyle = {color: style.current.disabledText.color};
      } else if (marking.inactive) {
        defaultStyle.textStyle = {color: style.current.inactiveText.color};
      } else if (marking.selected) {
        defaultStyle.textStyle = {color: style.current.selectedText.color};
      }
      if (marking.startingDay) {
        defaultStyle.startingDay = {backgroundColor: marking.color, borderColor: marking.borderColor};
      }
      if (marking.endingDay) {
        defaultStyle.endingDay = {backgroundColor: marking.color, borderColor: marking.borderColor};
      }
      if (!marking.startingDay && !marking.endingDay) {
        defaultStyle.day = {backgroundColor: marking.color, borderColor: marking.borderColor};
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
    }
  }, [marking]);

  const containerStyle = useMemo(() => {
    const containerStyle = [style.current.base];

    if (isToday) {
      containerStyle.push(style.current.today);
    }

    if (marking) {
      containerStyle.push({
        borderRadius: 17,
        overflow: 'hidden',
        paddingTop: 5
      });
      const start = markingStyle.startingDay;
      const end = markingStyle.endingDay;
      if (start && !end) {
        containerStyle.push({backgroundColor: markingStyle.startingDay?.backgroundColor});
      } else if ((end && !start) || (end && start)) {
        containerStyle.push({backgroundColor: markingStyle.endingDay?.backgroundColor});
      }

      if (markingStyle.containerStyle) {
        containerStyle.push(markingStyle.containerStyle);
      }
    }
    return containerStyle;
  }, [marking, isDisabled, isInactive, isToday]);

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
  }, [marking, isDisabled, isInactive, isToday]);

  const fillerStyles = useMemo(() => {
    const leftFillerStyle: ViewStyle = {backgroundColor: undefined};
    const rightFillerStyle: ViewStyle = {backgroundColor: undefined};
    let fillerStyle = {};

    const start = markingStyle.startingDay;
    const end = markingStyle.endingDay;
    const borderColor = markingStyle.day?.borderColor;
    const borderWidth = marking?.borderWith;
    const borderRadius = marking?.borderRadius;
    const isOverlap = marking?.isMultiPeriod && start && end;
    if (isOverlap) {
      // Handle overlapping case - left side shows end, right side shows start
      leftFillerStyle.backgroundColor = marking.endPeriodColor || markingStyle.endingDay?.backgroundColor;
      leftFillerStyle.borderTopWidth = borderWidth;
      leftFillerStyle.borderBottomWidth = borderWidth;
      leftFillerStyle.borderRightWidth = borderWidth;
      leftFillerStyle.borderColor = marking.endPeriodBorderColor || markingStyle.endingDay?.borderColor;
      leftFillerStyle.borderTopRightRadius = borderRadius;
      leftFillerStyle.borderBottomRightRadius = borderRadius;

      rightFillerStyle.backgroundColor = marking.startPeriodColor || markingStyle.startingDay?.backgroundColor;
      rightFillerStyle.borderTopWidth = borderWidth;
      rightFillerStyle.borderBottomWidth = borderWidth;
      rightFillerStyle.borderLeftWidth = borderWidth;
      rightFillerStyle.borderColor = marking.startPeriodBorderColor || markingStyle.startingDay?.borderColor;
      rightFillerStyle.borderTopLeftRadius = borderRadius;
      rightFillerStyle.borderBottomLeftRadius = borderRadius;
    } else if (start && !end) {
      // Starting day (original logic)
      leftFillerStyle.backgroundColor = markingStyle.startingDay?.backgroundColor;
      leftFillerStyle.borderTopWidth = borderWidth;
      leftFillerStyle.borderBottomWidth = borderWidth;
      leftFillerStyle.borderLeftWidth = borderWidth;
      leftFillerStyle.borderColor = markingStyle.startingDay?.borderColor;
      leftFillerStyle.borderTopLeftRadius = borderRadius;
      leftFillerStyle.borderBottomLeftRadius = borderRadius;

      rightFillerStyle.backgroundColor = markingStyle.startingDay?.backgroundColor;
      rightFillerStyle.borderTopWidth = borderWidth;
      rightFillerStyle.borderBottomWidth = borderWidth;
      rightFillerStyle.borderColor = markingStyle.startingDay?.borderColor;
    } else if (end && !start) {
      // Ending day (original logic)
      leftFillerStyle.backgroundColor = markingStyle.endingDay?.backgroundColor;
      leftFillerStyle.borderTopWidth = borderWidth;
      leftFillerStyle.borderBottomWidth = borderWidth;
      leftFillerStyle.borderColor = markingStyle.endingDay?.borderColor;

      rightFillerStyle.backgroundColor = markingStyle.endingDay?.backgroundColor;
      rightFillerStyle.borderTopWidth = borderWidth;
      rightFillerStyle.borderBottomWidth = borderWidth;
      rightFillerStyle.borderColor = markingStyle.endingDay?.borderColor;
      rightFillerStyle.borderRightWidth = borderWidth;
      rightFillerStyle.borderTopRightRadius = borderRadius;
      rightFillerStyle.borderBottomRightRadius = borderRadius;
    } else if (markingStyle.day) {
      // Middle day (original logic)
      leftFillerStyle.backgroundColor = markingStyle.day?.backgroundColor;
      leftFillerStyle.borderTopWidth = borderWidth;
      leftFillerStyle.borderBottomWidth = borderWidth;
      leftFillerStyle.borderColor = borderColor;

      rightFillerStyle.backgroundColor = markingStyle.day?.backgroundColor;
      rightFillerStyle.borderTopWidth = borderWidth;
      rightFillerStyle.borderBottomWidth = borderWidth;
      rightFillerStyle.borderColor = borderColor;

      fillerStyle = {
        borderColor: markingStyle.day?.borderColor
        //   backgroundColor: markingStyle.day?.backgroundColor
      };
    }

    return {leftFillerStyle, rightFillerStyle, fillerStyle};
  }, [marking, markingStyle]);

  const _onPress = useCallback(() => {
    onPress?.(dateData);
  }, [onPress, date]);

  const _onLongPress = useCallback(() => {
    onLongPress?.(dateData);
  }, [onLongPress, date]);

  const renderFillers = () => {
    if (marking) {
      return (
        <View style={[style.current.fillers, fillerStyles.fillerStyle]}>
          <View style={[style.current.leftFiller, fillerStyles.leftFillerStyle]} />
          <View style={[style.current.rightFiller, fillerStyles.rightFillerStyle]} />
        </View>
      );
    }
  };

  const renderMarking = () => {
    if (marking) {
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
        />
      );
    }
  };

  const renderText = () => {
    return (
      <Text allowFontScaling={false} style={textStyle}>
        {String(children)}
      </Text>
    );
  };
  const Component = marking ? TouchableWithoutFeedback : TouchableOpacity;

  return (
    <Component
      testID={testID}
      disabled={shouldDisableTouchEvent()}
      onPress={!shouldDisableTouchEvent() ? _onPress : undefined}
      onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined}
      accessible
      accessibilityRole={isDisabled ? undefined : 'button'}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={style.current.container}>
        {renderFillers()}
        <View style={containerStyle}>
          {renderText()}
          {renderMarking()}
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
