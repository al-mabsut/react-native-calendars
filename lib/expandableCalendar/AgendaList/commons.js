"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaSectionHeader = void 0;
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function areTextPropsEqual(prev, next) {
    return (0, isEqual_1.default)(prev.style, next.style) && prev.title === next.title;
}
exports.AgendaSectionHeader = react_1.default.memo((props) => {
    return (<react_native_1.Text allowFontScaling={false} style={props.style} onLayout={props.onLayout}>
      {props.title}
    </react_native_1.Text>);
}, areTextPropsEqual);
