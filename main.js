class Vertex {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Face {
    /** @param {Vertex[]} vertices */
    constructor(vertices) {
        this.vertices = vertices;
    }
}

class Model {
    /** @param {Face[]} faces */
    constructor(faces){
        this.faces = faces;
    }
}

class Object {
    /** @param {Model} model */
    constructor(model){
        this.model = model;
    }
}

const cuboModel = new Model([
    new Face([ //face traseira
        new Vertex(0,0,0),
        new Vertex(1,0,0),
        new Vertex(1,1,0),
        new Vertex(0,1,0),
    ]),
    new Face([ //face frontal
        new Vertex(0,0,1),
        new Vertex(1,0,1),
        new Vertex(1,1,1),
        new Vertex(0,1,1),
    ]),
    new Face([
        new Vertex(0,0,0),
        new Vertex(1,0,0),
        new Vertex(1,1,0),
        new Vertex(0,1,0),
    ]),
])

const canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

function desenharQuadrado(){
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 100);
    ctx.lineTo(200, 200);
    ctx.lineTo(100, 200);
    ctx.fill();
}

desenharQuadrado();