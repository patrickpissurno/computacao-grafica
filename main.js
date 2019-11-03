const chroma = window.chroma;

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

function squaredDistance(vertexA, vertexB){
    if(vertexA.length !== vertexB.length)
        throw new Error('distance(vA, vB): vertices dimensions MUST be equal');

    let sum = 0;
    for(let i = 0; i < vertexA.length; i++)
        sum += Math.pow(vertexA[i] - vertexB[i], 2);
    return sum;
}

function distance(vertexA, vertexB){
    return Math.sqrt(squaredDistance(vertexA, vertexB));
}

/** produto interno */
function dotProduct(vectorA, vectorB){
    return (vectorA[0] * vectorB[0]) + (vectorA[1] * vectorB[1]) + (vectorA[2] * vectorB[2]);
}

/** produto vetorial */
function crossProduct(vectorA, vectorB){
    const x = (vectorA[1] * vectorB[2]) - (vectorA[2] * vectorB[1]);
    const y = (vectorA[0] * vectorB[2]) - (vectorA[2] * vectorB[0]);
    const z = (vectorA[0] * vectorB[1]) - (vectorA[1] * vectorB[0]);
    return [ x, y, z ];
}

class Face {
    /** 
     * @param {number[]} verticesIndices
     * @param {string} color
     * @param {number[]} normalVector
     * @param {number[]} center
    */
    constructor(verticesIndices, color, normalVector, center) {
        this.vertices = verticesIndices;
        this.color = color;
        this.normalVector = normalVector;
        this.center = center;
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
            faces.push(new Face(f, face.c, null, null));
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

// posição da câmera no mundo
const CAMERA_X = 0;
const CAMERA_Y = 0;
const CAMERA_Z = -2;

// direção forward da câmera
const CAMERA_XF = 0;
const CAMERA_YF = 0;
const CAMERA_ZF = 1;

/** @param {Obj} obj */
function renderObj(obj, scale = 1, offset_x = 0, offset_y = 0){

    /** @type {Model} */
    const copy = obj.model.clone();

    for(let vertice of copy.vertices)
        vertice.push(1); //adiciona a coordenada homogênea

    // calcula vetores normais e centróides das faces
    for(let i = 0; i < copy.faces.length; i++){
        const vertices = copy.faces[i].vertices.map(j => copy.vertices[j]);
        const v0 = vertices[0];
        const v1 = vertices[1];
        const v2 = vertices[2];
        const vectorA = [ v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2] ]; //v1 - v0
        const vectorB = [ v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2] ]; //v2 - v1
        let normalVector = crossProduct(vectorA, vectorB);

        let normalVector_size = Math.sqrt(normalVector.map(x => Math.pow(x, 2)).reduce((acc, cur) => acc + cur));
        copy.faces[i].normalVector = normalVector.map(x => x / normalVector_size);

        copy.faces[i].center = vertices.reduce((acc, it) => [ acc[0] + it[0], acc[1] + it[1], acc[2] + it[2], acc[3] + it[3] ], [0, 0, 0, 0]).map(x => x / vertices.length);
        
        // backface culling
        const cos = dotProduct(copy.faces[i].normalVector, [ CAMERA_XF, CAMERA_YF, CAMERA_ZF ]);
        if(cos < -0.005) //aproximação para evitar glitches por conta de erro de ponto flutuante
            copy.faces[i] = null;
    }
    copy.faces = copy.faces.filter(x => x != null);

    let m = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [-CAMERA_X,-CAMERA_Y,-CAMERA_Z,1],
    ];

    m = multiplyMatrices(m, getProjectionMatrix(20, 0.1, 100));

    let perspectiva = multiplyMatrices(copy.vertices, m);

    for(let i = 0; i < perspectiva.length; i++)
    for(let j = 0; j < perspectiva[i].length; j++)
        perspectiva[i][j] = perspectiva[i][j] / perspectiva[i][3]; //normaliza pela coordenada homogênea

    //algoritmo painter: reordena as faces de trás para frente em relação à camera
    copy.faces.sort((a, b) => {
        let distA = squaredDistance(a.center, [ CAMERA_X, CAMERA_Y, CAMERA_Z, 1 ]);
        let distB = squaredDistance(b.center, [ CAMERA_X, CAMERA_Y, CAMERA_Z, 1 ]);
        return distB - distA;
    });

    //iluminação e shading
    for(let face of copy.faces){
        let color = [0, 0, 0];
        for(let light of window.lights){            
            switch(light.type){
                case 'ambient': {
                    let lab = chroma(light.color).lab();
                    color[0] += lab[0];
                    color[1] += lab[1];
                    color[2] += lab[2];
                    break;
                }
                case 'directional': {
                    let vectorA = [ -light.position[0] - face.center[0], light.position[1] - face.center[1], -light.position[2] - face.center[2] ];
                    let vectorA_size = Math.sqrt(vectorA.map(x => Math.pow(x, 2)).reduce((acc, cur) => acc + cur));
                    vectorA = vectorA.map(x => x / vectorA_size);

                    let lab = chroma(light.color).lab();
                    lab[0] *= Math.max(dotProduct(vectorA, face.normalVector), 0); //ângulo da face

                    color[0] += lab[0];
                    color[1] += lab[1];
                    color[2] += lab[2];
                    break;
                }
                case 'point': {
                    let vectorA = [ -light.position[0] - face.center[0], light.position[1] - face.center[1], -light.position[2] - face.center[2] ];
                    let vectorA_size = Math.sqrt(vectorA.map(x => Math.pow(x, 2)).reduce((acc, cur) => acc + cur));
                    vectorA = vectorA.map(x => x / vectorA_size);

                    let lab = chroma(light.color).lab();
                    lab[0] *= Math.max(dotProduct(vectorA, face.normalVector), 0); //ângulo da face

                    let lpos = [ light.position[0], light.position[1], light.position[2], 1 ];
                    lab[0] *= 1 / (squaredDistance(face.center, lpos) * 0.25);

                    color[0] += lab[0];
                    color[1] += lab[1];
                    color[2] += lab[2];
                    break;
                }
            }
        }
        let lcolor = chroma.lab([ color[0], color[1] / window.lights.length, color[2] / window.lights.length ]);
        face.color = chroma.blend(chroma(face.color), lcolor, 'multiply');
    }

    let projetado = multiplyMatrices(perspectiva, [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1],
    ]);

    for(let i = 0; i < projetado.length; i++)
    for(let j = 0; j < projetado[i].length; j++)
        copy.vertices[i][j] = projetado[i][j];

    // limpa a tela
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 800, 600);

    for(let face of copy.faces){
        ctx.beginPath();

        for(let n = 0; n < face.vertices.length + 1; n++){
            const v = face.vertices[n % face.vertices.length];
            const vertex = copy.vertices[v];
            ctx.lineTo(offset_x + -vertex[0] * scale, offset_y + vertex[1] * scale);
        }

        ctx.fillStyle = face.color;
        ctx.fill();
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