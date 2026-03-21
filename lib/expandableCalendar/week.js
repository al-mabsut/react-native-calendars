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
const xdate_1 = __importDefault(require("xdate"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const dateutils_1 = require("../dateutils");
const interface_1 = require("../interface");
const day_state_manager_1 = require("../day-state-manager");
const componentUpdater_1 = require("../componentUpdater");
const style_1 = __importDefault(require("./style"));
const index_1 = __importDefault(require("../calendar/day/index"));
function arePropsEqual(prevProps, nextProps) {
    const { context: prevContext, markedDates: prevMarkings, ...prevOthers } = prevProps;
    const { context: nextContext, markedDates: nextMarkings, ...nextOthers } = nextProps;
    return (0, isEqual_1.default)(prevContext, nextContext) && (0, isEqual_1.default)(prevMarkings, nextMarkings) && (0, isEqual_1.default)(prevOthers, nextOthers);
}
const Week = react_1.default.memo((props) => {
    const { theme, current, firstDay, hideExtraDays, markedDates, onDayPress, onDayLongPress, style: propsStyle, numberOfDays = 1, timelineLeftInset, testID } = props;
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const disableDaySelection = (0, react_1.useMemo)(() => {
        return !!numberOfDays && numberOfDays > 1;
    }, [numberOfDays]);
    const getWeek = (0, react_1.useCallback)((date) => {
        if (date) {
            return (0, dateutils_1.getWeekDates)(date, firstDay);
        }
    }, [firstDay]);
    const partialWeekStyle = (0, react_1.useMemo)(() => {
        return [style.current.partialWeek, { paddingLeft: timelineLeftInset }];
    }, [timelineLeftInset]);
    const dayProps = (0, componentUpdater_1.extractDayProps)(props);
    const currXdate = (0, react_1.useMemo)(() => (0, interface_1.parseDate)(current), [current]);
    const renderDay = (day, id) => {
        // hide extra days
        if (current && hideExtraDays) {
            if (!(0, dateutils_1.sameMonth)(day, currXdate)) {
                return <react_native_1.View key={id} style={style.current.emptyDayContainer}/>;
            }
        }
        const dayString = (0, interface_1.toMarkingFormat)(day);
        return (<react_native_1.View style={style.current.dayContainer} key={id}>
        <index_1.default {...dayProps} testID={`${testID}.day_${dayString}`} date={dayString} state={(0, day_state_manager_1.getState)(day, currXdate, props, disableDaySelection)} marking={disableDaySelection ? { ...markedDates?.[dayString], disableTouchEvent: true } : markedDates?.[dayString]} onPress={onDayPress} onLongPress={onDayLongPress}/>
      </react_native_1.View>);
    };
    const renderWeek = () => {
        const dates = numberOfDays > 1 ? (0, dateutils_1.getPartialWeekDates)(current, numberOfDays) : getWeek(current);
        const week = [];
        if (dates) {
            const todayIndex = dates?.indexOf((0, interface_1.parseDate)(new Date())) || -1;
            const sliced = dates.slice(todayIndex, numberOfDays);
            const datesToRender = numberOfDays > 1 && todayIndex > -1 ? sliced : dates;
            datesToRender.forEach((day, id) => {
                const d = day instanceof xdate_1.default ? day : new xdate_1.default(day);
                week.push(renderDay(d, id));
            }, this);
        }
        return week;
    };
    return (<react_native_1.View style={style.current.container} testID={`${testID}.week_${current}`}>
      <react_native_1.View style={[style.current.week, numberOfDays > 1 ? partialWeekStyle : undefined, propsStyle]}>
        {renderWeek()}
      </react_native_1.View>
    </react_native_1.View>);
}, arePropsEqual);
exports.default = Week;
Week.displayName = 'Week';
