class Face {
    /** @param {number[]} verticesIndices */
    constructor(verticesIndices) {
        this.vertices = verticesIndices;
    }
}

class Model {
    /**
     * @param {number[]} vertices 
     * @param {Face[]} faces 
     */
    constructor(vertices, faces){
        this.vertices = vertices;
        this.faces = faces;
    }
}

class Object {
    /** @param {Model} model */
    constructor(model){
        this.model = model;
    }
}

function multiplyMatrices(m1, m2) {
    const result = [];
    for (let i = 0; i < m1.length; i++) {
        result[i] = [];

        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            for (var k = 0; k < m1[0].length; k++)
                sum += m1[i][k] * m2[k][j];

            result[i][j] = sum;
        }
    }
    return result;
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
        0,
        1,
        2,
        3,
    ]),
    new Face([ //face frontal
        4,
        5,
        6,
        7,
    ]),
    new Face([ //face superior
        0,
        1,
        5,
        4,
    ]),
    new Face([ //face inferior
        3,
        2,
        6,
        7,
    ]),
    new Face([ //face esquerda
        0,
        4,
        7,
        3,
    ]),
    new Face([ //face direita
        1,
        5,
        6,
        2,
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
function renderModel(model, scale = 1, offset_x = 0, offset_y = 0){
    /** @type {Model} */
    const copy = JSON.parse(JSON.stringify(model));

    for(let vertice of copy.vertices)
        vertice.push(1); //adiciona a coordenada homogênea

    let projetado = multiplyMatrices(copy.vertices, [
        [ 0.707,  0.408, 0, 0 ],
        [ 0,      0.816, 0, 0 ],
        [ 0.707, -0.408, 0, 0 ],
        [ 0,      0,     0, 1 ],
    ]);

    for(let i = 0; i < projetado.length; i++)
    for(let j = 0; j < projetado[i].length; j++)
        copy.vertices[i][j] = projetado[i][j];

    //TODO: tentar fazer um algorítimo para ordenar as faces antes de renderizar (da mais longe para a mais perto)
    // copy.faces.sort((a, b) => {
    //     const verticesA = a.vertices.map(i => copy.vertices[i]);
    //     const verticesB = b.vertices.map(i => copy.vertices[i]);

    //     const avgA = verticesA.reduce((acc, v) => [
    //         acc[0] + v[0],
    //         acc[1] + v[1],
    //         acc[2] + v[2]
    //     ], [0, 0, 0]).map(x => x / verticesA.length);

    //     const avgB = verticesB.reduce((acc, v) => [
    //         acc[0] + v[0],
    //         acc[1] + v[1],
    //         acc[2] + v[2]
    //     ], [0, 0, 0]).map(x => x / verticesB.length);

    //     console.log({ avgA, avgB });

    //     return Math.sign(avgB[1] - avgA[1]);
    // });

    const colors = [
        'red',
        'yellow',
        'blue',
        'magenta',
        'green',
        'black'
    ];

    let colorIndex = 0;

    for(let face of copy.faces){
        ctx.beginPath();

        for(let n = 0; n < face.vertices.length + 1; n++){
            const v = face.vertices[n % face.vertices.length];
            const vertex = copy.vertices[v];
            ctx.lineTo(offset_x + vertex[0] * scale, offset_y + vertex[1] * scale);
        }

        // ctx.fillStyle = colors[colorIndex++];
        // ctx.fill();
        ctx.strokeStyle = colors[colorIndex++];
        ctx.stroke();
    }

    window.copy = copy;
}

renderModel(cuboModel, 100, 800/2 - 100/2, 600/2 - 100/2);