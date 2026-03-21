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
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const prop_types_1 = __importDefault(require("prop-types"));
const xdate_1 = __importDefault(require("xdate"));
const memoize_one_1 = __importDefault(require("memoize-one"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const componentUpdater_1 = require("../componentUpdater");
const interface_1 = require("../interface");
const dateutils_1 = require("../dateutils");
const testIDs_1 = require("../testIDs");
const velocityTracker_1 = require("../velocityTracker");
const services_1 = require("../services");
const style_1 = __importDefault(require("./style"));
const WeekDaysNames_1 = __importDefault(require("../commons/WeekDaysNames"));
const calendar_list_1 = __importDefault(require("../calendar-list"));
const reservation_list_1 = __importDefault(require("./reservation-list"));
const HEADER_HEIGHT = 104;
const KNOB_HEIGHT = 24;
/**
 * @description: Agenda component
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/agenda.gif
 */
class Agenda extends react_1.Component {
    static displayName = 'Agenda';
    static propTypes = {
        ...calendar_list_1.default.propTypes,
        ...reservation_list_1.default.propTypes,
        items: prop_types_1.default.object,
        style: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.array, prop_types_1.default.number]),
        loadItemsForMonth: prop_types_1.default.func,
        onCalendarToggled: prop_types_1.default.func,
        onDayChange: prop_types_1.default.func,
        renderKnob: prop_types_1.default.func,
        renderList: prop_types_1.default.func,
        selected: prop_types_1.default.any,
        hideKnob: prop_types_1.default.bool,
        showClosingKnob: prop_types_1.default.bool
    };
    style;
    viewHeight;
    viewWidth;
    scrollTimeout;
    headerState;
    currentMonth;
    knobTracker;
    _isMounted;
    scrollPad = react_1.default.createRef();
    calendar = react_1.default.createRef();
    knob = react_1.default.createRef();
    list = react_1.default.createRef();
    constructor(props) {
        super(props);
        this.style = (0, style_1.default)(props.theme);
        const windowSize = react_native_1.Dimensions.get('window');
        this.viewHeight = windowSize.height;
        this.viewWidth = windowSize.width;
        this.scrollTimeout = undefined;
        this.headerState = 'idle';
        this.state = {
            scrollY: new react_native_1.Animated.Value(0),
            calendarIsReady: false,
            calendarScrollable: false,
            firstReservationLoad: false,
            selectedDay: this.getSelectedDate(props.selected),
            topDay: this.getSelectedDate(props.selected)
        };
        this.currentMonth = this.state.selectedDay.clone();
        this.knobTracker = new velocityTracker_1.VelocityTracker();
        this.state.scrollY.addListener(({ value }) => this.knobTracker.add(value));
    }
    componentDidMount() {
        this._isMounted = true;
        this.loadReservations(this.props);
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.state.scrollY.removeAllListeners();
    }
    componentDidUpdate(prevProps, prevState) {
        const newSelectedDate = this.getSelectedDate(this.props.selected);
        if (!(0, dateutils_1.sameDate)(newSelectedDate, prevState.selectedDay)) {
            const prevSelectedDate = this.getSelectedDate(prevProps.selected);
            if (!(0, dateutils_1.sameDate)(newSelectedDate, prevSelectedDate)) {
                this.setState({ selectedDay: newSelectedDate });
                this.calendar?.current?.scrollToDay(newSelectedDate, this.calendarOffset(), true);
            }
        }
        else if (!prevProps.items) {
            this.loadReservations(this.props);
        }
    }
    static getDerivedStateFromProps(nextProps) {
        if (nextProps.items) {
            return { firstReservationLoad: false };
        }
        return null;
    }
    getSelectedDate(date) {
        return date ? new xdate_1.default(date) : new xdate_1.default(true);
    }
    calendarOffset() {
        return 96 - this.viewHeight / 2;
    }
    initialScrollPadPosition = () => {
        return Math.max(0, this.viewHeight - HEADER_HEIGHT);
    };
    setScrollPadPosition = (y, animated) => {
        if (this.scrollPad?.current?.scrollTo) {
            this.scrollPad.current.scrollTo({ x: 0, y, animated });
        }
        else {
            // Support for RN O.61 (Expo 37)
            this.scrollPad?.current?.getNode().scrollTo({ x: 0, y, animated });
        }
    };
    toggleCalendarPosition = (open) => {
        const maxY = this.initialScrollPadPosition();
        this.setScrollPadPosition(open ? 0 : maxY, true);
        this.enableCalendarScrolling(open);
    };
    enableCalendarScrolling(enable = true) {
        this.setState({ calendarScrollable: enable });
        this.props.onCalendarToggled?.(enable);
        // Enlarge calendarOffset here as a workaround on iOS to force repaint.
        // Otherwise the month after current one or before current one remains invisible.
        // The problem is caused by overflow: 'hidden' style, which we need for dragging
        // to be performant.
        // Another working solution for this bug would be to set removeClippedSubviews={false}
        // in CalendarList listView, but that might impact performance when scrolling
        // month list in expanded CalendarList.
        // Further info https://github.com/facebook/react-native/issues/1831
        this.calendar?.current?.scrollToDay(this.state.selectedDay, this.calendarOffset() + 1, true);
    }
    loadReservations(props) {
        if ((!props.items || !Object.keys(props.items).length) && !this.state.firstReservationLoad) {
            this.setState({ firstReservationLoad: true }, () => {
                this.props.loadItemsForMonth?.((0, interface_1.xdateToData)(this.state.selectedDay));
            });
        }
    }
    onDayPress = (d) => {
        this.chooseDay(d, !this.state.calendarScrollable);
    };
    chooseDay(d, optimisticScroll) {
        const day = new xdate_1.default(d.dateString);
        this.setState({
            calendarScrollable: false,
            selectedDay: day.clone()
        });
        this.props.onCalendarToggled?.(false);
        if (!optimisticScroll) {
            this.setState({ topDay: day.clone() });
        }
        this.setScrollPadPosition(this.initialScrollPadPosition(), true);
        this.calendar?.current?.scrollToDay(day, this.calendarOffset(), true);
        this.props.loadItemsForMonth?.((0, interface_1.xdateToData)(day));
        this.props.onDayPress?.((0, interface_1.xdateToData)(day));
    }
    generateMarkings = (0, memoize_one_1.default)((selectedDay, markedDates, items) => {
        if (!markedDates) {
            markedDates = {};
            if (items) {
                Object.keys(items).forEach(key => {
                    if (items[key] && items[key].length) {
                        markedDates[key] = { marked: true };
                    }
                });
            }
        }
        const key = (0, interface_1.toMarkingFormat)(selectedDay);
        return { ...markedDates, [key]: { ...(markedDates[key] || {}), ...{ selected: true } } };
    });
    onScrollPadLayout = () => {
        // When user touches knob, the actual component that receives touch events is a ScrollView.
        // It needs to be scrolled to the bottom, so that when user moves finger downwards,
        // scroll position actually changes (it would stay at 0, when scrolled to the top).
        this.setScrollPadPosition(this.initialScrollPadPosition(), false);
        // delay rendering calendar in full height because otherwise it still flickers sometimes
        setTimeout(() => this.setState({ calendarIsReady: true }), 0);
    };
    onCalendarListLayout = () => {
        this.calendar?.current?.scrollToDay(this.state.selectedDay, this.calendarOffset(), false);
    };
    onLayout = (event) => {
        this.viewHeight = event.nativeEvent.layout.height;
        this.viewWidth = event.nativeEvent.layout.width;
        this.forceUpdate();
    };
    onTouchStart = () => {
        this.headerState = 'touched';
        this.knob?.current?.setNativeProps({ style: { opacity: 0.5 } });
    };
    onTouchEnd = () => {
        this.knob?.current?.setNativeProps({ style: { opacity: 1 } });
        if (this.headerState === 'touched') {
            const isOpen = this.state.calendarScrollable;
            this.toggleCalendarPosition(!isOpen);
        }
        this.headerState = 'idle';
    };
    onStartDrag = () => {
        this.headerState = 'dragged';
        this.knobTracker.reset();
    };
    onSnapAfterDrag = (e) => {
        // on Android onTouchEnd is not called if dragging was started
        this.onTouchEnd();
        const currentY = e.nativeEvent.contentOffset.y;
        this.knobTracker.add(currentY);
        const projectedY = currentY + this.knobTracker.estimateSpeed() * 250; /*ms*/
        const maxY = this.initialScrollPadPosition();
        const snapY = projectedY > maxY / 2 ? maxY : 0;
        this.setScrollPadPosition(snapY, true);
        this.enableCalendarScrolling(snapY === 0);
    };
    onVisibleMonthsChange = (months) => {
        this.props.onVisibleMonthsChange?.(months);
        if (this.props.items && !this.state.firstReservationLoad) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            this.scrollTimeout = setTimeout(() => {
                if (this._isMounted) {
                    this.props.loadItemsForMonth?.(months[0]);
                }
            }, 200);
        }
    };
    onDayChange = (day) => {
        const withAnimation = (0, dateutils_1.sameMonth)(day, this.state.selectedDay);
        this.calendar?.current?.scrollToDay(day, this.calendarOffset(), withAnimation);
        this.setState({ selectedDay: day });
        this.props.onDayChange?.((0, interface_1.xdateToData)(day));
    };
    renderReservations() {
        const reservationListProps = (0, componentUpdater_1.extractReservationListProps)(this.props);
        if ((0, isFunction_1.default)(this.props.renderList)) {
            return this.props.renderList({
                ...reservationListProps,
                selectedDay: this.state.selectedDay,
                topDay: this.state.topDay,
                onDayChange: this.onDayChange
            });
        }
        return (<reservation_list_1.default {...reservationListProps} ref={this.list} selectedDay={this.state.selectedDay} topDay={this.state.topDay} onDayChange={this.onDayChange}/>);
    }
    renderCalendarList() {
        const { markedDates, items } = this.props;
        const shouldHideExtraDays = this.state.calendarScrollable ? this.props.hideExtraDays : false;
        const calendarListProps = (0, componentUpdater_1.extractCalendarListProps)(this.props);
        return (<calendar_list_1.default {...calendarListProps} ref={this.calendar} current={(0, services_1.getCalendarDateString)(this.currentMonth.toString())} markedDates={this.generateMarkings(this.state.selectedDay, markedDates, items)} calendarWidth={this.viewWidth} scrollEnabled={this.state.calendarScrollable} hideExtraDays={shouldHideExtraDays} onLayout={this.onCalendarListLayout} onDayPress={this.onDayPress} onVisibleMonthsChange={this.onVisibleMonthsChange}/>);
    }
    renderKnob() {
        const { showClosingKnob, hideKnob, renderKnob } = this.props;
        let knob = <react_native_1.View style={this.style.knobContainer}/>;
        if (!hideKnob) {
            const knobView = renderKnob ? renderKnob() : <react_native_1.View style={this.style.knob}/>;
            knob = !this.state.calendarScrollable || showClosingKnob ? (<react_native_1.View style={this.style.knobContainer}>
          <react_native_1.View ref={this.knob}>{knobView}</react_native_1.View>
        </react_native_1.View>) : null;
        }
        return knob;
    }
    renderWeekDaysNames = () => {
        return (<WeekDaysNames_1.default firstDay={this.props.firstDay} style={this.style.dayHeader}/>);
    };
    renderWeekNumbersSpace = () => {
        return this.props.showWeekNumbers && <react_native_1.View style={this.style.dayHeader}/>;
    };
    render() {
        const { hideKnob, style, testID } = this.props;
        const agendaHeight = this.initialScrollPadPosition();
        const weekdaysStyle = [
            this.style.weekdays,
            {
                opacity: this.state.scrollY.interpolate({
                    inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
                    outputRange: [0, 1],
                    extrapolate: 'clamp'
                }),
                transform: [
                    {
                        translateY: this.state.scrollY.interpolate({
                            inputRange: [Math.max(0, agendaHeight - HEADER_HEIGHT), agendaHeight],
                            outputRange: [-HEADER_HEIGHT, 0],
                            extrapolate: 'clamp'
                        })
                    }
                ]
            }
        ];
        const headerTranslate = this.state.scrollY.interpolate({
            inputRange: [0, agendaHeight],
            outputRange: [agendaHeight, 0],
            extrapolate: 'clamp'
        });
        const contentTranslate = this.state.scrollY.interpolate({
            inputRange: [0, agendaHeight],
            outputRange: [0, agendaHeight / 2],
            extrapolate: 'clamp'
        });
        const headerStyle = [
            this.style.header,
            {
                bottom: agendaHeight,
                transform: [{ translateY: headerTranslate }]
            }
        ];
        if (!this.state.calendarIsReady) {
            // limit header height until everything is setup for calendar dragging
            headerStyle.push({ height: 0 });
            // fill header with appStyle.calendarBackground background to reduce flickering
            weekdaysStyle.push({ height: HEADER_HEIGHT });
        }
        const openCalendarScrollPadPosition = !hideKnob && this.state.calendarScrollable && this.props.showClosingKnob ? agendaHeight + HEADER_HEIGHT : 0;
        const shouldAllowDragging = !hideKnob && !this.state.calendarScrollable;
        const scrollPadPosition = (shouldAllowDragging ? HEADER_HEIGHT : openCalendarScrollPadPosition) - KNOB_HEIGHT;
        const scrollPadStyle = {
            height: KNOB_HEIGHT,
            top: scrollPadPosition
        };
        return (<react_native_1.View testID={testID} onLayout={this.onLayout} style={[style, this.style.container]}>
        <react_native_1.View style={this.style.reservations}>{this.renderReservations()}</react_native_1.View>
        <react_native_1.Animated.View style={headerStyle}>
          <react_native_1.Animated.View style={[this.style.animatedContainer, { transform: [{ translateY: contentTranslate }] }]}>
            {this.renderCalendarList()}
          </react_native_1.Animated.View>
          {this.renderKnob()}
        </react_native_1.Animated.View>
        <react_native_1.Animated.View style={weekdaysStyle}>
          {this.renderWeekNumbersSpace()}
          {this.renderWeekDaysNames()}
        </react_native_1.Animated.View>
        <react_native_1.Animated.ScrollView ref={this.scrollPad} style={[this.style.scrollPadStyle, scrollPadStyle]} overScrollMode="never" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} scrollEventThrottle={8} scrollsToTop={false} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onScrollBeginDrag={this.onStartDrag} onScrollEndDrag={this.onSnapAfterDrag} onScroll={react_native_1.Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], { useNativeDriver: true })}>
          <react_native_1.View testID={testIDs_1.AGENDA_CALENDAR_KNOB} style={{ height: agendaHeight + KNOB_HEIGHT }} onLayout={this.onScrollPadLayout}/>
        </react_native_1.Animated.ScrollView>
      </react_native_1.View>);
    }
}
exports.default = Agenda;
