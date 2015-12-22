var stages = {
    'map1':
    {
        width: 4400,
        height: 4400,
        backgroundImage: 'background_map2',
        planets: [
            {
                asset: 'planet_red',
                x: 3200,
                y: 3200,
                gravityRadius: 900,
                gravityForce: 850,
                collisionRadius: 355
            },
            {
                asset: 'planet_blue',
                x: 1200,
                y: 1200,
                gravityRadius: 900,
                gravityForce: 850,
                collisionRadius: 375
            },
            {
                asset: 'sun',
                x: 2200,
                y: 2200,
                gravityRadius: 900,
                gravityForce: 550,
                collisionRadius: 164
            }
        ],
        wormholes : [
            {
                asset: 'wormhole',
                x: 3200,
                y: 2200,
                gravityRadius: 0,
                gravityForce: 850,
                collisionRadius: 45
            },
            {
                asset: 'wormhole',
                x: 1200,
                y: 2200,
                gravityRadius: 0,
                gravityForce: 850,
                collisionRadius: 45
            }
        ]
    },
    'map2':
    {
        width: 6000,
        height: 2000,
        backgroundImage: 'fondo_estrellas',
        planets: [
            {
                asset: 'planet_red',
                x: 1000,
                y: 1000,
                gravityRadius: 900,
                gravityForce: 900,
                collisionRadius: 355
            },
            {
                asset: 'planet_blue',
                x: 5000,
                y: 1000,
                gravityRadius: 900,
                gravityForce: 900,
                collisionRadius: 375
            },
            {
                asset: 'giant_moon',
                x: 4000,
                y: 1400,
                gravityRadius: 400,
                gravityForce: 500,
                //collisionRadius : 375
            },
            {
                asset: 'giant_moon',
                x: 4000,
                y: 600,
                gravityRadius: 400,
                gravityForce: 500,
                //collisionRadius : 375
            },
            {
                asset: 'giant_moon',
                x: 2000,
                y: 600,
                gravityRadius: 400,
                gravityForce: 500,
                //collisionRadius : 375
            },
            {
                asset: 'giant_moon',
                x: 2000,
                y: 1400,
                gravityRadius: 400,
                gravityForce: 500,
                //collisionRadius : 375
            },
            {
                asset: 'sun',
                x: 3000,
                y: 1000,
                gravityRadius: 1000,
                gravityForce: 1200,
                collisionRadius: 164
            }
        ]
    },
    'map3':
    {
        width: 3000,
        height: 3000,
        backgroundImage: 'background_map2',
        planets: [
            {
                asset: 'giantplanet',
                x: 1500,
                y: 1500,
                gravityRadius: 1114,
                gravityForce: 600,
                collisionRadius: 532
            },
            {
                asset: 'giantplanet',
                x: 1500,
                y: 1500,
                gravityRadius: 1300,
                gravityForce: 250,
                collisionRadius: 532
            }
        ]
    }
}
