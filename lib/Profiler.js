"use strict";
// @ts-nocheck
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
exports.logProfileData = exports.getProfileData = void 0;
// Taken from
// https://medium.com/life-at-paperless/how-to-use-the-react-profiler-component-to-measure-performance-improvements-from-hooks-d43b7092d7a8
// Profiler callback
// https://reactjs.org/docs/profiler.html#onrender-callback
const react_1 = __importStar(require("react"));
// The entire render time since execution of this file (likely on page load)
const cumulativeDuration = {};
class Profiler extends react_1.default.Component {
    onRender = (...profileData) => {
        (0, exports.logProfileData)((0, exports.getProfileData)(profileData));
    };
    render() {
        const { children, id } = this.props;
        return (<react_1.Profiler id={id} onRender={this.onRender}>
        {children}
      </react_1.Profiler>);
    }
}
exports.default = Profiler;
// TODO: fix typescript...
const getProfileData = ([id, // the "id" prop of the Profiler tree that has just committed
phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
actualDuration, // time spent rendering the committed update
baseDuration, // estimated time to render the entire subtree without memoization
startTime, // when React began rendering this update
commitTime, // when React committed this update
interactions // the Set of interactions belonging to this update
]) => {
    cumulativeDuration[id] = Number(((cumulativeDuration[id] ?? 0) + actualDuration).toFixed(2));
    return {
        id,
        interactions,
        phase,
        actualDuration: Number(actualDuration.toFixed(2)),
        baseDuration: Number(baseDuration.toFixed(2)),
        commitTime: Number(commitTime.toFixed(2)),
        cumulativeDuration: cumulativeDuration[id],
        startTime: Number(startTime.toFixed(2))
    };
};
exports.getProfileData = getProfileData;
const logProfileData = ({ id, actualDuration, cumulativeDuration, phase }) => {
    console.group(phase);
    // table did not work for me so I used log instead
    console.log(id, ':', actualDuration, cumulativeDuration);
    // console.table({
    //   actualDuration,
    //   baseDuration,
    //   cumulativeDuration
    // });
    console.groupEnd();
};
exports.logProfileData = logProfileData;
