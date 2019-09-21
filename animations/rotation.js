function multi(m1, m2) {
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

const FPS = 120;
const ANGLE = 0.025;

window.animation = {
    loop: true,
    keyframes: [
        {
            matrix: multi(multi([
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ -0.5, -0.5, -0.5, 1 ],
            ], [
                [ Math.cos(ANGLE), 0, -Math.sin(ANGLE), 0 ],
                [ 0, 1, 0, 0 ],
                [ Math.sin(ANGLE), 0, Math.cos(ANGLE), 0 ],
                [ 0, 0, 0, 1 ],
            ]), [
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0.5, 0.5, 0.5, 1 ],
            ]),
            duration: 1000/FPS
        },
        {
            matrix: multi(multi([
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ -0.5, -0.5, -0.5, 1 ],
            ], [
                [ Math.cos(ANGLE), 0, -Math.sin(ANGLE), 0 ],
                [ 0, 1, 0, 0 ],
                [ Math.sin(ANGLE), 0, Math.cos(ANGLE), 0 ],
                [ 0, 0, 0, 1 ],
            ]), [
                [ 1, 0, 0, 0 ],
                [ 0, 1, 0, 0 ],
                [ 0, 0, 1, 0 ],
                [ 0.5, 0.5, 0.5, 1 ],
            ]),
            duration: 1000/FPS
        },
    ]
};