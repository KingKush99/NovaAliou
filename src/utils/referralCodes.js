// Mock referral code validation
// In production, this would check against a database

const VALID_CODES = [
    'ADMIN2024',
    'MODEL123',
    'CREATOR456',
    'STREAM789',
    'TALENT001'
];

export const validateReferralCode = (code) => {
    return VALID_CODES.includes(code.toUpperCase());
};

export const getCodeInfo = (code) => {
    const upperCode = code.toUpperCase();
    if (upperCode.startsWith('ADMIN')) {
        return { type: 'admin', bonus: 100 };
    } else if (upperCode.startsWith('MODEL') || upperCode.startsWith('CREATOR')) {
        return { type: 'model', bonus: 50 };
    }
    return { type: 'standard', bonus: 25 };
};
