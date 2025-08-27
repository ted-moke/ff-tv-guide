import { AgCharts } from "ag-charts-react";
import { useColors } from "../../styles/useColors";



export const DivisionChart = (data: any) => {
  const colors = useColors();

  const myTheme = {
    palette: {
      fills: [
        colors.red.base,
        colors.blue.base,
        colors.green.base,
        colors.yellow.base,
        colors.purple.base,
        colors.background.light,
        colors.purple.text,
        colors.background.offset2,
      ],  
      strokes: [colors.background.light ],
    },
    params: {
      tooltipBackgroundColor: colors.background.offset,
      tooltipTextColor: colors.text.primary,
    },
  };
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
          color: colors.text.primary,
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
