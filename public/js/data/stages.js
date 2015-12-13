var stages =
{
    'map1' : {
        width : 2400,
        height : 2400,
        backgroundImage : 'fondo_estrellas',
        planets : [
            {
                asset : 'bigplanet',
                x : 2000,
                y : 2000,
                gravity : 700,
                gravityForce : 550
            },
            {
                asset : 'bigplanet',
                x : 400,
                y : 400,
                gravity : 700,
                gravityForce : 550
            },
            {
                asset : 'sun',
                x : 1200,
                y : 1200,
                gravity : 1500,
                gravityForce : 250,
                collisionRadius : 164
            }
        ]
    },
    'map2' : {
        width : 4400,
        height : 4400,
        backgroundImage : 'background_map2',
        planets : [
            {
                asset : 'planet_red',
                x : 3200,
                y : 3200,
                gravityRadius : 900,
                gravityForce : 850,
                collisionRadius : 355
            },
            {
                asset : 'planet_blue',
                x : 1200,
                y : 1200,
                gravityRadius : 900,
                gravityForce : 850,
                collisionRadius : 375
            },
            {
                asset : 'sun',
                x : 2200,
                y : 2200,
                gravityRadius : 900,
                gravityForce : 550,
                collisionRadius : 164
            }/*,
            {
                asset : 'sun',
                x : 1200,
                y : 1200,
                gravity : 400,
                gravityForce : 800,
                collisionRadius : 164
            }*/
        ]
    },
    'map3' : {
        width : 6000,
        height : 2000,
        backgroundImage : 'fondo_estrellas',
        planets : [
            {
                asset : 'planet_red',
                x : 1000,
                y : 1000,
                gravityRadius : 900,
                gravityForce : 900,
                collisionRadius : 355
            },
            {
                asset : 'planet_blue',
                x : 5000,
                y : 1000,
                gravityRadius : 900,
                gravityForce : 900,
                collisionRadius : 375
            },
            {
                asset : 'giant_moon',
                x : 4000,
                y : 1400,
                gravityRadius : 400,
                gravityForce : 500,
                //collisionRadius : 375
            },
            {
                asset : 'giant_moon',
                x : 4000,
                y : 600,
                gravityRadius : 400,
                gravityForce : 500,
                //collisionRadius : 375
            },
            {
                asset : 'giant_moon',
                x : 2000,
                y : 600,
                gravityRadius : 400,
                gravityForce : 500,
                //collisionRadius : 375
            },
            {
                asset : 'giant_moon',
                x : 2000,
                y : 1400,
                gravityRadius : 400,
                gravityForce : 500,
                //collisionRadius : 375
            },
            {
                asset : 'sun',
                x : 3000,
                y : 1000,
                gravityRadius : 1000,
                gravityForce : 1200,
                collisionRadius : 164
            }
        ]
    }
}