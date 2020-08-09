// const test = `this is a test`

function fill(obj) {
    let cnt = 1
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = cnt++
        }
    }
}

// Game
let Game = {
    Enemy: {
        CMD: {
            PushOneEnemy: ``,
        },
        HP: 2,
        Score: 3,
        MoveSpeed: 216,
        RushDTime: 0.5,
    },
    Tower: {
        CMD: {
            Fire: ``,
        },
        Status: {
            Building: ``,
            Destroying: ``,
            Waiting: ``,
            Attacking: ``,
        },
        Range: {
            Normal: 2,
        },
        FireSpeed: {
            Normal: 0.5,
        },
        BulletSpeed: 800,
        BulletDamage: 1,
        Expenditure: 100,
    },
    GameStartTime: 10,
    GridWidth: 12,
    GridHeight: 13,
    PlayerHP: 10,
}
fill(Game.Enemy.CMD)
fill(Game.Tower.CMD)
fill(Game.Tower.Status)

// HallView
let HallView = {
    CpntName: {
        Common: `Common`,
        HallUI: `HallUI`,
    },
    CMD: {
        RegistCpntUpdateWithName: ``,
        UpdateCpntHallUI: ``,
    },
}
fill(HallView.CMD)

// GameView
let GameView = {
    CpntName: {
        Common: `Common`,
        Game: `Game`,
        GameUI: `GameUI`,
    },
    CMD: {
        RegistCpntUpdateWithName: ``,
        UpdateCpntGame: ``,
        UpdateCpntGameUI: ``,
    },
    ItemType: {
        Disabled: ``,
        Normal: ``,
        Left: ``,
        Right: ``,
        Top: ``,
        Bottom: ``,
        Enter: ``,
        Exist: ``,
        Build: ``,
    },
    ItemStatu: {
        Waiting: ``,
        Selecting: ``,
        Building: ``,
    },
}
fill(GameView.CMD)
fill(GameView.ItemType)
fill(GameView.ItemStatu)

export default {
    // test,

    HallView,
    GameView,
    Game,
}