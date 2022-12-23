import { Character } from "../interface/character";
type AllEvents = { [key: number]: EventObj[] }
type Power = {
    name: string,
    useEveryNight: boolean,
    useDuringVoting: boolean,
    useOnceInBeginning: boolean,
    useWhenAttacked: boolean
}
export type EventObj = {
    msg: string, 
    done: boolean, 
    happensDaily?: boolean, 
    group?: string, 
    checkForSpecialPowers?: boolean
}
export enum TimeOfDay {
    Intro,
    Day,
    Night
}

export enum AttackedResult {
    Protect = "Protect",
    CollateralDamage = "CollateralDamage",
    Nothing = ""
}
const seer = { // test obj in case this works better
    name: "Seer",
    description: "Each night gets to see a character's role",
    power: {
        name: "See",
        useEveryNight: true,
        useDuringVoting: false,
        useOncePerGame: false,
        useOnceUntilRetriggered: false,
        useWhenAttacked: false,
    },
    gameValue: 1,
    oneOnly: true,
    isWerewolf: false
};

export const allCharacters: Character[] = [
    {
        name: "Seer",
        description: "Each night gets to see a character's role",
        isActivePower: true,
        isWerewolf: false,
        isDuringVoting: false,
        isOneTimeUsePower: false,
        oneOnly: true,
        gameValue: 1,
        action: "See",
        effectWhenAttacked: AttackedResult.Nothing,
        effectWhenProctectedIsAttacked: AttackedResult.Nothing,
    },
    {
        name: "Priest",
        description: "On the first night, select one person to protect",
        isActivePower: false,
        isWerewolf: false,
        isDuringVoting: false,
        isOneTimeUsePower: true,
        canBeRetriggered: true,
        oneOnly: true,
        gameValue: 1,
        action: "Protect",
        effectWhenAttacked: AttackedResult.Nothing,
        effectWhenProctectedIsAttacked: AttackedResult.Protect
    },
    {
        name: "Bodyguard",
        description: "Defend one person per night from a werewolf",
        isActivePower: true,
        isWerewolf: false,
        isDuringVoting: false,
        isOneTimeUsePower: false,
        oneOnly: true,
        gameValue: 1,
        action: "Defend",
        effectWhenAttacked: AttackedResult.Nothing,
        effectWhenProctectedIsAttacked: AttackedResult.Protect
    },
    {
        name: "Hunter",
        description: "When dies, choose someone to die too",
        isActivePower: false,
        isPassivePower: true,
        isWerewolf: false,
        isDuringVoting: false,
        isOneTimeUsePower: false,
        oneOnly: true,
        gameValue: 1,
        action: "Take Down",
        effectWhenAttacked: AttackedResult.CollateralDamage,
        effectWhenProctectedIsAttacked: AttackedResult.Nothing,
    },
    {
        name: "Cupid",
        description: "Connects two people, when one dies, so does the connected person",
        isActivePower: false,
        isWerewolf: false,
        isDuringVoting: false,
        isOneTimeUsePower: true,
        oneOnly: true,
        gameValue: 1,
        action: "Connect",
        effectWhenAttacked: AttackedResult.Nothing,
        effectWhenProctectedIsAttacked: AttackedResult.CollateralDamage
    },
    {
        name: "Werewolf",
        description: "Each night all werewolves get to choose and kill one villager",
        isActivePower: true,
        isWerewolf: true,
        isDuringVoting: false,
        isOneTimeUsePower: false,
        oneOnly: false,
        gameValue: 1,
        action: "Eat",
        effectWhenAttacked: AttackedResult.Nothing,
        effectWhenProctectedIsAttacked: AttackedResult.Nothing
    },
    {
        name: "Villager",
        description: "A common villager",
        isActivePower: false,
        isWerewolf: false,
        isDuringVoting: false,
        isOneTimeUsePower: false,
        oneOnly: false,
        gameValue: 1,
        effectWhenAttacked: AttackedResult.Nothing,
        effectWhenProctectedIsAttacked: AttackedResult.Nothing
    }
]

export const allEvents: AllEvents = {
    [TimeOfDay.Intro]: [
        {
            msg: "You show everyone their roles",
            done: false
        },
        {
            msg: "Tell everyone to close eyes",
            done: false
        },
        {
            msg: "Have werewolves see each other",
            done: false
        }
    ],
    [TimeOfDay.Day]: [
        {
            msg: "Everyone Wake Up!",
            done: false
        },
        {
            msg: "Introduce the game and people",
            done: false
        },
        {
            msg: "Start the day",
            done: false,
            happensDaily: true
        },
        {
            msg: "Accuse",
            done: false,
            happensDaily: true,
            group: "Accuse"
        },
        {
            msg: "Vote to lynch",
            done: false,
            happensDaily: true,
            group: "Accuse"
        },
        {
            msg: "Remove player that was voted off (if any)",
            done: false,
            happensDaily: true,
            group: "Accuse"
        },
        {
            msg: "Tell everyone to close eyes",
            done: false,
            happensDaily: true
        }
    ],
    [TimeOfDay.Night]: [
        {
            msg: "Special Characters Go",
            done: false,
            happensDaily: true,
            checkForSpecialPowers: true
        },
        {
            msg: "Werewolves kill",
            done: false,
            happensDaily: true
        }
    ],
}

export const werewolfLookup = {
    "5": 2,
    "6": 2,
    "7": 2,
    "8": 2,
    "9": 3,
    "10": 3,
    "11": 3,
    "12": 4,
    "13": 4,
    "14": 4,
    "15": 5
};

export const ActionWordsLookup: any = {
    "Seer": {
        "To": "Saw",
        "From": "Seen by"
    },
    "Hunter": {
        "To": "Took down",
        "From": "Taken down by"
    },
    "Bodyguard": {
        "To": "Protected",
        "From": "Protected by"
    },
    "Cupid": {
        "To": "is Connected to",
        "From": "Connected"
    },
    "Werewolf": {
        "To": "Ate",
        "From": "Eaten by"
    },
    "Priest": {
        "To": "Protected",
        "From": "Protected by"
    }
}