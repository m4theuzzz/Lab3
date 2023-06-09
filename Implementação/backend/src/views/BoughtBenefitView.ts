export interface BoughtBenefitView {
    benefitId: number;
    userId: number;
    value: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BoughtBenefitRaw {
    benefit_id: number;
    user_id: number;
    value: number;
    created_at: Date;
    updated_at: Date;
}

export const processBoughtBenefit = (rawBoughtBenefit: BoughtBenefitRaw): BoughtBenefitView => ({
    benefitId: rawBoughtBenefit.benefit_id,
    userId: rawBoughtBenefit.user_id,
    value: rawBoughtBenefit.value,
    createdAt: rawBoughtBenefit.created_at,
    updatedAt: rawBoughtBenefit.updated_at,
});

export const BoughtBenefitProperties = () => ({
    required: [
        "benefit_id",
        "value",
    ],
    optional: [
        "user_id"
    ]
})
