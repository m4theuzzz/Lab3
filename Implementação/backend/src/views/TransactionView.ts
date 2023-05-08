export interface TransactionView {
    id: number;
    type: string;
    value: number;
    description: string;
    origin: number;
    target: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionRaw {
    id: number;
    type: string;
    value: number;
    description: string;
    origin: number;
    target: number;
    created_at: Date;
    updated_at: Date;
}

export const processTransaction = (rawTransaction: TransactionRaw): TransactionView => ({
    id: rawTransaction.id,
    type: rawTransaction.type,
    value: rawTransaction.value,
    description: rawTransaction.description,
    origin: rawTransaction.origin,
    target: rawTransaction.target,
    createdAt: rawTransaction.created_at,
    updatedAt: rawTransaction.updated_at,
});

export const TransactionProperties = () => ({
    required: [
        "type",
        "value",
        "description",
        "origin",
        "target"
    ],
    optional: [
        "id",
    ]
})
