export interface BenefitView {
    id: number;
    userId: number;
    value: number;
    description: string;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BenefitRaw {
    id: number;
    user_id: number;
    value: number;
    description: string;
    photo: string;
    created_at: Date;
    updated_at: Date;
}

export const processBenefit = (rawBenefit: BenefitRaw): BenefitView => ({
    id: rawBenefit.id,
    userId: rawBenefit.user_id,
    value: rawBenefit.value,
    description: rawBenefit.description,
    photo: rawBenefit.photo,
    createdAt: rawBenefit.created_at,
    updatedAt: rawBenefit.updated_at,
});

export const BenefitProperties = () => ({
    required: [
        "value",
        "description",
        "photo",
    ],
    optional: [
        "id",
        "user_id"
    ]
})
