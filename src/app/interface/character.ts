export interface Character {
    name: string;
    description: string;
    action?: string;
    effectWhenAttacked: string;
    effectWhenProctectedIsAttacked?: string;

    isActivePower?: boolean;
    isPassivePower?: boolean;
    isWerewolf: boolean;

    isDuringVoting: boolean;
    isOneTimeUsePower: boolean;
    canBeRetriggered?: boolean

    oneOnly: boolean,
    gameValue: number // likely only useful when there are characters that switches sides
}