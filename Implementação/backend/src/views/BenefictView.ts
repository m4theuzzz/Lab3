export interface BenefictView {
    id: number;
    userId: number;
    value: number;
    description: string;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BenefictRaw {
    id: number;
    user_id: number;
    value: number;
    description: string;
    photo: string;
    created_at: Date;
    updated_at: Date;
}

export const processBenefict = (rawBenefict: BenefictRaw): BenefictView => ({
    id: rawBenefict.id,
    userId: rawBenefict.user_id,
    value: rawBenefict.value,
    description: rawBenefict.description,
    photo: rawBenefict.photo,
    createdAt: rawBenefict.created_at,
    updatedAt: rawBenefict.updated_at,
});

export const BenefictProperties = () => ({
    required: [
        "userId",
        "value",
        "description",
        "photo",
    ],
    optional: [
        "id",
        "user_id"
    ]
})
