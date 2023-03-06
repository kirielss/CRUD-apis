"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_json_1 = __importDefault(require("./data.json"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const ajv_1 = __importDefault(require("ajv"));
const app = (0, express_1.default)();
const ajv = new ajv_1.default();
const port = process.env.PORT || 8080;
const userSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        email: { type: 'string' },
    },
    required: ['name', 'email'],
    additionalProperties: false,
};
const validate = ajv.compile(userSchema);
const corsOptions = {
    origin: '*',
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.get('/api/users', (req, res) => {
    res.send(data_json_1.default.users.map((user) => {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }));
});
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    const valid = validate(newUser);
    if (!valid) {
        res.status(400).json({ error: validate.errors });
    }
    else {
        newUser.id = data_json_1.default.users.length + 1;
        data_json_1.default.users.push(newUser);
        res.status(201).json(newUser);
    }
});
app.put("/api/users/:id", (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = data_json_1.default.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Usuario não encontrado' });
    }
    else {
        const newUser = req.body;
        newUser.id = userId;
        data_json_1.default.users[userIndex] = newUser;
        res.status(200).json(newUser);
    }
});
app.delete('/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = data_json_1.default.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Usuario não encontrado' });
    }
    else {
        data_json_1.default.users.splice(userIndex, 1);
        res.status(204).send('Usuario deletado');
    }
});
app.get('/api/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = data_json_1.default.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
    else {
        res.json(data_json_1.default.users[userIndex]);
    }
});
app.listen(port, () => {
    console.log(`Servidor foi iniciado na porta ${port}`);
});
