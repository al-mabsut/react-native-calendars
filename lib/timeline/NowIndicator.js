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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const presenter_1 = require("./helpers/presenter");
const Packer_1 = require("./Packer");
const NowIndicator = (props) => {
    const { styles, width, left } = props;
    const indicatorPosition = (0, presenter_1.calcTimeOffset)(Packer_1.HOUR_BLOCK_HEIGHT);
    const nowIndicatorStyle = (0, react_1.useMemo)(() => {
        return [styles.nowIndicator, { top: indicatorPosition, left }];
    }, [indicatorPosition, left]);
    return (<react_native_1.View style={nowIndicatorStyle}>
      <react_native_1.View style={[styles.nowIndicatorLine, { width }]}/>
      <react_native_1.View style={styles.nowIndicatorKnob}/>
    </react_native_1.View>);
};
exports.default = NowIndicator;
