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
exports.Database = void 0;
var oracledb = require("oracledb");
var dotenv = require("dotenv");
var Database = /** @class */ (function () {
    function Database() {
        dotenv.config();
        // console.log('constructor #1');
        // console.log('User :'+String(process.env.USER_NAME));
        // console.log('PASSWORD :'+String(process.env.PASSWORD));
        // console.log('CONNECTION_STRING :'+String(process.env.CONNECTION_STRING));
    }
    Database.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, oracledb.createPool({
                                user: String(process.env.USER_NAME) || 'SMART_QA_PROJECT_D',
                                password: String(process.env.PASSWORD) || 'Quadel#23', // myhrpw contains the hr schema password
                                connectString: String(process.env.CONNECTION_STRING) || 'sml-np-scan:1521/MOMUAT',
                                poolMin: 2,
                                poolMax: 30,
                                poolIncrement: 2
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log('Error: ', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.getItem = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, Item_Master, Item, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, oracledb.getConnection()];
                    case 2:
                        connection = _a.sent();
                        sql = "SELECT qim.ITEM , qb.BARCODE , qim.ITEM_DESC , qim.LAST_UPDATE_DATETIME  FROM rms.QB_ITEM_MASTER qim , rms.QB_BARCODE qb \
        WHERE qim.ITEM =qb.ITEM(+)  \
        AND ( qim.item='" + item + "' OR qb.barcode = '" + item + "')";
                        return [4 /*yield*/, connection.execute(sql)];
                    case 3:
                        result = _a.sent();
                        // console.log("Result :"+JSON.stringify(result));
                        return [4 /*yield*/, connection.close()];
                    case 4:
                        // console.log("Result :"+JSON.stringify(result));
                        _a.sent();
                        Item_Master = new Object();
                        Item = new Object();
                        if (result.rows[0] != null) {
                            Item_Master['ITEM_NO'] = result.rows[0][0];
                            Item_Master['BARCODE'] = result.rows[0][1];
                            Item_Master['ITEM_DESC'] = result.rows[0][2];
                            Item_Master['UPDATE_DATETIME'] = result.rows[0][3];
                            Item['ITEM_MASTER'] = Item_Master;
                        }
                        return [2 /*return*/, Item];
                }
            });
        });
    };
    Database.prototype.getCntItemUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection, Item_Update, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, oracledb.getConnection()];
                    case 2:
                        connection = _a.sent();
                        sql = "SELECT count(*) , max(( CASE WHEN qb.LAST_UPDATE_DATETIME > qim.LAST_UPDATE_DATETIME \
            THEN qb.LAST_UPDATE_DATETIME ELSE qim.LAST_UPDATE_DATETIME END)) LAST_UPDATE  \
            FROM rms.QB_ITEM_MASTER qim , rms.QB_BARCODE qb \
            WHERE qim.ITEM =qb.ITEM";
                        return [4 /*yield*/, connection.execute(sql)];
                    case 3:
                        result = _a.sent();
                        // console.log("Result :"+JSON.stringify(result));
                        return [4 /*yield*/, connection.close()];
                    case 4:
                        // console.log("Result :"+JSON.stringify(result));
                        _a.sent();
                        Item_Update = new Object();
                        if (result.rows[0] != null) {
                            Item_Update['CNT'] = result.rows[0][0];
                            Item_Update['LAST_UPDATE'] = result.rows[0][1];
                        }
                        return [2 /*return*/, Item_Update];
                }
            });
        });
    };
    Database.prototype.getListItem = function (start_ind, volumn) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, Item_Master, Item, row_resturn, sql, result, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Item = [];
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, oracledb.getConnection()];
                    case 2:
                        connection = _a.sent();
                        row_resturn = start_ind + volumn - 1;
                        sql = "SELECT * FROM ( \
            SELECT qim.ITEM , qb.BARCODE , qim.ITEM_DESC , \
            ( CASE WHEN qb.LAST_UPDATE_DATETIME > qim.LAST_UPDATE_DATETIME THEN qb.LAST_UPDATE_DATETIME ELSE qim.LAST_UPDATE_DATETIME END) AS UPDATE_DATE, \
            rownum row_n \
            FROM rms.QB_ITEM_MASTER qim , rms.QB_BARCODE qb  \
            WHERE qim.ITEM =qb.ITEM  \
            ORDER BY ( CASE WHEN qb.LAST_UPDATE_DATETIME > qim.LAST_UPDATE_DATETIME THEN qb.LAST_UPDATE_DATETIME ELSE qim.LAST_UPDATE_DATETIME END), item, barcode DESC  \
            )WHERE row_n BETWEEN " + start_ind + " AND " + row_resturn + " order by row_n asc";
                        return [4 /*yield*/, connection.execute(sql)];
                    case 3:
                        result = _a.sent();
                        // console.log("Result :"+JSON.stringify(result));
                        return [4 /*yield*/, connection.close()];
                    case 4:
                        // console.log("Result :"+JSON.stringify(result));
                        _a.sent();
                        Item_Master = new Object();
                        if (!result || !result.rows || !result.rows.length) {
                            Item_Master['item_master'] = null;
                        }
                        else {
                            for (i = 0; i < result.rows.length; i++) {
                                Item.push({ item_no: result.rows[i][0], barcode: result.rows[i][1], item_desc: result.rows[i][2], update_datetime: result.rows[i][3], row_n: result.rows[i][4] });
                            }
                            Item_Master['item_master'] = Item;
                        }
                        return [2 /*return*/, Item_Master];
                }
            });
        });
    };
    return Database;
}());
exports.Database = Database;
// let data = new Database();
// data.getItem('2500008004928').then( obj => console.log( JSON.stringify(obj)));
// await oracledb.createPool({
//     user: 'hr',
//     password: myhrpw,  // myhrpw contains the hr schema password
//     connectString: 'localhost/XEPDB1',
//     poolAlias: 'hrpool'
//   });
//   await oracledb.createPool({
//     user: 'sh',
//     password: myshpw,  // myshpw contains the sh schema password
//     connectString: 'otherhost/OTHERDB',
//     poolAlias: 'shpool'
//   });
//   const connection = await oracledb.getConnection('hrpool');
//   const result = await connection.execute(
//         `SELECT manager_id, department_id, department_name
//          FROM departments
//          WHERE manager_id = :id`,
//         [103],  // bind value for :id
//       );
//       console.log(result.rows);
