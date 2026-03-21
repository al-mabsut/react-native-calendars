"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarNavigationTypes = exports.UpdateSources = exports.todayString = void 0;
exports.todayString = 'today';
var UpdateSources;
(function (UpdateSources) {
    UpdateSources["CALENDAR_INIT"] = "calendarInit";
    UpdateSources["PROP_UPDATE"] = "propUpdate";
    UpdateSources["TODAY_PRESS"] = "todayPress";
    UpdateSources["DAY_PRESS"] = "dayPress";
    UpdateSources["ARROW_PRESS"] = "arrowPress";
    UpdateSources["WEEK_ARROW_PRESS"] = "weekArrowPress";
    UpdateSources["LIST_DRAG"] = "listDrag";
    UpdateSources["PAGE_SCROLL"] = "pageScroll";
    UpdateSources["WEEK_SCROLL"] = "weekScroll";
})(UpdateSources = exports.UpdateSources || (exports.UpdateSources = {}));
var CalendarNavigationTypes;
(function (CalendarNavigationTypes) {
    CalendarNavigationTypes["AGENDA_SCROLL"] = "listDrag";
    CalendarNavigationTypes["MONTH_SCROLL"] = "pageScroll";
    CalendarNavigationTypes["WEEK_SCROLL"] = "weekScroll";
    CalendarNavigationTypes["MONTH_ARROWS"] = "arrowPress";
    CalendarNavigationTypes["WEEK_ARROWS"] = "weekArrowPress";
    CalendarNavigationTypes["TODAY_PRESS"] = "todayPress";
})(CalendarNavigationTypes = exports.CalendarNavigationTypes || (exports.CalendarNavigationTypes = {}));
