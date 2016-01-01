
/**
 * Characters stores an object for every character available in the game.
 * Each object must have the keys of the assets in cache that should be already loaded
 */

var characters = {
    'robotnik':
    {
        portrait: 'robotnik_portrait',
        spritesheet:
        {
            red: 'robotnik_spritesheet_red',
            blue: 'robotnik_spritesheet_blue',
        },
        wheel:
        {
            red: 'robotnik_wheel_red',
            blue: 'robotnik_wheel_blue',
        },
        sounds :
        {
            attack: 'robotnik_sound_attack',
            die: 'robotnik_sound_die',
            hit: 'robotnik_sound_hit',
            jetpack: 'robotnik_sound_jetpack',
            wormhole: 'robotnik_sound_wormhole',
            turbo : 'robotnik_sound_turbo'
        }
    },
    'kirby':
    {
        portrait: 'kirby_portrait',
        spritesheet:
        {
            red: 'kirby_spritesheet_red',
            blue: 'kirby_spritesheet_blue',
        },
        wheel:
        {
            red: 'kirby_wheel_red',
            blue: 'kirby_wheel_blue',
        }

    },
    'alien':
    {
        portrait: 'alien_portrait',
        spritesheet:
        {
            red: 'alien_spritesheet_red',
            blue: 'alien_spritesheet_blue',
        },
        wheel:
        {
            red: 'alien_wheel_red',
            blue: 'alien_wheel_blue',
        }

    },
    'trunks':
    {
        portrait: 'trunks_portrait',
        spritesheet:
        {
            red: 'trunks_spritesheet_red',
            blue: 'trunks_spritesheet_blue',
        },
        wheel:
        {
            red: 'trunks_wheel_red',
            blue: 'trunks_wheel_blue',
        }
    }
}
