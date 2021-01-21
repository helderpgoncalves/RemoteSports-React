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
var tf = require("@tensorflow/tfjs-core");
function getBoxSize(box) {
    return [
        Math.abs(box.endPoint[0] - box.startPoint[0]),
        Math.abs(box.endPoint[1] - box.startPoint[1])
    ];
}
exports.getBoxSize = getBoxSize;
function getBoxCenter(box) {
    return [
        box.startPoint[0] + (box.endPoint[0] - box.startPoint[0]) / 2,
        box.startPoint[1] + (box.endPoint[1] - box.startPoint[1]) / 2
    ];
}
exports.getBoxCenter = getBoxCenter;
function cutBoxFromImageAndResize(box, image, cropSize) {
    var h = image.shape[1];
    var w = image.shape[2];
    var boxes = [[
            box.startPoint[1] / h, box.startPoint[0] / w, box.endPoint[1] / h,
            box.endPoint[0] / w
        ]];
    return tf.image.cropAndResize(image, boxes, [0], cropSize);
}
exports.cutBoxFromImageAndResize = cutBoxFromImageAndResize;
function scaleBoxCoordinates(box, factor) {
    var startPoint = [box.startPoint[0] * factor[0], box.startPoint[1] * factor[1]];
    var endPoint = [box.endPoint[0] * factor[0], box.endPoint[1] * factor[1]];
    var palmLandmarks = box.palmLandmarks.map(function (coord) {
        var scaledCoord = [coord[0] * factor[0], coord[1] * factor[1]];
        return scaledCoord;
    });
    return { startPoint: startPoint, endPoint: endPoint, palmLandmarks: palmLandmarks };
}
exports.scaleBoxCoordinates = scaleBoxCoordinates;
function enlargeBox(box, factor) {
    if (factor === void 0) { factor = 1.5; }
    var center = getBoxCenter(box);
    var size = getBoxSize(box);
    var newHalfSize = [factor * size[0] / 2, factor * size[1] / 2];
    var startPoint = [center[0] - newHalfSize[0], center[1] - newHalfSize[1]];
    var endPoint = [center[0] + newHalfSize[0], center[1] + newHalfSize[1]];
    return { startPoint: startPoint, endPoint: endPoint, palmLandmarks: box.palmLandmarks };
}
exports.enlargeBox = enlargeBox;
function squarifyBox(box) {
    var centers = getBoxCenter(box);
    var size = getBoxSize(box);
    var maxEdge = Math.max.apply(Math, size);
    var halfSize = maxEdge / 2;
    var startPoint = [centers[0] - halfSize, centers[1] - halfSize];
    var endPoint = [centers[0] + halfSize, centers[1] + halfSize];
    return { startPoint: startPoint, endPoint: endPoint, palmLandmarks: box.palmLandmarks };
}
exports.squarifyBox = squarifyBox;
function shiftBox(box, shiftFactor) {
    var boxSize = [
        box.endPoint[0] - box.startPoint[0], box.endPoint[1] - box.startPoint[1]
    ];
    var shiftVector = [boxSize[0] * shiftFactor[0], boxSize[1] * shiftFactor[1]];
    var startPoint = [box.startPoint[0] + shiftVector[0], box.startPoint[1] + shiftVector[1]];
    var endPoint = [box.endPoint[0] + shiftVector[0], box.endPoint[1] + shiftVector[1]];
    return { startPoint: startPoint, endPoint: endPoint, palmLandmarks: box.palmLandmarks };
}
exports.shiftBox = shiftBox;
//# sourceMappingURL=box.js.map