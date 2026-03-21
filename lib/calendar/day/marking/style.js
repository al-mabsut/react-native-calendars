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
const react_native_1 = require("react-native");
const defaultStyle = __importStar(require("../../style"));
function styleConstructor(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    return react_native_1.StyleSheet.create({
        dots: {
            flexDirection: 'row'
        },
        periods: {
            alignSelf: 'stretch'
        },
        period: {
            height: 4,
            marginVertical: 1,
            backgroundColor: appStyle.dotColor
        },
        startingDay: {
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
            marginLeft: 4
        },
        endingDay: {
            borderTopRightRadius: 2,
            borderBottomRightRadius: 2,
            marginRight: 4
        },
        ...(theme['stylesheet.marking'] || {})
    });
}
exports.default = styleConstructor;
