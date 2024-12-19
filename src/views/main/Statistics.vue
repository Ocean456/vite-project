<template>
    <div id="statistics">
        <v-chart class="chart" :option="option"/>
    </div>
</template>

<script setup>
import {use} from "echarts/core";//导入echarts核心
import {CanvasRenderer} from "echarts/renderers";//导入画布渲染器
import {PieChart} from "echarts/charts";//导入饼图组件
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from "echarts/components";//导入标题提示和图例组件
import VChart, {THEME_KEY} from "vue-echarts";//导入vue-echarts组件
import {ref, provide, onMounted} from "vue";

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent
]);

provide(THEME_KEY, "dark"); //主题

const option = ref({  //配置项
    title: {
        text: "Traffic Sources",
        left: "center"
    },
    tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: "vertical",
        left: "left",
        data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"]
    },
    series: [
        {
            name: "Traffic Sources",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
                {value: 335, name: "Direct"},
                {value: 310, name: "Email"},
                {value: 234, name: "Ad Networks"},
                {value: 135, name: "Video Ads"},
                {value: 1548, name: "Search Engines"}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                }
            }
        }
    ]
});


onMounted(() => {
    window.electronAPI.setWindow({width: 1080, height: 720});
});
</script>

<style scoped>

</style>
