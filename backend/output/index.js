"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Create expressjs application
const express_1 = __importDefault(require("express"));
const routers_1 = __importDefault(require("./routers"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3005; // default port to listen;
console.log('App going to load on port', port);
app.get('/', (req, res) => {
    res.send('Hi there!');
});
// more middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', routers_1.default);
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
exports.default = app;
