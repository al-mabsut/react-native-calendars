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
const services_1 = require("../../services");
const interface_1 = require("../../interface");
const dateutils_1 = require("../../dateutils");
const commons_1 = require("../commons");
const style_1 = __importDefault(require("../style"));
const index_1 = __importDefault(require("./index"));
const TOP_POSITION = 65;
const DOWN_ICON = require('../../img/down.png');
const UP_ICON = require('../../img/up.png');
const TodayButton = (props, ref) => {
    (0, react_1.useImperativeHandle)(ref, () => ({
        disable: (shouldDisable) => {
            disable(shouldDisable);
        }
    }));
    const { margin = 0, disabledOpacity = 0.3, theme, style: propsStyle } = props;
    const { date, setDate } = (0, react_1.useContext)(index_1.default);
    const [disabled, setDisabled] = (0, react_1.useState)(false);
    const style = (0, react_1.useRef)((0, style_1.default)(theme));
    const state = (0, dateutils_1.isToday)(date) ? 0 : (0, dateutils_1.isPastDate)(date) ? -1 : 1;
    const shouldShow = state !== 0;
    /** Effects */
    (0, react_1.useEffect)(() => {
        if (shouldShow) {
            setButtonIcon(getButtonIcon());
        }
        animatePosition();
    }, [state]);
    (0, react_1.useEffect)(() => {
        if (!shouldShow) {
            return;
        }
        animateOpacity();
    }, [disabled]);
    const disable = (shouldDisable) => {
        if (shouldDisable !== disabled) {
            setDisabled(shouldDisable);
        }
    };
    /** Label */
    const getFormattedLabel = () => {
        const todayStr = (0, services_1.getDefaultLocale)().today || commons_1.todayString;
        const today = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
        return today;
    };
    const today = (0, react_1.useRef)(getFormattedLabel());
    /** Icon */
    const getButtonIcon = () => {
        if (shouldShow) {
            return state === 1 ? UP_ICON : DOWN_ICON;
        }
    };
    const [buttonIcon, setButtonIcon] = (0, react_1.useState)(getButtonIcon());
    /** Animations */
    const buttonY = (0, react_1.useRef)(new react_native_1.Animated.Value(margin ? -margin : -TOP_POSITION));
    const opacity = (0, react_1.useRef)(new react_native_1.Animated.Value(1));
    const getPositionAnimation = () => {
        const toValue = state === 0 ? TOP_POSITION : -margin || -TOP_POSITION;
        return {
            toValue,
            tension: 30,
            friction: 8,
            useNativeDriver: true
        };
    };
    const getOpacityAnimation = () => {
        return {
            toValue: disabled ? disabledOpacity : 1,
            duration: 500,
            useNativeDriver: true
        };
    };
    const animatePosition = () => {
        const animationData = getPositionAnimation();
        react_native_1.Animated.spring(buttonY.current, {
            ...animationData
        }).start();
    };
    const animateOpacity = () => {
        const animationData = getOpacityAnimation();
        react_native_1.Animated.timing(opacity.current, {
            ...animationData
        }).start();
    };
    const getTodayDate = () => {
        return (0, interface_1.toMarkingFormat)(new xdate_1.default());
    };
    const onPress = (0, react_1.useCallback)(() => {
        setDate(getTodayDate(), commons_1.UpdateSources.TODAY_PRESS);
    }, [setDate]);
    return (<react_native_1.Animated.View style={[style.current.todayButtonContainer, { transform: [{ translateY: buttonY.current }] }]}>
      <react_native_1.TouchableOpacity style={[style.current.todayButton, propsStyle]} onPress={onPress} disabled={disabled}>
        <react_native_1.Animated.Image style={[style.current.todayButtonImage, { opacity: opacity.current }]} source={buttonIcon}/>
        <react_native_1.Animated.Text allowFontScaling={false} style={[style.current.todayButtonText, { opacity: opacity.current }]}>
          {today.current}
        </react_native_1.Animated.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.Animated.View>);
};
exports.default = (0, react_1.forwardRef)(TodayButton);
