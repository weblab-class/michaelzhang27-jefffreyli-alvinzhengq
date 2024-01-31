export const titleAnimation = {

    initial: i => ({
        y: "200%",
    }),

    animate: i => ({
        y: 0,

        transition: {
            delay: (i * 0.16) + 1.1,
            ease: [0.215, 0.61, 0.355, 1],
            duration: 0.8,
        }
    })

}
