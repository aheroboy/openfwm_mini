export const COMMONENT_TARGET: string = 'C'
export module Entities {
    export interface CreditAvailable {
        isFulfill: boolean;
        creditVal: number;
        difference: number;
    }
    // 定义数据接口
    export interface Fish {
        code: string;
        type: number;
        name: string;
    }

    export interface BaseInfo {
        code: string;
        type: number;
        name: string;
    }

    export interface Comment {
        id?: string;
        userId: string;
        userName: string;
        userAvatar: string;
        content: string;
        createTime?: string;
        likeCount?: number;
        isLiked?: boolean;
        targetType:string;
        targetId: string;
    }

    export interface FishingRecord {
        id: string;
        spotId: string;
        fisherId: string;
        fishes: Fish[];
        harvestType: string;
        harvestTypeVal: BaseInfo;
        isRec: number;
        score: number;
        scoreVal: BaseInfo;
        fishingAt: string;
        jsonHisPictures: string[];
        avatarUrl: string;
        nickName: string;
        lvl: number;
        lvlName: string;
    }
    // 定义规则项类型接口
    export interface RuleItem {
        id: number;
        levelRangeStart: number;
        levelRangeEnd: number;
        behaviorDesc: string;
        points: number;
        limitDesc: string;
        sortOrder: number;
        createdAt: string;
    }
    export interface UserCredit {
        currentLevel: number,
        currentLevelName: string,
        nextLevel: number,
        nextLevelName: string,
        // 积分信息
        totalPoints: number,

        currentLevelPoints: number,
        nextLevelPoints: number,
        progressPercentage: number, // 800/1200 ≈ 65%
        remainingPoints: number,
        // 最近积分记录
        recentRecords: PointsRecord[],
        // 设置项状态
        autoSkipAds: Boolean
    }
    export interface PointsRecord {
        reason: string;
        bizId: string;
        point: number;
        createdDate: Date
    }
    export interface CircleMessage {
        cursor: string
    }
    export interface PolygonOrigin {
        city: string
        cityCode: string
        id: string
        isActive: boolean
        latitude: number
        longitude: number
        points: Position[]
        title: string
    }
    export interface Polygon {
        id: number,
        origin?: PolygonOrigin,
        points: Array<Position>,
        strokeColor: string,
        strokeWidth: number,
        fillColor?: string,
        zIndex: number,
        isHighlighted: boolean
    }

    export interface SpotProperty {
        checked?: boolean;
        code?: string
    }
    export interface Spot {
        latitude: number;
        longitude: number;
        cityCode: string;
        id: string;
        isFree: boolean;
        isPrivate: boolean;
        name: string;
    }

    export interface MarkerLabel {
        content: string;
        bgColor: string;
        color?: string,
        fontSize?: number,
        x?: number,
        y?: number,
        borderRadius?: number;
        borderWidth?: number;
        padding?: number;
        textAlign?: string;
    }
    export interface SimpleMarker {
        latitude: number;
        longitude: number;
        width: number;
        height: number;
        id: number;
    }



    export interface Marker {
        latitude: number;
        longitude: number;
        width: number;
        height: number;
        id: number;
        customData?: { polygonId: number, originId: string },
        city?: string,
        isActive?: boolean,
        cityCode?: string;
        spotId?: string;
        isFree?: boolean;
        isPrivate?: boolean;
        label?: MarkerLabel;
        iconPath?: string
    };
    export interface Line {
        color: string,
        width: number,
        borderColor: string,
        borderWidth: number,
        points: Position[]
    }
    export interface UserInfo {
        nickName: string;
        avatarUrl: string;
        password: string;
    };
    export interface Position {
        latitude: number,
        longitude: number
    }
    export interface Spot {
        id: string,
        name: string,
        lagitude: number;
        latitude: number;
    }

    export interface Fisher {
        id: string,
        name: string
    }
    export enum ViewSpotType {
        VISIT,
        XIAGAN,
        SHANGYU,
        MSG,
    }
    export interface FishingMessage {
        type: ViewSpotType,
        msg: string
    }
    export interface City {
        cityCode: string,
        city:string
    }
    export const CITY =  {
        cityCode: '8888888',
        city: '全局'
    }
    export interface DTO<T> {
        data:T;
        status: boolean;
    }
}