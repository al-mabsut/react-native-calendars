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
exports.KNOB_CONTAINER_HEIGHT = void 0;
const react_native_1 = require("react-native");
const defaultStyle = __importStar(require("../style"));
const constants_1 = __importDefault(require("../commons/constants"));
exports.KNOB_CONTAINER_HEIGHT = 24;
function styleConstructor(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    return react_native_1.StyleSheet.create({
        containerShadow: {
            backgroundColor: appStyle.calendarBackground,
            ...react_native_1.Platform.select({
                ios: {
                    shadowColor: '#858F96',
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                    shadowOffset: { height: 2, width: 0 },
                    zIndex: 99
                },
                android: {
                    elevation: 3
                }
            })
        },
        containerWrapper: {
            paddingBottom: 6
        },
        container: {
            backgroundColor: appStyle.calendarBackground
        },
        knobContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: exports.KNOB_CONTAINER_HEIGHT,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appStyle.calendarBackground
        },
        knob: {
            width: 40,
            height: 4,
            borderRadius: 3,
            backgroundColor: appStyle.expandableKnobColor
        },
        sectionText: {
            fontWeight: 'bold',
            fontSize: 12,
            lineHeight: 16,
            color: '#7a92a5',
            paddingTop: 24,
            paddingBottom: 8,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: appStyle.calendarBackground,
            textAlign: 'left',
            textTransform: 'uppercase'
        },
        header: {
            position: 'absolute',
            left: 0,
            right: 0,
            backgroundColor: appStyle.calendarBackground
        },
        headerTitle: {
            alignSelf: 'center',
            paddingTop: 13,
            paddingBottom: 18,
            fontSize: appStyle.textMonthFontSize,
            fontFamily: appStyle.textMonthFontFamily,
            fontWeight: appStyle.textMonthFontWeight,
            color: appStyle.monthTextColor
        },
        weekDayNames: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        dayHeader: {
            width: 32,
            textAlign: 'center',
            fontSize: appStyle.textDayHeaderFontSize,
            fontFamily: appStyle.textDayHeaderFontFamily,
            fontWeight: appStyle.textDayHeaderFontWeight,
            color: appStyle.textSectionTitleColor
        },
        monthView: {
            backgroundColor: appStyle.calendarBackground
        },
        weekContainer: {
            position: 'absolute',
            left: 0,
            right: 0
        },
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
        weekCalendar: {
            marginTop: 12,
            marginBottom: -2
        },
        week: {
            marginTop: 7,
            marginBottom: 7,
            paddingRight: 15,
            paddingLeft: 15,
            flexDirection: 'row',
            justifyContent: 'space-around'
        },
        partialWeek: {
            paddingRight: 0
        },
        dayContainer: {
            flex: 1,
            alignItems: 'center'
        },
        emptyDayContainer: {
            flex: 1
        },
        arrowImage: {
            tintColor: appStyle.arrowColor,
            transform: constants_1.default.isRTL ? [{ scaleX: -1 }] : undefined
        },
        contextWrapper: {
            flex: 1
        },
        todayButtonContainer: {
            alignItems: appStyle.todayButtonPosition === 'right' ? 'flex-end' : 'flex-start',
            position: 'absolute',
            left: 20,
            bottom: 0
        },
        todayButton: {
            height: constants_1.default.isTablet ? 40 : 28,
            paddingHorizontal: constants_1.default.isTablet ? 20 : 12,
            borderRadius: constants_1.default.isTablet ? 20 : 14,
            flexDirection: appStyle.todayButtonPosition === 'right' ? 'row-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            ...react_native_1.Platform.select({
                ios: {
                    shadowColor: '#79838A',
                    shadowOpacity: 0.3,
                    shadowRadius: 14,
                    shadowOffset: { height: 6, width: 0 }
                },
                android: {
                    elevation: 6
                }
            })
        },
        todayButtonText: {
            color: appStyle.todayButtonTextColor,
            fontSize: constants_1.default.isTablet ? appStyle.todayButtonFontSize + 2 : appStyle.todayButtonFontSize,
            fontWeight: appStyle.todayButtonFontWeight,
            fontFamily: appStyle.todayButtonFontFamily
        },
        todayButtonImage: {
            tintColor: appStyle.todayButtonTextColor,
            marginLeft: appStyle.todayButtonPosition === 'right' ? 7 : undefined,
            marginRight: appStyle.todayButtonPosition === 'right' ? undefined : 7
        },
        ...(theme?.stylesheet?.expandable?.main || {})
    });
}
exports.default = styleConstructor;
