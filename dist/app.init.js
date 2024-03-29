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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appInit = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
// const routes = require('./routes/index')
const server = (0, express_1.default)();
function appInit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("init app ...");
            //middleware
            server.use(body_parser_1.default.json());
            server.use(body_parser_1.default.urlencoded({ extended: false }));
            server.use((0, morgan_1.default)("dev"));
            server.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", process.env.CLIENT_ENDPOINT);
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
                next();
            });
            // server.use('/', routes)
        }
        catch (error) {
            throw error;
        }
    });
}
exports.appInit = appInit;
module.exports = server;
