const WIDTH = 800;
const HEIGHT = 600;

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

/** soma de vetores */
function vectorSum(...vectors){
    let r = [];
    for(let i = 0; i < vectors[0].length; i++){
        let v = 0;
        for(let j = 0; j < vectors.length; j++)
            v += vectors[j][i];
        r.push(v);
    }
    return r;
}

/**
 * regra de cramer, A * X = B, retorna X
 * @param A matriz
 * @param B vetor
 */
function solve2x2(A, B){
    let a = A[0][0],
        b = A[0][1],
        c = A[1][0],
        d = A[1][1],
        e = B[0],
        f = B[1];
    let D = a * d - b * c;
    let Dx = e * d - b * f;
    let Dy = a * f - e * c;
    return [ Dx / D, Dy / D ];
}

/** linear interpolation */
function lerp(a, b, t){
    return (1 - t) * a + t * b;
}

function bilerpInverse(p, p1, p2, p3, p4, iter){ //https://stackoverflow.com/a/18332009
    let q = [0.5, 0.5]; //initial guess
    for(let k = 0; k < iter; k++){
        let s = q[0];
        let t = q[1];
        let r = vectorSum(p1.map(x => x * (1 - s) * (1 - t)), p2.map(x => x * s * (1 - t)), p3.map(x => x * s * t), p4.map(x => x * (1 - s) * t), p.map(x => -x)); //residual        
        let Js = vectorSum(p1.map(x => -x * (1 - t)), p2.map(x => x * (1 - t)), p3.map(x => x * t), p4.map(x => -x * t)); //dr / ds
        let Jt = vectorSum(p1.map(x => -x * (1 - s)), p2.map(x => -x * s), p3.map(x => x * s), p4.map(x => x * (1 - s))); //dr / dt
        let J = [Js, Jt];
        q = vectorSum(q, solve2x2(J, r).map(x => -x));
        q = q.map(x => Math.max(Math.min(x, 1), 0));
    }
    return q;
}

/**
 * @typedef BLPoint data structure to help with bilinear interpolation
 * @property {number[]} xy x and y coords
 * @property {number} v value
 */

/**
 * bilinear interpolation
 * @param {BLPoint} A point A
 * @param {BLPoint} B point B
 * @param {BLPoint} C point C
 * @param {BLPoint} D point D
 * @param {number[]} xy x and y coords
 */
function bilerp(A, B, C, D, xy){
    // const dist_AB = distance(A.xy, B.xy);
    // const dist_CD = distance(C.xy, D.xy);

    // const R1 = (distance(B.xy, xy) / dist_AB) * A.v + (distance(A.xy, xy) / dist_AB) * B.v;
    // const R2 = (distance(D.xy, xy) / dist_CD) * C.v + (distance(C.xy, xy) / dist_CD) * D.v;

    // return (distance(C.xy, xy) / distance(A.xy, C.xy)) * R1 + (distance(D.xy, xy) / distance(B.xy, D.xy)) * R2;

    let [ alpha, beta ] = bilerpInverse(xy, A.xy, B.xy, C.xy, D.xy, 3);

    return (1 - alpha) * ((1 - beta) * A.v + beta * B.v) + alpha * ((1 - beta) * C.v + beta * D.v);
}

/**
 * computa a iluminação em um vértice
 * @param {number[]} vertex 
 * @param {number[]} normalVector 
 * @param {any} vertexTint cor do vértice
 * @returns {number[]} rgb color
 */
function computeShadingAtVertex(vertex, normalVector, vertexTint){
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
                let vectorA = [ -light.position[0] - vertex[0], light.position[1] - vertex[1], -light.position[2] - vertex[2] ];
                let vectorA_size = Math.sqrt(vectorA.map(x => Math.pow(x, 2)).reduce((acc, cur) => acc + cur));
                vectorA = vectorA.map(x => x / vectorA_size);

                let lab = chroma(light.color).lab();
                lab[0] *= Math.max(dotProduct(vectorA, normalVector), 0); //ângulo da face

                color[0] += lab[0];
                color[1] += lab[1];
                color[2] += lab[2];
                break;
            }
            case 'point': {
                let vectorA = [ -light.position[0] - vertex[0], light.position[1] - vertex[1], -light.position[2] - vertex[2] ];
                let vectorA_size = Math.sqrt(vectorA.map(x => Math.pow(x, 2)).reduce((acc, cur) => acc + cur));
                vectorA = vectorA.map(x => x / vectorA_size);

                let lab = chroma(light.color).lab();
                lab[0] *= Math.max(dotProduct(vectorA, normalVector), 0); //ângulo da face

                let lpos = [ light.position[0], light.position[1], light.position[2], 1 ];
                lab[0] *= 1 / (squaredDistance(vertex, lpos) * 0.25);

                color[0] += lab[0];
                color[1] += lab[1];
                color[2] += lab[2];
                break;
            }
        }
    }
    let lcolor = chroma.lab([ color[0], color[1] / window.lights.length, color[2] / window.lights.length ]);
    return chroma.blend(chroma(vertexTint), lcolor, 'multiply');
}

class Face {
    /** 
     * @param {number[]} verticesIndices
     * @param {string} color
     * @param {number[]} normalVector
     * @param {number[]} center
     * @param {boolean} smoothShading
    */
    constructor(verticesIndices, color, normalVector, center, smoothShading) {
        this.vertices = verticesIndices;
        this.color = color;
        this.normalVector = normalVector;
        this.center = center;
        this.smoothShading = smoothShading;
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
            faces.push(new Face(f, face.c, null, null, face.s));
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
        if(!face.smoothShading){
            face.color = computeShadingAtVertex(face.center, face.normalVector, face.color);
        }
        else {
            let colors = [];
            for(let vertex of face.vertices){
                //encontra todas as faces que esse vértice pertence e
                //calcula a média das normais das faces
                let avgNormal = [0,0,0];
                let count = 0;

                for(let f of copy.faces){
                    if(f.smoothShading && f.vertices.indexOf(vertex) !== -1){
                        avgNormal[0] += f.normalVector[0];
                        avgNormal[1] += f.normalVector[1];
                        avgNormal[2] += f.normalVector[2];
                        count += 1;
                    }
                }
                avgNormal.map(x => x / count);

                //converte a normal média para vetor unitário
                let avgNormal_size = Math.sqrt(avgNormal.map(x => Math.pow(x, 2)).reduce((acc, cur) => acc + cur));
                avgNormal = avgNormal.map(x => x / avgNormal_size);

                //calcula a o shading no vértice
                colors.push(computeShadingAtVertex(copy.vertices[vertex], avgNormal, face.color));
            }

            face.color = colors;
        }
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
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for(let face of copy.faces){
        ctx.beginPath();

        let min_x = null;
        let max_x = null;
        let min_y = null;
        let max_y = null;
        
        for(let n = 0; n < face.vertices.length + 1; n++){
            const v = face.vertices[n % face.vertices.length];
            const vertex = copy.vertices[v];

            let x = Math.floor(offset_x + -vertex[0] * scale);
            let y = Math.floor(offset_y + vertex[1] * scale);
            ctx.lineTo(x, y);

            if(min_x == null || x < min_x)
                min_x = x;
            if(min_y == null || y < min_y)
                min_y = y;

            if(max_x == null || x > max_x)
                max_x = x;
            if(max_y == null || y > max_y)
                max_y = y;
        }
        
        if(!face.smoothShading){
            ctx.fillStyle = face.color;
            ctx.fill();
        }
        else {
            if(face.vertices.length !== 4)
                throw new Error('smooth shading requires 4 vertices per face (blame it on the bilinear interpolation)');

            let svs = [[], [], []];
            for(let n = 0; n < face.vertices.length; n++){
                const v = face.vertices[n];
                const vertex = copy.vertices[v];

                let x = Math.floor(offset_x + -vertex[0] * scale);
                let y = Math.floor(offset_y + vertex[1] * scale);

                let c = face.color[n].lab();

                for(let i = 0; i < svs.length; i++)
                    svs[i].push({ xy: [x, y], v: c[i] });
            }

            for(let i = min_x; i <= max_x; i++)
            for(let j = min_y; j <= max_y; j++){
                if(!ctx.isPointInPath(i, j)) //verifica se o pixel está dentro da face
                    continue;

                let rendered = false;
                for(let sv in svs[0]){
                    if(svs[0][sv].xy[0] === i && svs[0][sv].xy[1] === j){
                        ctx.fillStyle = chroma.lab([ svs[0][sv].v, svs[1][sv].v, svs[2][sv].v ]);
                        // ctx.fillStyle = 'red';
                        rendered = true;
                        break;
                    }
                }

                if(!rendered) {
                    let color = [];
                    for(let sv of svs)
                        color.push(bilerp(sv[0], sv[1], sv[2], sv[3], [i, j]));

                    //renderiza o pixel
                    ctx.fillStyle = chroma.lab(color);
                }
                ctx.fillRect(i, j, 1, 1);
            }
            ctx.closePath();
        }
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

    renderObj(myObj, 80, WIDTH/2, HEIGHT/2);
}

//start
nextKeyframe();
renderLoop();
// setInterval(renderLoop, 1000/20);