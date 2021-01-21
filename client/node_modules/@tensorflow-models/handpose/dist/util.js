"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
function normalizeRadians(angle) {
    return angle - 2 * Math.PI * Math.floor((angle + Math.PI) / (2 * Math.PI));
}
exports.normalizeRadians = normalizeRadians;
function computeRotation(point1, point2) {
    var radians = Math.PI / 2 - Math.atan2(-(point2[1] - point1[1]), point2[0] - point1[0]);
    return normalizeRadians(radians);
}
exports.computeRotation = computeRotation;
var buildTranslationMatrix = function (x, y) {
    return ([[1, 0, x], [0, 1, y], [0, 0, 1]]);
};
function dot(v1, v2) {
    var product = 0;
    for (var i = 0; i < v1.length; i++) {
        product += v1[i] * v2[i];
    }
    return product;
}
exports.dot = dot;
function getColumnFrom2DArr(arr, columnIndex) {
    var column = [];
    for (var i = 0; i < arr.length; i++) {
        column.push(arr[i][columnIndex]);
    }
    return column;
}
exports.getColumnFrom2DArr = getColumnFrom2DArr;
function multiplyTransformMatrices(mat1, mat2) {
    var product = [];
    var size = mat1.length;
    for (var row = 0; row < size; row++) {
        product.push([]);
        for (var col = 0; col < size; col++) {
            product[row].push(dot(mat1[row], getColumnFrom2DArr(mat2, col)));
        }
    }
    return product;
}
function buildRotationMatrix(rotation, center) {
    var cosA = Math.cos(rotation);
    var sinA = Math.sin(rotation);
    var rotationMatrix = [[cosA, -sinA, 0], [sinA, cosA, 0], [0, 0, 1]];
    var translationMatrix = buildTranslationMatrix(center[0], center[1]);
    var translationTimesRotation = multiplyTransformMatrices(translationMatrix, rotationMatrix);
    var negativeTranslationMatrix = buildTranslationMatrix(-center[0], -center[1]);
    return multiplyTransformMatrices(translationTimesRotation, negativeTranslationMatrix);
}
exports.buildRotationMatrix = buildRotationMatrix;
function invertTransformMatrix(matrix) {
    var rotationComponent = [[matrix[0][0], matrix[1][0]], [matrix[0][1], matrix[1][1]]];
    var translationComponent = [matrix[0][2], matrix[1][2]];
    var invertedTranslation = [
        -dot(rotationComponent[0], translationComponent),
        -dot(rotationComponent[1], translationComponent)
    ];
    return [
        rotationComponent[0].concat(invertedTranslation[0]),
        rotationComponent[1].concat(invertedTranslation[1]),
        [0, 0, 1]
    ];
}
exports.invertTransformMatrix = invertTransformMatrix;
function rotatePoint(homogeneousCoordinate, rotationMatrix) {
    return [
        dot(homogeneousCoordinate, rotationMatrix[0]),
        dot(homogeneousCoordinate, rotationMatrix[1])
    ];
}
exports.rotatePoint = rotatePoint;
//# sourceMappingURL=util.js.map