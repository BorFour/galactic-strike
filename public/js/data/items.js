var items = {
    'potion':
    {
        asset: 'potion',
        use: function ()
        {
            owner.hp += 30;
        },
        collision: null
    },
    'pokeball':
    {
        asset: 'pokeball',
        use: null
    },
    'bullet':
    {
        asset: 'laser_bullet',
        use: null,
        body: function (sprite)
        {
            sprite.body.setCircle(2, 0, 0, 0);
        },
        collision: function (body1, body2, fixture1, fixture2, begin)
        {
            body2.sprite.hp -= 10;
            body1.sprite.destroy();
        }
    },
    'cucumber':
    {
        asset: 'cucumber',
        use: null
    },
    'spikeball':
    {
        asset : 'spikeball',
        use: null
    },
    'red_mine':
    {
        asset: 'red_mine',
        use: null,
        scale : 1.7
    },
    'blue_mine':
    {
        asset: 'blue_mine',
        use: null,
        scale : 1.7
    },
    'misil':
    {
        asset: 'misil',
        use: null
    },
    'shield':
    {
        asset: 'stick',
        use: null
    },
    'hammer':
    {
        asset: 'hammer',
        use: null,
        scale : 1.6
    },
    'spaceAttack1':
    {
        asset: 'spaceAttack1',
        use: null,
        scale: 0.5
    },
    'punchRed':
    {
        asset: 'punchRed',
        use: null,
        scale : 1.2
    },
    'punchBlue':
    {
        asset: 'punchBlue',
        use: null,
        scale : 1.2
    },
    'heart':
    {
        asset: 'heart',
        use: null
    },
    'star':
    {
        asset: 'star',
        use: null
    }
}
