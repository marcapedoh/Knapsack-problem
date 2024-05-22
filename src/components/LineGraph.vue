<script setup lang="ts">
import {ACard} from "anu-vue";
import Chart from 'chart.js/auto';
import {onMounted, ref, toRefs} from "vue";

const chart=ref<Chart>();
const chartCanvasEl=ref<HTMLCanvasElement>();

const props=withDefaults(
    defineProps<{
      data?:{x:number; y:number}[];
      xLabel?:string;
      xMin?:number;
      xMax?:number;
      yLabel?:string;
      yMin?:number;
      yMax?:number;
      title?:string;
    }>(),
    {
      data:()=>[],
      xLabel:undefined,
      xMin:undefined,
      xMax:undefined,
      yLabel:undefined,
      yMin:undefined,
      yMax:undefined,
      title:undefined,
    }
);

const {data, xLabel,xMin,xMax,yLabel,yMin,yMax,title}=toRefs(props);

onMounted(()=>{
  if(!chartCanvasEl.value) return;
  chart.value= new Chart(chartCanvasEl.value,{
    type:'line',
    data:{
      labels:data.value.map((d)=>d.x),
      datasets:[
        {
          label:'Dataset',
          data:data.value.map((d)=>d.y),
        }

      ]
    },
    options:{
      plugins:{
        legend:{
          display:false,
        },
        tooltip:{
          enabled:false,
        }
      },
      scales:{
        x:{
          title:{
            display:!!xLabel.value,
            text:xLabel.value,
          },
          min:xMin.value,
          max:xMax.value,
        },
        y:{
          title:{
            display:!!yLabel.value,
            text:yLabel.value,
          },
          min:yMin.value,
          max:yMax.value,
        }
      }
    }
  })
})
</script>

<template>
  <ACard class="pa-6">
    <div class="a-title mb-4">{{title}}</div>
    <div>
      <canvas ref="chartCanvasEl" class="w-full"></canvas>
    </div>
  </ACard>
</template>

<style scoped>

</style>