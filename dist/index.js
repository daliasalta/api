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
const app = require("./index");
const mongoose_1 = __importDefault(require("mongoose"));
const app_init_1 = require("./app.init");
mongoose_1.default.connect("mongodb+srv://sanchezzfacu:DsDhF2DPo1QK2K6D@cluster0.dttsawj.mongodb.net/?retryWrites=true&w=majority", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
});
app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("starting server...");
    try {
        yield (0, app_init_1.appInit)();
        // console.log(`<------------- server listening at ${process.env.PORT || 3001} ------------->`);
    }
    catch (_a) {
    }
}));
