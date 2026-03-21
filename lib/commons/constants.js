"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const { width: screenWidth, height: screenHeight } = react_native_1.Dimensions.get('window');
const isRTL = react_native_1.I18nManager.isRTL;
const isAndroid = react_native_1.Platform.OS === 'android';
const isIOS = react_native_1.Platform.OS === 'ios';
const screenAspectRatio = screenWidth < screenHeight ? screenHeight / screenWidth : screenWidth / screenHeight;
const isTablet = react_native_1.Platform.isPad || (screenAspectRatio < 1.6 && Math.max(screenWidth, screenHeight) >= 900);
const isAndroidRTL = isAndroid && isRTL;
const isRN73 = () => !!react_native_1.Platform?.constants?.reactNativeVersion && react_native_1.Platform.constants.reactNativeVersion?.minor >= 73;
exports.default = {
    screenWidth,
    screenHeight,
    isRTL,
    isAndroid,
    isIOS,
    isTablet,
    isAndroidRTL,
    isRN73
};
