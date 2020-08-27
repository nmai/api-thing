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
exports.UserManager = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var datastore_1 = require("@google-cloud/datastore");
var bcryptjs_1 = require("bcryptjs");
var uuid_1 = require("uuid");
var secret_manager_1 = require("@google-cloud/secret-manager");
var secretManager = new secret_manager_1.v1.SecretManagerServiceClient();
var datastore = new datastore_1.Datastore();
var UserManager = /** @class */ (function () {
    function UserManager() {
    }
    /** returns JWT auth token upon successful validation of credentials */
    UserManager.loginWithCredentials = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isPasswordValid, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getUserByUsername(username)];
                    case 1:
                        user = _b.sent();
                        if (user == null)
                            throw new Error('There are no users with that username');
                        return [4 /*yield*/, this.doesPasswordMatchHash(password, user.passwordHash)];
                    case 2:
                        isPasswordValid = _b.sent();
                        if (isPasswordValid == false)
                            throw new Error('Incorrect password');
                        _a = {
                            user: {
                                id: user.id,
                                username: user.username
                            }
                        };
                        return [4 /*yield*/, this.generateNewAuthToken(user)];
                    case 3: return [2 /*return*/, (_a.token = _b.sent(),
                            _a)];
                }
            });
        });
    };
    /** was useful during testing, but currently not exposed on any endpoint */
    UserManager.createUser = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, user, _a, key;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getUserByUsername(username)];
                    case 1:
                        existingUser = _b.sent();
                        if (existingUser)
                            throw new Error('That username is taken');
                        _a = {
                            id: uuid_1.v4(),
                            username: username
                        };
                        return [4 /*yield*/, this.hashPassword(password)];
                    case 2:
                        user = (_a.passwordHash = _b.sent(),
                            _a);
                        key = datastore.key(['user', user.id]);
                        return [4 /*yield*/, datastore.insert({ key: key, data: user, excludeFromIndexes: ['passwordHash'] })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserManager.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var key, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = datastore.key(['user', id]);
                        return [4 /*yield*/, datastore.get(key)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    // decode
    UserManager.getValidUserFromToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var decodedToken, _a, _b, _c, userId, user;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = jsonwebtoken_1["default"]).verify;
                        _c = [token];
                        return [4 /*yield*/, this.getTokenSecret()];
                    case 1:
                        decodedToken = _b.apply(_a, _c.concat([_d.sent()]));
                        userId = decodedToken.id;
                        // ensure the user id exists, and that it appears valid
                        if (typeof userId != 'string' || userId.length == 0) {
                            throw new Error('Failed to extract valid user from jwt');
                        }
                        return [4 /*yield*/, this.getUser(userId)];
                    case 2:
                        user = _d.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    // encode
    UserManager.generateNewAuthToken = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, signed, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        payload = {
                            id: user.id,
                            username: user.username
                        };
                        _b = (_a = jsonwebtoken_1["default"]).sign;
                        _c = [payload];
                        return [4 /*yield*/, this.getTokenSecret()];
                    case 1:
                        signed = _b.apply(_a, _c.concat([_d.sent(), { expiresIn: '1 day' }]));
                        return [2 /*return*/, signed];
                }
            });
        });
    };
    // helpers
    UserManager.hashPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.hash(password, 10)];
                    case 1: 
                    // hash the password with an automatically generated salt of length 10
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserManager.doesPasswordMatchHash = function (password, hash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.compare(password, hash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserManager.getUserByUsername = function (username) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var query, results;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = datastore.createQuery('user').filter('username', username);
                        return [4 /*yield*/, datastore.runQuery(query)];
                    case 1:
                        results = _b.sent();
                        return [2 /*return*/, (_a = results[0]) === null || _a === void 0 ? void 0 : _a[0]];
                }
            });
        });
    };
    /** caches the secret */
    UserManager.getTokenSecret = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._tokenSecret == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, secretManager.accessSecretVersion({ name: 'projects/115643477901/secrets/token_secret/versions/1' })];
                    case 1:
                        version = (_a.sent())[0];
                        this._tokenSecret = version.payload.data.toString();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this._tokenSecret];
                }
            });
        });
    };
    return UserManager;
}());
exports.UserManager = UserManager;
