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

function getProjectionMatrix(angleOfView, nearPlane, farPlane){
    const scale = 1 / Math.tan(angleOfView * 0.5 * Math.PI / 180);
    return [
        [scale, 0, 0, 0],
        [0, scale, 0, 0],
        [0, 0, -farPlane / (farPlane - nearPlane), -1],
        [0, 0, -farPlane * nearPlane / (farPlane - nearPlane), 0],
    ];
}

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

    static import(raw){
        let vmap = {};
        let vertices = [];
        let faces = [];
        for(let face of raw.faces){
            let f = [];
            for(let item of face.v){
                const key = item.join('');
                if(vmap[key] == null){
                    vmap[key] = vertices.length;
                    vertices.push(item);
                }

                f.push(vmap[key]);
            }
            faces.push(new Face(f));
        }
        return new Model(vertices, faces);
    }
}

class Obj {
    /** @param {Model} model */
    constructor(model){
        this.originalModel = model;
        this.model = JSON.parse(JSON.stringify(model)); //clona
    }
    apply(transformationMatrix){
        for(let vertice of this.model.vertices)
            vertice.push(1); //adiciona a coordenada homogênea

        let resultado = multiplyMatrices(this.model.vertices, transformationMatrix);

        for(let i = 0; i < resultado.length; i++)
        for(let j = 0; j < resultado[i].length; j++)
            this.model.vertices[i][j] = resultado[i][j] / resultado[i][3]; //atualiza normalizando pela homogênea
    
        for(let vertice of this.model.vertices)
            vertice.pop(); //remove a coordenada homogênea
    }
}

const myObj = new Obj(Model.import(window.model));
window.myObj = myObj;

const canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** @param {Obj} obj */
function renderObj(obj, scale = 1, offset_x = 0, offset_y = 0){
    ctx.clearRect(0, 0, 800, 600); //limpa a tela

    /** @type {Model} */
    const copy = JSON.parse(JSON.stringify(obj.model)); //isso aqui está clonando o model

    for(let vertice of copy.vertices)
        vertice.push(1); //adiciona a coordenada homogênea

    // let perspectiva = multiplyMatrices(copy.vertices, [
    //     [ 0.707,  0.408, 0, 0 ],
    //     [ 0,      0.816, 0, 0 ],
    //     [ 0.707, -0.408, 0, 0 ],
    //     [ 0,      0,     0, 1 ],
    // ]);

    let perspectiva = multiplyMatrices(copy.vertices, [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0.3,-1.7,-2.5,0],
    ]);
    perspectiva = multiplyMatrices(perspectiva, getProjectionMatrix(60, 0.1, 100));
    
    for(let i = 0; i < perspectiva.length; i++)
    for(let j = 0; j < perspectiva[i].length; j++)
        perspectiva[i][j] = perspectiva[i][j] / perspectiva[i][3]; //normaliza pela coordenada homogênea

    let projetado = multiplyMatrices(perspectiva, [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1],
    ]);

    for(let i = 0; i < projetado.length; i++)
    for(let j = 0; j < projetado[i].length; j++)
        copy.vertices[i][j] = projetado[i][j];

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
            ctx.lineTo(offset_x + vertex[0] * scale, offset_y - vertex[1] * scale);
        }

        ctx.strokeStyle = colors[colorIndex++];
        ctx.stroke();
    }

    window.copy = copy; //somente para debug
}

// renderObj(myObj, 100, 800/2 - 100/2, 600/2 + 100/2);
renderObj(myObj, 100, 800/2, 600/2);