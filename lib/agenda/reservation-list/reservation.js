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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const dateutils_1 = require("../../dateutils");
const services_1 = require("../../services");
const testIDs_1 = require("../../testIDs");
const style_1 = __importDefault(require("./style"));
class Reservation extends react_1.Component {
    static displayName = 'Reservation';
    static propTypes = {
        date: prop_types_1.default.any,
        item: prop_types_1.default.any,
        theme: prop_types_1.default.object,
        rowHasChanged: prop_types_1.default.func,
        renderDay: prop_types_1.default.func,
        renderItem: prop_types_1.default.func,
        renderEmptyDate: prop_types_1.default.func
    };
    style;
    constructor(props) {
        super(props);
        this.style = (0, style_1.default)(props.theme);
    }
    shouldComponentUpdate(nextProps) {
        const d1 = this.props.date;
        const d2 = nextProps.date;
        const r1 = this.props.item;
        const r2 = nextProps.item;
        let changed = true;
        if (!d1 && !d2) {
            changed = false;
        }
        else if (d1 && d2) {
            if (d1.getTime() !== d2.getTime()) {
                changed = true;
            }
            else if (!r1 && !r2) {
                changed = false;
            }
            else if (r1 && r2) {
                if ((!d1 && !d2) || (d1 && d2)) {
                    if ((0, isFunction_1.default)(this.props.rowHasChanged)) {
                        changed = this.props.rowHasChanged(r1, r2);
                    }
                }
            }
        }
        return changed;
    }
    renderDate() {
        const { item, date, renderDay } = this.props;
        if ((0, isFunction_1.default)(renderDay)) {
            return renderDay(date, item);
        }
        const today = date && (0, dateutils_1.isToday)(date) ? this.style.today : undefined;
        const dayNames = (0, services_1.getDefaultLocale)().dayNamesShort;
        if (date) {
            return (<react_native_1.View style={this.style.day} testID={testIDs_1.RESERVATION_DATE}>
          <react_native_1.Text allowFontScaling={false} style={[this.style.dayNum, today]}>
            {date.getDate()}
          </react_native_1.Text>
          <react_native_1.Text allowFontScaling={false} style={[this.style.dayText, today]}>
            {dayNames ? dayNames[date.getDay()] : undefined}
          </react_native_1.Text>
        </react_native_1.View>);
        }
        return <react_native_1.View style={this.style.day}/>;
    }
    render() {
        const { item, date, renderItem, renderEmptyDate } = this.props;
        let content;
        if (item) {
            const firstItem = date ? true : false;
            if ((0, isFunction_1.default)(renderItem)) {
                content = renderItem(item, firstItem);
            }
        }
        else if ((0, isFunction_1.default)(renderEmptyDate)) {
            content = renderEmptyDate(date);
        }
        return (<react_native_1.View style={this.style.container}>
        {this.renderDate()}
        <react_native_1.View style={this.style.innerContainer}>{content}</react_native_1.View>
      </react_native_1.View>);
    }
}
exports.default = Reservation;
