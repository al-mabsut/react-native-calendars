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
const omit_1 = __importDefault(require("lodash/omit"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const some_1 = __importDefault(require("lodash/some"));
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const dateutils_1 = require("../../dateutils");
const services_1 = require("../../services");
const interface_1 = require("../../interface");
const basic_1 = __importDefault(require("./basic"));
const period_1 = __importDefault(require("./period"));
function areEqual(prevProps, nextProps) {
    const prevPropsWithoutMarkDates = (0, omit_1.default)(prevProps, 'marking');
    const nextPropsWithoutMarkDates = (0, omit_1.default)(nextProps, 'marking');
    const didPropsChange = (0, some_1.default)(prevPropsWithoutMarkDates, function (value, key) {
        return value !== nextPropsWithoutMarkDates[key];
    });
    const isMarkingEqual = (0, isEqual_1.default)(prevProps.marking, nextProps.marking);
    return !didPropsChange && isMarkingEqual;
}
const Day = react_1.default.memo((props) => {
    const { date, marking, dayComponent, markingType } = props;
    const _date = date ? new xdate_1.default(date) : undefined;
    const _isToday = (0, dateutils_1.isToday)(_date);
    const markingAccessibilityLabel = (0, react_1.useMemo)(() => {
        let label = '';
        if (marking) {
            if (marking.accessibilityLabel) {
                return marking.accessibilityLabel;
            }
            if (marking.selected) {
                label += 'selected ';
                if (!marking.marked) {
                    label += 'You have no entries for this day ';
                }
            }
            if (marking.marked) {
                label += 'You have entries for this day ';
            }
            if (marking.startingDay) {
                label += 'period start ';
            }
            if (marking.endingDay) {
                label += 'period end ';
            }
            if (marking.disabled || marking.disableTouchEvent) {
                label += 'disabled ';
            }
        }
        return label;
    }, [marking]);
    const getAccessibilityLabel = (0, react_1.useMemo)(() => {
        const today = (0, services_1.getDefaultLocale)().today || 'today';
        const formatAccessibilityLabel = (0, services_1.getDefaultLocale)().formatAccessibilityLabel || 'dddd d MMMM yyyy';
        return `${_isToday ? today : ''} ${_date?.toString(formatAccessibilityLabel)} ${markingAccessibilityLabel}`;
    }, [_date, marking, _isToday]);
    const Component = dayComponent || (markingType === 'period' ? period_1.default : basic_1.default);
    const dayComponentProps = dayComponent ? { date: (0, interface_1.xdateToData)(date || new xdate_1.default()) } : undefined;
    return (
    //@ts-expect-error
    <Component {...props} accessibilityLabel={getAccessibilityLabel} {...dayComponentProps}>
      {(0, dateutils_1.formatNumbers)(_date?.getDate())}
    </Component>);
}, areEqual);
exports.default = Day;
Day.displayName = 'Day';
