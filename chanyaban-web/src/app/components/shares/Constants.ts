export const OPTION_CHART_SOURCE_TYPE: any = {
    top: 0,
    left: 0,
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
    animation: {
        duration: 2000,
        easing: 'out',
        startup: true
    },
    colors: ["#ffffff"],
    colorAxis: {
        minValue: 0, colors: ['#ce9e83', '#d4692d']
    },
    chartArea: { width: '90%', height: '90%' },
    legend: { position: 'none' },
    vAxis: {
        format: '0',
        maxValue: 10,
        minValue: 0,
        textPosition: 'none',
        gridlines: {
            color: 'transparent'
        }
    },
    hAxis: {
        textPosition: 'none',
        gridlines: {
            color: 'transparent'
        }
    },
    tooltip: {
        trigger: 'none'
    }
};

export const OPTION_CHART_BAR: any = {
    top: 0,
    left: 0,
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
    bar: { groupWidth: "80%" },
    max: "10",
    min: "0",
    annotations: {
        textStyle: {
            fontName: "prompt200"
        }
    },
    animation: {
        duration: 1000,
        easing: 'out',
        startup: true
    },
    chartArea: { width: '90%', height: '90%' },
    legend: { position: 'none' },
    vAxis: {
        format: '0',
        textStyle: {
            fontName: "prompt200",
            color: "#d4692c"
        },
        gridlines: {
            color: "#464545"
        }
    },
    tooltip: {
        textStyle: {
            fontName: "prompt200",
            color: '#d4692c',
            fontSize: 12
        }
    }
}; 
export const FORMAT_DATE: string = 'DD/MM/YY';
