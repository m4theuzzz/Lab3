export interface BoughtBenefictView {
    benefictId: number;
    userId: number;
    value: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BoughtBenefictRaw {
    benefict_id: number;
    user_id: number;
    value: number;
    created_at: Date;
    updated_at: Date;
}

export const processBoughtBenefict = (rawBoughtBenefict: BoughtBenefictRaw): BoughtBenefictView => ({
    benefictId: rawBoughtBenefict.benefict_id,
    userId: rawBoughtBenefict.user_id,
    value: rawBoughtBenefict.value,
    createdAt: rawBoughtBenefict.created_at,
    updatedAt: rawBoughtBenefict.updated_at,
});

export const BoughtBenefictProperties = () => ({
    required: [
        "benefict_id",
        "value",
    ],
    optional: [
        "user_id"
    ]
})
