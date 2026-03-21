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
exports.InProgressImagePositions = exports.Markings = void 0;
const filter_1 = __importDefault(require("lodash/filter"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const componentUpdater_1 = require("../../../componentUpdater");
const style_1 = __importDefault(require("./style"));
const dot_1 = __importDefault(require("../dot"));
var Markings;
(function (Markings) {
    Markings["DOT"] = "dot";
    Markings["MULTI_DOT"] = "multi-dot";
    Markings["PERIOD"] = "period";
    Markings["MULTI_PERIOD"] = "multi-period";
    Markings["CUSTOM"] = "custom";
})(Markings = exports.Markings || (exports.Markings = {}));
var InProgressImagePositions;
(function (InProgressImagePositions) {
    InProgressImagePositions["fullLeft"] = "fullLeft";
    InProgressImagePositions["fullRight"] = "fullRight";
    InProgressImagePositions["full"] = "full";
    InProgressImagePositions["middle"] = "middle";
    InProgressImagePositions["left"] = "left";
    InProgressImagePositions["right"] = "right";
})(InProgressImagePositions = exports.InProgressImagePositions || (exports.InProgressImagePositions = {}));
const Marking = (props) => {
    const { theme, type, dots, periods, selected, dotColor, dischargeIcon } = props;
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const getItems = (items) => {
        if (items && Array.isArray(items) && items.length > 0) {
            // Filter out items so that we process only those which have color property
            const validItems = (0, filter_1.default)(items, function (o) {
                return o.color;
            });
            return validItems.map((item, index) => {
                return type === Markings.MULTI_DOT ? renderDot(index, item) : renderPeriod(index, item);
            });
        }
    };
    const renderMarkingByType = () => {
        switch (type) {
            case Markings.MULTI_DOT:
                return renderMultiMarkings(style.current.dots, dots);
            case Markings.MULTI_PERIOD:
                return renderMultiMarkings(style.current.periods, periods);
            default:
                return renderDot();
        }
    };
    const renderMultiMarkings = (containerStyle, items) => {
        return <react_native_1.View style={containerStyle}>{getItems(items)}</react_native_1.View>;
    };
    const renderPeriod = (index, item) => {
        const { color, startingDay, endingDay } = item;
        const styles = [
            style.current.period,
            {
                backgroundColor: color
            }
        ];
        if (startingDay) {
            styles.push(style.current.startingDay);
        }
        if (endingDay) {
            styles.push(style.current.endingDay);
        }
        return <react_native_1.View key={index} style={styles}/>;
    };
    const renderDot = (index, item) => {
        const dotProps = (0, componentUpdater_1.extractDotProps)(props);
        let key = index;
        let color = dotColor;
        if (item) {
            if (item.key) {
                key = item.key;
            }
            color = selected && item.selectedDotColor ? item.selectedDotColor : item.color;
        }
        return <dot_1.default {...dotProps} key={key} color={color} dischargeIcon={dischargeIcon}/>;
    };
    return renderMarkingByType();
};
exports.default = Marking;
Marking.displayName = 'Marking';
Marking.markings = Markings;
