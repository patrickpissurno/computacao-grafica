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

    /**
     * realiza uma cópia profunda do objeto e seu conteúdo
     */
    clone(){
        const cloned = JSON.parse(JSON.stringify(this));
        return new Model(cloned.vertices, cloned.faces);
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

        //converte as coordenadas dos vértices do SRO para o SRU
        for(let vertice of vertices)
            for(let i = 0; i < vertice.length; i++)
                vertice[i] = (vertice[i] + raw.offset[i]) / raw.scale;
        return new Model(vertices, faces);
    }
}

class Obj {
    /** @param {Model} model */
    constructor(model){
        this.originalModel = model;
        this.model = model.clone(); //clona
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

const CAMERA_X = 0;
const CAMERA_Y = 0;
const CAMERA_Z = -2;

/** @param {Obj} obj */
function renderObj(obj, scale = 1, offset_x = 0, offset_y = 0){
    ctx.clearRect(0, 0, 800, 600); //limpa a tela

    /** @type {Model} */
    const copy = obj.model.clone();

    for(let vertice of copy.vertices)
        vertice.push(1); //adiciona a coordenada homogênea

    let m = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [CAMERA_X,CAMERA_Y,-CAMERA_Z,1],
    ];

    m = multiplyMatrices(m, getProjectionMatrix(20, 0.1, 100));

    let perspectiva = multiplyMatrices(copy.vertices, m);

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
        'lime',
        'magenta',
        'blue',
        'orange',
        'cyan',
        'red',
        'black',
    ];

    let colorIndex = 0;

    for(let face of copy.faces){
        ctx.beginPath();

        for(let n = 0; n < face.vertices.length + 1; n++){
            const v = face.vertices[n % face.vertices.length];
            const vertex = copy.vertices[v];
            ctx.lineTo(offset_x + -vertex[0] * scale, offset_y + vertex[1] * scale);
        }

        ctx.strokeStyle = colors[colorIndex++ % colors.length];
        ctx.stroke();
    }

    window.copy = copy; //somente para debug
}

let keyframe = -1;
/** @type {Model} */
let beforeModel = null;
/** @type {Model} */
let targetModel = null;
let frameStartTime = null;

function nextKeyframe(){
    if(targetModel != null)
        myObj.model = targetModel;

    keyframe += 1;
    if(keyframe >= window.animation.keyframes.length){
        if(window.animation.loop)
            keyframe = 0;
        else {
            keyframe = -1;
            return;
        }
    }

    const frame = window.animation.keyframes[keyframe];

    if(keyframe > 0){
        beforeModel = myObj.model.clone(); //clona o frame atual

        myObj.apply(frame.matrix);
        targetModel = myObj.model.clone(); //clona o frame alvo

        myObj.model = beforeModel.clone(); //restaura o frame atual
    }
    else { //no primeiro frame a gente não quer realizar interpolação (inbetweening)
        myObj.apply(frame.matrix);
        beforeModel = myObj.model.clone(); //clona o frame alvo
        targetModel = myObj.model.clone(); //clona o frame alvo
    }

    frameStartTime = new Date();
    setTimeout(nextKeyframe, frame.duration);
}

function renderLoop(){
    if(keyframe >= 0){
        const frame = window.animation.keyframes[keyframe];

        const ellapsedMillis = new Date() - frameStartTime;
        const progress = ellapsedMillis / frame.duration;

        for(let i = 0; i < myObj.model.vertices.length; i++){
            const b = beforeModel.vertices[i];
            const t = targetModel.vertices[i];

            for(let j = 0; j < myObj.model.vertices[i].length; j++)
                myObj.model.vertices[i][j] =  b[j] * (1 - progress) + t[j] * progress;
        }
    }

    renderObj(myObj, 80, 800/2, 600/2);
}

//start
nextKeyframe();
setInterval(renderLoop, 1000/60);