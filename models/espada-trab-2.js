window.model = {
    scale: 16,
    offset: [-6,16,-1],
    faces: [
        /** LAMINA **/
        //frontal (lâmina)
        { v: [
            [4,-21,0],
            [8,-21,0],
            [8,-2,0],
            [6,0,0],
            [4,-2,0],
        ], c: '#473c8c', s: false },

        //traseira (lâmina)
        { v: [
            [8,-21,2],
            [4,-21,2],
            [4,-2,2],
            [6,0,2],
            [8,-2,2],
        ], c: '#473c8c', s: false },

        //lateral esquerda (lâmina)
        { v: [
            [4,-21,2],
            [4,-21,0],
            [4,-2,0],
            [4,-2,2],
        ], c: '#473c8c', s: false },

        //lateral direita (lâmina)
        { v: [
            [8,-21,0],
            [8,-21,2],
            [8,-2,2],
            [8,-2,0],
        ], c: '#473c8c', s: false },

        //superior esquerda (lâmina)
        { v: [
            [4,-2,2],
            [4,-2,0],
            [6,0,0],
            [6,0,2],
        ], c: '#473c8c', s: false },

        //superior direita (lâmina)
        { v: [
            [8,-2,0],
            [8,-2,2],
            [6,0,2],
            [6,0,0],
        ], c: '#473c8c', s: false },

        /** GUARDA-MÃO **/
        //frontal esquerda (guarda-mão)
        { v: [
            [0,-21,0],
            [0,-23,0],
            [5,-23,0],
            [5,-21,0],
        ], c: '#473c8c', s: false },

        //frontal central (guarda-mão)
        { v: [
            [5,-21,0],
            [5,-23,0],
            [7,-23,0],
            [7,-21,0],
        ], c: '#473c8c', s: false },

        //frontal direita (guarda-mão)
        { v: [
            [7,-21,0],
            [7,-23,0],
            [12,-23,0],
            [12,-21,0],
        ], c: '#473c8c', s: false },

        //traseira esquerda (guarda-mão)
        { v: [
            [5,-23,2],
            [0,-23,2],
            [0,-21,2],
            [5,-21,2],
        ], c: '#473c8c', s: false },

        //traseira central (guarda-mão)
        { v: [
            [7,-23,2],
            [5,-23,2],
            [5,-21,2],
            [7,-21,2],
        ], c: '#473c8c', s: false },

        //traseira direita (guarda-mão)
        { v: [
            [12,-23,2],
            [7,-23,2],
            [7,-21,2],
            [12,-21,2],
        ], c: '#473c8c', s: false },

        //esquerda (guarda-mão)
        { v: [
            [0,-23,2],
            [0,-23,0],
            [0,-21,0],
            [0,-21,2],
        ], c: '#473c8c', s: false },

        //direita (guarda-mão)
        { v: [
            [12,-23,0],
            [12,-23,2],
            [12,-21,2],
            [12,-21,0],
        ], c: '#473c8c', s: false },

        //superior esquerda (guarda-mão)
        { v: [
            [0,-21,0],
            [4,-21,0],
            [4,-21,2],
            [0,-21,2],
        ], c: '#473c8c', s: false },

        //superior direita (guarda-mão)
        { v: [
            [8,-21,0],
            [12,-21,0],
            [12,-21,2],
            [8,-21,2],
        ], c: '#473c8c', s: false },

        //inferior esquerda (guarda-mão)
        { v: [
            [0,-23,2],
            [5,-23,2],
            [5,-23,0],
            [0,-23,0],
        ], c: '#473c8c', s: false },

        //inferior direita (guarda-mão)
        { v: [
            [7,-23,2],
            [12,-23,2],
            [12,-23,0],
            [7,-23,0],
        ], c: '#473c8c', s: false },

        /** CABO **/
        //frontal (cabo)
        { v: [
            [5,-23,0],
            [5,-30,0],
            [7,-30,0],
            [7,-23,0],
        ], c: '#473c8c', s: false },

        //traseira (cabo)
        { v: [
            [7,-30,2],
            [5,-30,2],
            [5,-23,2],
            [7,-23,2],
        ], c: '#473c8c', s: false },

        //lateral esquerda (cabo)
        { v: [
            [5,-30,2],
            [5,-30,0],
            [5,-23,0],
            [5,-23,2],
        ], c: '#473c8c', s: false },

        //lateral direita (cabo)
        { v: [
            [7,-30,0],
            [7,-30,2],
            [7,-23,2],
            [7,-23,0],
        ], c: '#473c8c', s: false },

        /** POMO **/
        //frontal (pomo)
        { v: [
            [4,-30,0],
            [4,-31,0],
            [8,-31,0],
            [8,-30,0],
        ], c: '#473c8c', s: false },

        //traseira (pomo)
        { v: [
            [8,-31,2],
            [4,-31,2],
            [4,-30,2],
            [8,-30,2],
        ], c: '#473c8c', s: false },

        //esquerda (pomo)
        { v: [
            [4,-31,2],
            [4,-31,0],
            [4,-30,0],
            [4,-30,2],
        ], c: '#473c8c', s: false },

        //direita (pomo)
        { v: [
            [8,-31,0],
            [8,-31,2],
            [8,-30,2],
            [8,-30,0],
        ], c: '#473c8c', s: false },

        //superior esquerda (pomo)
        { v: [
            [5,-30,0],
            [5,-30,2],
            [4,-30,2],
            [4,-30,0],
        ], c: '#473c8c', s: false },

        //superior direita (pomo)
        { v: [
            [8,-30,0],
            [8,-30,2],
            [7,-30,2],
            [7,-30,0],
        ], c: '#473c8c', s: false },

        //inferior (pomo)
        { v: [
            [8,-31,2],
            [8,-31,0],
            [4,-31,0],
            [4,-31,2],
        ], c: '#473c8c', s: false },
    ]
}