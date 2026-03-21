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
const range_1 = __importDefault(require("lodash/range"));
const times_1 = __importDefault(require("lodash/times"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const constants_1 = __importDefault(require("../commons/constants"));
const presenter_1 = require("./helpers/presenter");
const Packer_1 = require("./Packer");
const dimensionWidth = constants_1.default.screenWidth;
const EVENT_DIFF = 20;
const TimelineHours = (props) => {
    const { format24h, start = 0, end = 24, date, unavailableHours, unavailableHoursColor, styles, onBackgroundLongPress, onBackgroundLongPressOut, width, numberOfDays = 1, timelineLeftInset = 0, testID } = props;
    const lastLongPressEventTime = (0, react_1.useRef)();
    // const offset = this.calendarHeight / (end - start);
    const offset = Packer_1.HOUR_BLOCK_HEIGHT;
    const unavailableHoursBlocks = (0, Packer_1.buildUnavailableHoursBlocks)(unavailableHours, { dayStart: start, dayEnd: end });
    const hours = (0, react_1.useMemo)(() => {
        return (0, range_1.default)(start, end + 1).map(i => {
            let timeText;
            if (i === start) {
                timeText = '';
            }
            else if (i < 12) {
                timeText = !format24h ? `${i} AM` : `${i}:00`;
            }
            else if (i === 12) {
                timeText = !format24h ? `${i} PM` : `${i}:00`;
            }
            else if (i === 24) {
                timeText = !format24h ? '12 AM' : '23:59';
            }
            else {
                timeText = !format24h ? `${i - 12} PM` : `${i}:00`;
            }
            return { timeText, time: i };
        });
    }, [start, end, format24h]);
    const handleBackgroundPress = (0, react_1.useCallback)(event => {
        const yPosition = event.nativeEvent.locationY;
        const xPosition = event.nativeEvent.locationX;
        const { hour, minutes } = (0, presenter_1.calcTimeByPosition)(yPosition, Packer_1.HOUR_BLOCK_HEIGHT);
        const dateByPosition = (0, presenter_1.calcDateByPosition)(xPosition, timelineLeftInset, numberOfDays, date);
        lastLongPressEventTime.current = { hour, minutes, date: dateByPosition };
        const timeString = (0, presenter_1.buildTimeString)(hour, minutes, dateByPosition);
        onBackgroundLongPress?.(timeString, lastLongPressEventTime.current);
    }, [onBackgroundLongPress, date]);
    const handlePressOut = (0, react_1.useCallback)(() => {
        if (lastLongPressEventTime.current) {
            const { hour, minutes, date } = lastLongPressEventTime.current;
            const timeString = (0, presenter_1.buildTimeString)(hour, minutes, date);
            onBackgroundLongPressOut?.(timeString, lastLongPressEventTime.current);
            lastLongPressEventTime.current = undefined;
        }
    }, [onBackgroundLongPressOut, date]);
    return (<>
      <react_native_1.TouchableWithoutFeedback onLongPress={handleBackgroundPress} onPressOut={handlePressOut}>
        <react_native_1.View style={react_native_1.StyleSheet.absoluteFillObject}/>
      </react_native_1.TouchableWithoutFeedback>
      {unavailableHoursBlocks.map((block, index) => (<react_native_1.View key={index} style={[
                styles.unavailableHoursBlock,
                block,
                unavailableHoursColor ? { backgroundColor: unavailableHoursColor } : undefined,
                { left: timelineLeftInset }
            ]}/>))}

      {hours.map(({ timeText, time }, index) => {
            return (<react_1.default.Fragment key={time}>
            <react_native_1.Text key={`timeLabel${time}`} style={[styles.timeLabel, { top: offset * index - 6, width: timelineLeftInset - 16 }]}>
              {timeText}
            </react_native_1.Text>
            {time === start ? null : (<react_native_1.View key={`line${time}`} testID={`${testID}.${time}.line`} style={[styles.line, { top: offset * index, width: dimensionWidth - EVENT_DIFF, left: timelineLeftInset - 16 }]}/>)}
            {<react_native_1.View key={`lineHalf${time}`} testID={`${testID}.${time}.lineHalf`} style={[styles.line, { top: offset * (index + 0.5), width: dimensionWidth - EVENT_DIFF, left: timelineLeftInset - 16 }]}/>}
          </react_1.default.Fragment>);
        })}
      {(0, times_1.default)(numberOfDays, (index) => <react_native_1.View key={index} style={[styles.verticalLine, { right: (index + 1) * width / numberOfDays }]}/>)}
    </>);
};
exports.default = react_1.default.memo(TimelineHours);
