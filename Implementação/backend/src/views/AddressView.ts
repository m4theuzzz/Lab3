export interface Address {
    id: string,
    patientId: string,
    state: string,
    city: string,
    district: string,
    country: string,
    userId: string,
    createdAt: string,
    updatedAt: string,
}

export interface AddressRaw {
    id: string,
    patient_id: string,
    state: string,
    city: string,
    district: string,
    country: string,
    user_id: string,
    created_at: string,
    updated_at: string,
}

export function processAddress(raw: AddressRaw): Address {
    return {
        id: raw.id,
        patientId: raw.patient_id,
        state: raw.state,
        city: raw.city,
        district: raw.district,
        country: raw.country,
        userId: raw.user_id,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    };
}

export function AddressProperties() {
    return {
        required: [
            "patient_id",
            "state",
            "country"
        ],
        optional: [
            "id",
            "district",
            "city",
        ]
    }
}
