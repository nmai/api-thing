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
exports.allRouter = void 0;
var express_1 = __importDefault(require("express"));
var file_manager_1 = require("../lib/file-manager");
var parse_manager_1 = require("../lib/parse-manager");
var translate_manager_1 = require("../lib/translate-manager");
var user_manager_1 = require("../lib/user-manager");
var auth_1 = require("../middleware/auth");
var router = express_1["default"].Router();
exports.allRouter = router;
/**
 * Create a new user account. Returns some basic info about the newly created user, but no token.
 */
router.post('/register/:username/:password', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, ref, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_manager_1.UserManager.createUser(req.params['username'], req.params['password'])];
            case 1:
                user = _a.sent();
                ref = { id: user.id, username: user.username };
                res.send(ref);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                next(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Returns some basic info about the user, and a JWT which can be used in a bearer token.
 */
router.post('/login/:username/:password', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_manager_1.UserManager.loginWithCredentials(req.params['username'], req.params['password'])];
            case 1:
                data = _a.sent();
                res.send(data);
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                next(e_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/** Routes below require the JWT authorization token */
router.get('/parse/:url', auth_1.AuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedUrl, data, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                parsedUrl = decodeURIComponent(req.params['url']);
                return [4 /*yield*/, parse_manager_1.ParseManager.parseFromUrl(parsedUrl)];
            case 1:
                data = _a.sent();
                res.send(data);
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                next(e_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/translate/:url', auth_1.AuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedUrl, data, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                parsedUrl = decodeURIComponent(req.params['url']);
                return [4 /*yield*/, translate_manager_1.TranslateManager.translateFromUrl(parsedUrl)];
            case 1:
                data = _a.sent();
                res.send(data);
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                next(e_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Looks for the file under the 'file' field of form data.
 * The returned identifier includes original file extension, but it's not the
 * original filename - all uploads are uniquely saved.
*/
router.post('/upload', auth_1.AuthMiddleware, file_manager_1.uploader.single('file'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, response, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, file_manager_1.FileManager.processUpload(req.file)];
            case 1:
                identifier = _a.sent();
                response = {
                    identifier: identifier
                };
                res.send(response);
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                next(e_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/download/:identifier', auth_1.AuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, stream, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                identifier = req.params['identifier'];
                res.attachment(identifier);
                return [4 /*yield*/, file_manager_1.FileManager.getFilestream(identifier)];
            case 1:
                stream = _a.sent();
                stream.pipe(res);
                return [3 /*break*/, 3];
            case 2:
                e_6 = _a.sent();
                next(e_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
