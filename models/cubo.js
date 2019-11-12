window.model = {
    scale: 2,
    offset: [-0.5,-0.5,-0.5],
    faces: [
        //frontal
        { v: [
            [0,0,0],
            [1,0,0],
            [1,1,0],
            [0,1,0]
        ], c: 'lime', s: false },
        //traseira
        { v: [
            [1,0,1],
            [0,0,1],
            [0,1,1],
            [1,1,1]
        ], c: 'magenta', s: false },
        //esquerda
        { v: [
            [0,0,1],
            [0,0,0],
            [0,1,0],
            [0,1,1]
        ], c: 'blue', s: false },
        //direita
        { v: [
            [1,0,0],
            [1,0,1],
            [1,1,1],
            [1,1,0]
        ], c: 'orange', s: false },
        //cima
        { v: [
            [0,1,0],
            [1,1,0],
            [1,1,1],
            [0,1,1]
        ], c: 'cyan', s: false },
        //baixo
        { v: [
            [0,0,1],
            [1,0,1],
            [1,0,0],
            [0,0,0]
        ], c: 'red', s: false },
    ]
}