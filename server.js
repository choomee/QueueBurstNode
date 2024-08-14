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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerApp = void 0;
var dotenv = require("dotenv");
var express = require("express");
var database_1 = require("./database");
var winston = require("winston");
var DailyRotateFile = require("winston-daily-rotate-file");
var moment = require("moment");
var ServerApp = /** @class */ (function () {
    function ServerApp() {
        dotenv.config();
        // console.log('constructor #1');
        // console.log('User :'+String(process.env.USER_NAME));
        // console.log('PASSWORD :'+String(process.env.PASSWORD));
        // console.log('CONNECTION_STRING :'+String(process.env.CONNECTION_STRING));
        var transport = new DailyRotateFile({
            filename: 'qbursting-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
            dirname: './logs',
            json: false,
        });
        var logFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.align(), winston.format.printf(function (info) { return moment(info.timestamp).utc().utcOffset("+0700").format() + '-' + info.level + '-message:' + info.message; }));
        transport.on('rotate', function (oldFilename, newFilename) {
            // do something fun
        });
        this.logger = winston.createLogger({
            format: logFormat,
            transports: [
                transport
            ]
        });
        this.app = express();
        // var server = this.app.listen(8000, '127.0.0.1', function () {  
        //   var host = server.address().address ;
        //   var port = server.address().port;
        //   // this.logger.info('APP listening at http://'+host+':'+port+'/get_item?item=800800' ) ;
        // });  
    }
    ServerApp.prototype.start = function () {
        var _this = this;
        var server = this.app.listen(process.env.PORT, '127.0.0.1', function () {
            var host = server.address().address;
            var port = server.address().port;
            _this.logger.info('APP listening at http://' + host + ':' + port + '/get_item?item=800800');
        });
    };
    ServerApp.prototype.getItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.app.get('/get_item', function (req, res) {
                    var data = new database_1.Database();
                    data.getItem(req.query['item']).then(function (obj) { return res.send(obj); });
                });
                return [2 /*return*/];
            });
        });
    };
    ServerApp.prototype.getCountItemUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.app.get('/get_cntitem', function (req, res) {
                    var data = new database_1.Database();
                    data.getCntItemUpdate().then(function (obj) { return res.send(obj); });
                });
                return [2 /*return*/];
            });
        });
    };
    ServerApp.prototype.getListItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.app.get('/get_listitem', function (req, res) {
                    var data = new database_1.Database();
                    var start_ind;
                    var volumn;
                    start_ind = req.query['start_ind'];
                    volumn = req.query['volumn'];
                    if (start_ind == undefined) {
                        start_ind = "0";
                    }
                    if (volumn == undefined) {
                        volumn = "0";
                    }
                    // console.log("start_ind :"+start_ind);
                    data.getListItem(Number(start_ind), Number(volumn)).then(function (obj) { return res.send(obj); });
                });
                return [2 /*return*/];
            });
        });
    };
    return ServerApp;
}());
exports.ServerApp = ServerApp;
var serverApp = new ServerApp();
serverApp.start();
serverApp.getItem();
serverApp.getCountItemUpdate();
serverApp.getListItem();
