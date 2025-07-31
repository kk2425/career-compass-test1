import { AptitudeScores, InterestScores, CareerProfile } from '../types';

const calculateDistance = (userVec: number[], careerVec: number[]): number => {
    let sum = 0;
    // Ensure vectors are same length for comparison, though they should be
    const length = Math.min(userVec.length, careerVec.length);
    for (let i = 0; i < length; i++) {
        sum += Math.pow((userVec[i] || 0) - (careerVec[i] || 0), 2);
    }
    return Math.sqrt(sum);
};

export const findTopCareerMatches = (
    aptitudeScores: AptitudeScores,
    interestScores: InterestScores,
    careers: CareerProfile[]
): CareerProfile[] => {
    // Define key order to ensure vectors are consistent for comparison
    const aptitudeKeys: (keyof AptitudeScores)[] = ['verbal', 'logical', 'spatial', 'numerical'];
    const interestKeys: (keyof InterestScores)[] = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'];

    const userAptitudeVector = aptitudeKeys.map(key => aptitudeScores[key]);
    const userInterestVector = interestKeys.map(key => interestScores[key]);
    const userVector = [...userAptitudeVector, ...userInterestVector];

    const scoredCareers = careers.map(career => {
        const careerAptitudeVector = aptitudeKeys.map(key => career.aptitude[key] || 0);
        const careerInterestVector = interestKeys.map(key => career.interest[key] || 0);
        const careerVector = [...careerAptitudeVector, ...careerInterestVector];
        
        const distance = calculateDistance(userVector, careerVector);
        return { ...career, distance };
    });

    scoredCareers.sort((a, b) => a.distance - b.distance);

    return scoredCareers.slice(0, 3);
};