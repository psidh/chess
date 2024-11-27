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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
}));
app.use(express_1.default.json());
app.post('/api/auth/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log('email: ' + email);
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        let newUser;
        if (user) {
            console.log(user);
            return res
                .status(201)
                .json({ message: 'Logged In Successfully', status: 201 });
        }
        else {
            newUser = yield prisma.user.create({
                data: {
                    email: email,
                    createdAt: new Date(),
                },
            });
            console.log(newUser);
            return res
                .status(201)
                .json({ message: 'Created Account Successfully', user: newUser });
        }
    }
    catch (error) {
        console.log('Error: ' + error);
        return res
            .status(500)
            .json({ message: 'Internal server error', error: error.message });
    }
}));
app.listen(3002, () => {
    console.log('Backend listening at 3002');
});
