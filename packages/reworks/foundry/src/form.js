const typeHints = {
  skill: {
    points: { element: "input", type: "number" },
    difficulty: {
      element: "select",
      options: [
        {
          label: "Easy",
          value: 0,
        },
        {
          label: "Average",
          value: -1,
        },
        {
          label: "Hard",
          value: -2,
        },
        {
          label: "Very Hard",
          value: -3,
        },
        {
          label: "Wildcard",
          value: -3,
        },
      ],
    },
  },
  equipment: {
    quantity: { element: "input", type: "number" },
    weight: { element: "input", type: "number" },
    value: { element: "input", type: "number" },
  },
  trait: {
    levels: { element: "input", type: "number" },
  },
  template: {},
}
