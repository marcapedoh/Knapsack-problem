<script setup lang="ts">

import {ACard} from "anu-vue";
import Chart from 'chart.js/auto';
import {onMounted, ref, toRefs} from "vue";

const chart= ref<Chart>();
const chartCanvasEl= ref<HTMLCanvasElement>();

const props= withDefaults(
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

  chart.value=new Chart(chartCanvasEl.value,{
    type:'scatter',
    data:{
      labels:[],
      datasets:[
        {
          label:'Dataset',
          data:data.value,
        }
      ],
    },
    options:{
      plugins:{
        legend:{
          display:false,
        },
      },
      responsive:true,
      maintainAspectRatio:false,
      scales:{
        x:{
          title:{
            display:true,
            text:xLabel.value
          },
          min:xMin.value,
          max:xMax.value,
        },
        y:{
          title:{
            display:true,
            text:yLabel.value,
          },
          min:yMin.value,
          max:yMax.value,
        }
      }
    }

  });
});
</script>

<template>
  <ACard class="pa-6" title="" subtitle="" text="" color="primary">
    <div class="a-title mb-4">{{title}}</div>
    <div>
      <canvas ref="chartCanvasEl" class="w-full"></canvas>
    </div>
  </ACard>
</template>

<style scoped>

</style>