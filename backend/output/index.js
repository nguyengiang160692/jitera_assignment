"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Create expressjs application
const express_1 = __importDefault(require("express"));
const routers_1 = __importDefault(require("./routers"));
const mongoose_1 = __importDefault(require("mongoose"));
const process_1 = require("process");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3005; // default port to listen;
console.log('App going to load on port', port);
// connect database mongodb
const db_username = process.env.MONGO_USERNAME;
const db_password = process.env.MONGO_PASSWORD;
const db_host = process.env.MONGO_HOST;
const db_port = process.env.MONGO_PORT;
const db_source = process.env.MONGO_SOURCE;
const mongoUri = `mongodb://${db_username}:${db_password}@${db_host}:${db_port}/${db_source}`;
mongoose_1.default.connect(mongoUri, {}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    if (err) {
        console.log('Error', err);
        process_1.exit;
    }
});
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
//# sourceMappingURL=index.js.map