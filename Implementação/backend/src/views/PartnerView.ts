export interface Partner {
    id: number;
    userId: number;
    sector: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PartnerRaw {
    id: number;
    user_id: number;
    sector: string;
    created_at: Date;
    updated_at: Date;
}

export const processPartner = (userRaw: PartnerRaw) => {
    return {
        id: userRaw.id,
        userId: userRaw.user_id,
        sector: userRaw.sector,
        createdAt: userRaw.created_at,
        updatedAt: userRaw.updated_at,
    };
}
