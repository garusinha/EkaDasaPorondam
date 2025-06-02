// src/VastuFactors.js (Updated)

export const INCHES_PER_RIYAN = 31.0;

export const VASTU_FACTOR_DEFINITIONS = [
  {
    name: "Aya",
    multiplier: 8,
    divisor: 12,
    isGood: (balance) => balance >= 5,
    defaultColor: "rgba(0, 102, 102, 1)",
  },
  {
    name: "Waya",
    multiplier: 9,
    divisor: 10,
    isGood: (balance) => balance <= 5,
    defaultColor: "rgba(0, 102, 102, 1)",
  },
  {
    name: "Ayusa",
    multiplier: 27,
    divisor: 100,
    isGood: (balance) => balance >= 50,
    defaultColor: "rgba(0, 102, 102, 1)",
  },
  {
    name: "Yoni",
    multiplier: 3,
    divisor: 8,
    isGood: (balance) => [1, 3, 4, 7].includes(balance),
    defaultColor: "rgba(0, 102, 102, 1)",
  },
  {
    name: "Nakatha",
    multiplier: 8,
    divisor: 27,
    isGood: (balance) =>
      [2, 5, 7, 9, 11, 14, 16, 18, 20, 23, 25, 27].includes(balance),
    defaultColor: "rgba(0, 102, 102, 1)",
  },
  {
    name: "Dhinaya",
    multiplier: 9,
    divisor: 7,
    isGood: (balance) => [1, 2, 3, 6].includes(balance),
    defaultColor: "rgba(0, 102, 102, 1)",
  },
  {
    name: "Anshaka",
    multiplier: 4,
    divisor: 9,
    isGood: (balance) => [1, 3, 5, 6].includes(balance),
    defaultColor: "rgba(0, 102, 102, 1)",
  },
  {
    name: "Rashi",
    multiplier: 5,
    divisor: 12,
    isGood: (balance) => true, // Neutral, no specific good/bad
    defaultColor: "blue",
  },
  {
    name: "Thithi",
    multiplier: 9,
    divisor: 30,
    isGood: (balance) => true, // Neutral, no specific good/bad
    defaultColor: "blue",
  },
  {
    name: "Wanshaya",
    multiplier: 3,
    divisor: 4,
    isGood: (balance) => [1, 2, 3].includes(balance),
    defaultColor: "rgba(0, 102, 102, 1)",
  },
  {
    name: "Dewatha",
    multiplier: 5,
    divisor: 3,
    isGood: (balance) => [1, 2].includes(balance),
    defaultColor: "rgba(0, 102, 102, 1)",
  },
];

// Helper to calculate balance, ensuring the base area is an integer for modulus.
export const calculateBalanceForArea = (baseAreaValue, factor) => {
  const integerBase = Math.floor(baseAreaValue); // Use the integer part of the area
  return (integerBase * factor.multiplier) % factor.divisor;
};

export const getVastuFactorColor = (factor, balance) => {
  if (factor.name === "Rashi" || factor.name === "Thithi") {
    return "blue";
  }
  return factor.isGood(balance) ? "darkgreen" : "darkred";
};

// Overall status logic will remain based on the Wadu Riyan results for consistency
// as that is the traditional primary measure for overall dimension status.
export const evaluateOverallStatus = (vastuResultsWaduRiyan) => {
  const ayaGood = vastuResultsWaduRiyan.find((f) => f.name === "Aya")?.isGood;
  const wayaGood = vastuResultsWaduRiyan.find((f) => f.name === "Waya")?.isGood;
  const ayusaGood = vastuResultsWaduRiyan.find(
    (f) => f.name === "Ayusa"
  )?.isGood;

  let otherFactorsGoodCount = 0;
  const nonSpecialFactors = [
    "Yoni",
    "Nakatha",
    "Dhinaya",
    "Anshaka",
    "Wanshaya",
    "Dewatha",
  ];
  vastuResultsWaduRiyan.forEach((factor) => {
    if (nonSpecialFactors.includes(factor.name) && factor.isGood) {
      otherFactorsGoodCount++;
    }
  });

  const isOverallGood =
    ayaGood && wayaGood && ayusaGood && otherFactorsGoodCount >= 2;
  return {
    status: isOverallGood
      ? "Overall Status: This dimension is GOOD!"
      : "Overall Status: This dimension is NOT GOOD!",
    color: isOverallGood ? "darkgreen" : "darkred",
  };
};
