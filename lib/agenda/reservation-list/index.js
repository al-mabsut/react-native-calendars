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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const componentUpdater_1 = require("../../componentUpdater");
const dateutils_1 = require("../../dateutils");
const interface_1 = require("../../interface");
const style_1 = __importDefault(require("./style"));
const reservation_1 = __importDefault(require("./reservation"));
class ReservationList extends react_1.Component {
    static displayName = 'ReservationList';
    static propTypes = {
        ...reservation_1.default.propTypes,
        items: prop_types_1.default.object,
        selectedDay: prop_types_1.default.instanceOf(xdate_1.default),
        topDay: prop_types_1.default.instanceOf(xdate_1.default),
        onDayChange: prop_types_1.default.func,
        showOnlySelectedDayItems: prop_types_1.default.bool,
        renderEmptyData: prop_types_1.default.func,
        onScroll: prop_types_1.default.func,
        onScrollBeginDrag: prop_types_1.default.func,
        onScrollEndDrag: prop_types_1.default.func,
        onMomentumScrollBegin: prop_types_1.default.func,
        onMomentumScrollEnd: prop_types_1.default.func,
        refreshControl: prop_types_1.default.element,
        refreshing: prop_types_1.default.bool,
        onRefresh: prop_types_1.default.func,
        reservationsKeyExtractor: prop_types_1.default.func
    };
    static defaultProps = {
        refreshing: false,
        selectedDay: new xdate_1.default(true)
    };
    style;
    heights;
    selectedDay;
    scrollOver;
    list = react_1.default.createRef();
    constructor(props) {
        super(props);
        this.style = (0, style_1.default)(props.theme);
        this.state = {
            reservations: []
        };
        this.heights = [];
        this.selectedDay = props.selectedDay;
        this.scrollOver = true;
    }
    componentDidMount() {
        this.updateDataSource(this.getReservations(this.props).reservations);
    }
    componentDidUpdate(prevProps) {
        if (this.props.topDay && prevProps.topDay && prevProps !== this.props) {
            if (!(0, dateutils_1.sameDate)(prevProps.topDay, this.props.topDay)) {
                this.setState({ reservations: [] }, () => this.updateReservations(this.props));
            }
            else {
                this.updateReservations(this.props);
            }
        }
    }
    updateDataSource(reservations) {
        this.setState({ reservations });
    }
    updateReservations(props) {
        const { selectedDay, showOnlySelectedDayItems } = props;
        const reservations = this.getReservations(props);
        if (!showOnlySelectedDayItems && this.list && !(0, dateutils_1.sameDate)(selectedDay, this.selectedDay)) {
            let scrollPosition = 0;
            for (let i = 0; i < reservations.scrollPosition; i++) {
                scrollPosition += this.heights[i] || 0;
            }
            this.scrollOver = false;
            this.list?.current?.scrollToOffset({ offset: scrollPosition, animated: true });
        }
        this.selectedDay = selectedDay;
        this.updateDataSource(reservations.reservations);
    }
    getReservationsForDay(iterator, props) {
        const day = iterator.clone();
        const res = props.items?.[(0, interface_1.toMarkingFormat)(day)];
        if (res && res.length) {
            return res.map((reservation, i) => {
                return {
                    reservation,
                    date: i ? undefined : day
                };
            });
        }
        else if (res) {
            return [
                {
                    date: iterator.clone()
                }
            ];
        }
        else {
            return false;
        }
    }
    getReservations(props) {
        const { selectedDay, showOnlySelectedDayItems } = props;
        if (!props.items || !selectedDay) {
            return { reservations: [], scrollPosition: 0 };
        }
        let reservations = [];
        if (this.state.reservations && this.state.reservations.length) {
            const iterator = this.state.reservations[0].date?.clone();
            if (iterator) {
                while (iterator.getTime() < selectedDay.getTime()) {
                    const res = this.getReservationsForDay(iterator, props);
                    if (!res) {
                        reservations = [];
                        break;
                    }
                    else {
                        reservations = reservations.concat(res);
                    }
                    iterator.addDays(1);
                }
            }
        }
        const scrollPosition = reservations.length;
        const iterator = selectedDay.clone();
        if (showOnlySelectedDayItems) {
            const res = this.getReservationsForDay(iterator, props);
            if (res) {
                reservations = res;
            }
            iterator.addDays(1);
        }
        else {
            for (let i = 0; i < 31; i++) {
                const res = this.getReservationsForDay(iterator, props);
                if (res) {
                    reservations = reservations.concat(res);
                }
                iterator.addDays(1);
            }
        }
        return { reservations, scrollPosition };
    }
    onScroll = (event) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        this.props.onScroll?.(yOffset);
        let topRowOffset = 0;
        let topRow;
        for (topRow = 0; topRow < this.heights.length; topRow++) {
            if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
                break;
            }
            topRowOffset += this.heights[topRow];
        }
        const row = this.state.reservations[topRow];
        if (!row)
            return;
        const day = row.date;
        if (day) {
            if (!(0, dateutils_1.sameDate)(day, this.selectedDay) && this.scrollOver) {
                this.selectedDay = day.clone();
                this.props.onDayChange?.(day.clone());
            }
        }
    };
    onListTouch() {
        this.scrollOver = true;
    }
    onRowLayoutChange(index, event) {
        this.heights[index] = event.nativeEvent.layout.height;
    }
    onMoveShouldSetResponderCapture = () => {
        this.onListTouch();
        return false;
    };
    renderRow = ({ item, index }) => {
        const reservationProps = (0, componentUpdater_1.extractReservationProps)(this.props);
        return (<react_native_1.View onLayout={this.onRowLayoutChange.bind(this, index)}>
        <reservation_1.default {...reservationProps} item={item.reservation} date={item.date}/>
      </react_native_1.View>);
    };
    keyExtractor = (item, index) => {
        return this.props.reservationsKeyExtractor?.(item, index) || `${item?.reservation?.day}${index}`;
    };
    render() {
        const { items, selectedDay, theme, style } = this.props;
        if (!items || selectedDay && !items[(0, interface_1.toMarkingFormat)(selectedDay)]) {
            if ((0, isFunction_1.default)(this.props.renderEmptyData)) {
                return this.props.renderEmptyData?.();
            }
            return <react_native_1.ActivityIndicator style={this.style.indicator} color={theme?.indicatorColor}/>;
        }
        return (<react_native_1.FlatList ref={this.list} style={style} contentContainerStyle={this.style.content} data={this.state.reservations} renderItem={this.renderRow} keyExtractor={this.keyExtractor} showsVerticalScrollIndicator={false} scrollEventThrottle={200} onMoveShouldSetResponderCapture={this.onMoveShouldSetResponderCapture} onScroll={this.onScroll} refreshControl={this.props.refreshControl} refreshing={this.props.refreshing} onRefresh={this.props.onRefresh} onScrollBeginDrag={this.props.onScrollBeginDrag} onScrollEndDrag={this.props.onScrollEndDrag} onMomentumScrollBegin={this.props.onMomentumScrollBegin} onMomentumScrollEnd={this.props.onMomentumScrollEnd}/>);
    }
}
exports.default = ReservationList;
