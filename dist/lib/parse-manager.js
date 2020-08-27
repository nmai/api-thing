"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ParseManager = void 0;
var axios_1 = __importDefault(require("axios"));
var node_html_parser_1 = require("node-html-parser");
var ParseManager = /** @class */ (function () {
    function ParseManager() {
    }
    /** expects url to be decoded already */
    ParseManager.parseFromUrl = function (url) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var res, parsed, htmlNode, headNode, bodyNode, titleNode, descriptionNode, iconNode;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get(url)];
                    case 1:
                        res = _h.sent();
                        parsed = node_html_parser_1.parse(res.data);
                        htmlNode = parsed.childNodes.find(function (n) { return n.tagName == 'html'; });
                        headNode = htmlNode.childNodes.find(function (n) { return n.tagName == 'head'; });
                        bodyNode = htmlNode.childNodes.find(function (n) { return n.tagName == 'body'; });
                        titleNode = headNode.childNodes.find(function (n) { return n.tagName == 'title'; });
                        descriptionNode = headNode.childNodes.find(function (n) { var _a; return n.tagName == 'meta' && ((_a = n.attributes) === null || _a === void 0 ? void 0 : _a['name']) == 'description'; });
                        iconNode = headNode.childNodes.find(function (n) { var _a; return n.tagName == 'link' && ((_a = n.attributes) === null || _a === void 0 ? void 0 : _a['rel']) == 'icon'; });
                        return [2 /*return*/, {
                                title: (_a = titleNode === null || titleNode === void 0 ? void 0 : titleNode.text) !== null && _a !== void 0 ? _a : 'No title found',
                                snippet: (_d = (_c = (_b = descriptionNode) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c['content']) !== null && _d !== void 0 ? _d : 'No description found',
                                favicon: (_g = (_f = (_e = iconNode) === null || _e === void 0 ? void 0 : _e.attributes) === null || _f === void 0 ? void 0 : _f['href']) !== null && _g !== void 0 ? _g : (new URL(url)).origin + "/favicon.ico"
                            }];
                }
            });
        });
    };
    return ParseManager;
}());
exports.ParseManager = ParseManager;
