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
        ], c: 'lime' },

        //traseira (lâmina)
        { v: [
            [8,-21,2],
            [4,-21,2],
            [4,-2,2],
            [6,0,2],
            [8,-2,2],
        ], c: 'magenta' },

        //lateral esquerda (lâmina)
        { v: [
            [4,-21,2],
            [4,-21,0],
            [4,-2,0],
            [4,-2,2],
        ], c: 'blue' },

        //lateral direita (lâmina)
        { v: [
            [8,-21,0],
            [8,-21,2],
            [8,-2,2],
            [8,-2,0],
        ], c: 'orange' },

        //superior esquerda (lâmina)
        { v: [
            [4,-2,2],
            [4,-2,0],
            [6,0,0],
            [6,0,2],
        ], c: 'cyan' },

        //superior direita (lâmina)
        { v: [
            [8,-2,0],
            [8,-2,2],
            [6,0,2],
            [6,0,0],
        ], c: 'red' },

        /** GUARDA-MÃO **/
        //frontal esquerda (guarda-mão)
        { v: [
            [0,-21,0],
            [0,-23,0],
            [5,-23,0],
            [5,-21,0],
        ], c: 'lime' },

        //frontal central (guarda-mão)
        { v: [
            [5,-21,0],
            [5,-23,0],
            [7,-23,0],
            [7,-21,0],
        ], c: 'lime' },

        //frontal direita (guarda-mão)
        { v: [
            [7,-21,0],
            [7,-23,0],
            [12,-23,0],
            [12,-21,0],
        ], c: 'lime' },

        //traseira esquerda (guarda-mão)
        { v: [
            [5,-23,2],
            [0,-23,2],
            [0,-21,2],
            [5,-21,2],
        ], c: 'magenta' },

        //traseira central (guarda-mão)
        { v: [
            [7,-23,2],
            [5,-23,2],
            [5,-21,2],
            [7,-21,2],
        ], c: 'magenta' },

        //traseira direita (guarda-mão)
        { v: [
            [12,-23,2],
            [7,-23,2],
            [7,-21,2],
            [12,-21,2],
        ], c: 'magenta' },

        //esquerda (guarda-mão)
        { v: [
            [0,-23,2],
            [0,-23,0],
            [0,-21,0],
            [0,-21,2],
        ], c: 'blue' },

        //direita (guarda-mão)
        { v: [
            [12,-23,0],
            [12,-23,2],
            [12,-21,2],
            [12,-21,0],
        ], c: 'orange' },

        //superior esquerda (guarda-mão)
        { v: [
            [0,-21,0],
            [4,-21,0],
            [4,-21,2],
            [0,-21,2],
        ], c: 'cyan' },

        //superior direita (guarda-mão)
        { v: [
            [8,-21,0],
            [12,-21,0],
            [12,-21,2],
            [8,-21,2],
        ], c: 'cyan' },

        //inferior esquerda (guarda-mão)
        { v: [
            [0,-23,2],
            [5,-23,2],
            [5,-23,0],
            [0,-23,0],
        ], c: 'red' },

        //inferior direita (guarda-mão)
        { v: [
            [7,-23,2],
            [12,-23,2],
            [12,-23,0],
            [7,-23,0],
        ], c: 'red' },

        /** CABO **/
        //frontal (cabo)
        { v: [
            [5,-23,0],
            [5,-30,0],
            [7,-30,0],
            [7,-23,0],
        ], c: 'lime' },

        //traseira (cabo)
        { v: [
            [7,-30,2],
            [5,-30,2],
            [5,-23,2],
            [7,-23,2],
        ], c: 'magenta' },

        //lateral esquerda (cabo)
        { v: [
            [5,-30,2],
            [5,-30,0],
            [5,-23,0],
            [5,-23,2],
        ], c: 'blue' },

        //lateral direita (cabo)
        { v: [
            [7,-30,0],
            [7,-30,2],
            [7,-23,2],
            [7,-23,0],
        ], c: 'orange' },

        /** POMO **/
        //frontal (pomo)
        { v: [
            [4,-30,0],
            [4,-31,0],
            [8,-31,0],
            [8,-30,0],
        ], c: 'cyan' },

        //traseira (pomo)
        { v: [
            [8,-31,2],
            [4,-31,2],
            [4,-30,2],
            [8,-30,2],
        ], c: 'red' },

        //esquerda (pomo)
        { v: [
            [4,-31,2],
            [4,-31,0],
            [4,-30,0],
            [4,-30,2],
        ], c: 'lime' },

        //direita (pomo)
        { v: [
            [8,-31,0],
            [8,-31,2],
            [8,-30,2],
            [8,-30,0],
        ], c: 'magenta' },

        //superior esquerda (pomo)
        { v: [
            [5,-30,0],
            [5,-30,2],
            [4,-30,2],
            [4,-30,0],
        ], c: 'blue' },

        //superior direita (pomo)
        { v: [
            [8,-30,0],
            [8,-30,2],
            [7,-30,2],
            [7,-30,0],
        ], c: 'blue' },

        //inferior (pomo)
        { v: [
            [8,-31,2],
            [8,-31,0],
            [4,-31,0],
            [4,-31,2],
        ], c: 'orange' },
    ]
}