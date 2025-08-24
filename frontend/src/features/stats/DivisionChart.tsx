import { AgCharts } from "ag-charts-react";

const myTheme = {
  palette: {
    fills: [
      "#cd4631",
      "#357ded",
      "#95c623",
      "#fca311",
      "#a14da0",
      "#2a2a2a",
      "#2e100b",
      "#101d30",
      "#192106",
      "#2d1d03",
    ],
    strokes: ["#000"],
  },
};

export const DivisionChart = (data: any) => {
  const options = {
    theme: myTheme,
    data: data.data.map((item: any) => ({
      division: item[0],
      shares: item[1],
    })),
    series: [
      {
        type: "donut" as const,
        calloutLabelKey: "division",
        angleKey: "shares",
        calloutLabel: {
          color: "#ffffff",
        },
      },
    ],
    background: {
      fill: "transparent",
    },
    legend: {
      enabled: false,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  };

  return <AgCharts options={options} />;
};
