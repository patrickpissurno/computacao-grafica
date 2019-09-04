class Face {
    /** @param {number[]} vertices */
    constructor(vertices) {
        this.vertices = vertices;
    }
}

class Model {
    /**
     * @param {number[]} vertices 
     * @param {Face[]} faces 
     */
    constructor(vertices, faces){
        this.faces = faces;
    }
}

class Object {
    /** @param {Model} model */
    constructor(model){
        this.model = model;
    }
}

const cuboVertices = [
    //face traseira
    [0,0,0],
    [1,0,0],
    [1,1,0],
    [0,1,0],

    //face frontal
    [0,0,1],
    [1,0,1],
    [1,1,1],
    [0,1,1],

    //face superior
    // [0,0,0], //0
    // [1,0,0], //1
    // [1,0,1], //5
    // [0,0,1], //4

    //face inferior
    // [0,1,0], //3
    // [1,1,0], //2
    // [1,1,1], //6
    // [0,1,1], //7

    //face esquerda
    // [0,0,0], //0
    // [0,0,1], //4
    // [0,1,1], //7
    // [0,1,0], //3

    // //face direita
    // [1,0,0], //1
    // [1,0,1], //5
    // [1,1,1], //6
    // [1,1,0], //2
];
const cuboModel = new Model(cuboVertices, [
    new Face([ //face traseira
        cuboVertices[0],
        cuboVertices[1],
        cuboVertices[2],
        cuboVertices[3],
    ]),
    new Face([ //face frontal
        cuboVertices[4],
        cuboVertices[5],
        cuboVertices[6],
        cuboVertices[7],
    ]),
    new Face([ //face superior
        cuboVertices[0],
        cuboVertices[1],
        cuboVertices[5],
        cuboVertices[4],
    ]),
    new Face([ //face inferior
        cuboVertices[3],
        cuboVertices[2],
        cuboVertices[6],
        cuboVertices[7],
    ]),
    new Face([ //face esquerda
        cuboVertices[0],
        cuboVertices[4],
        cuboVertices[7],
        cuboVertices[3],
    ]),
    new Face([ //face direita
        cuboVertices[1],
        cuboVertices[5],
        cuboVertices[6],
        cuboVertices[2],
    ]),
]);

const canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// function desenharQuadrado(){
//     ctx.beginPath();
//     ctx.moveTo(100, 100);
//     ctx.lineTo(200, 100);
//     ctx.lineTo(200, 200);
//     ctx.lineTo(100, 200);
//     ctx.fill();
// }

// desenharQuadrado();

/** @param {Model} model */
function drawModel(model, scale = 1, offset_x = 0, offset_y = 0){
    for(let face of model.faces){
        ctx.beginPath();
        for(let vertex of face.vertices)
            ctx.lineTo(offset_x + vertex[0] * scale, offset_y + vertex[1] * scale);
        ctx.stroke();
    }
}

drawModel(cuboModel, 100, 800/2 - 100/2, 600/2 - 100/2);