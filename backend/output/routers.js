"use strict";
//Create route files
// Path: backend/routers.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('Hi there! again!');
});
exports.default = router;
//# sourceMappingURL=routers.js.map