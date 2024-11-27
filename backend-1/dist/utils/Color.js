"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColor = getColor;
function getColor() {
    return Math.random() > 0.5 ? ['white', 'black'] : ['black', 'white'];
}
