// Event cards data - the two main events in the game
export const EVENT_CARDS = [
  {
    id: 1,
    title: "Workforce Shock",
    subtitle: "We Need 30 Workers Now",
    icon: "⚠️",
    description: "A sudden rise in construction demand and a wave of retirements create an urgent need for 30 new workers. SMEs need 10 workers, Large Employers need 20 workers. All actors must coordinate to move jobseekers → training → employment.",
    severity: "critical",
    type: "workforce",
    smeDemand: 10,
    largeDemand: 20,
    targetWorkers: 25,
    rules: [
      "Players must collectively attempt to fill at least 25 out of 30 required positions",
      "Jobseekers cannot be employed without training",
      "Training can only occur if the Educator and Employers both support it",
      "Servicepunt must participate in matching jobseekers to training/employment",
      "Each actor makes one decision that either enables or limits training, matching, or hiring"
    ],
    successFactors: [
      "At least 25 workers successfully move from jobseeker → training → employment",
      "Training capacity was maintained or expanded",
      "Matching was coordinated and uninterrupted",
      "No actor blocked the flow (training, matching, or hiring)"
    ],
    failureFactors: [
      "Fewer than 25 workers reach employment",
      "Training capacity becomes insufficient",
      "Servicepunt cannot match candidates",
      "Employers refuse or delay hiring",
      "Educator cannot provide required training"
    ]
  },
  {
    id: 2,
    title: "Funding Crisis",
    subtitle: "Subsidies Have Ended — Build a Structural Fund",
    icon: "⚠️",
    description: "A national funding shift causes temporary subsidies to collapse. The Servicepunt loses all temporary funding, and the Educator loses a significant portion of its training capacity. Actors must collectively build a shared structural fund to keep training and matching operational.",
    severity: "critical",
    type: "funding",
    targetFund: 20,
    rules: [
      "All temporary funding loses 75% of its value",
      "Servicepunt loses all temporary funding",
      "Educator training capacity is reduced unless structural funding is contributed",
      "The group must collectively reach 20 structural-equivalent tokens in a shared fund",
      "Each actor makes one decision to invest (or not) in the structural fund"
    ],
    successFactors: [
      "A shared structural fund of 20 structural-equivalent tokens is achieved",
      "Servicepunt is able to continue operating",
      "Educator training capacity is restored sufficiently to run programs",
      "At least some employers contribute structural funding"
    ],
    failureFactors: [
      "Structural fund total remains below 20",
      "Servicepunt remains unfunded",
      "Educator cannot run training programs",
      "Employers refuse to contribute",
      "Not enough structural contributions are made"
    ]
  }
];
