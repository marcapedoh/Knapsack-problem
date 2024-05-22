
<script lang="ts" setup>
import {ABtn, ACard, AInput, ATable} from "anu-vue";
import {computed, ref} from "vue";
import knapsackWorker from './knapsack.worker?worker';
import {generateItems} from './knapsack';
import DotGraph from "./components/DotGraph.vue";
import LineGraph from "@/components/LineGraph.vue";

const itemsWeightRange = ref({ min: 1, max: 20 });
const itemsValueRange= ref({min:1, max:20});
const generationCount= ref(20);
const populationSize= ref(100);
const mutationRate= ref(0.01);
const itemCount=ref(20);
const backpackCapacity=ref(100);
const initialGenes= ref<'random'| 'zero' | 'one'>('random');
const weightRange=ref({min:1,max:20});
const valueRange=ref({min:1,max:20});
const tournamentSampleSize=ref(5);

const knapsackResult= ref<{ stats:{ weight:number; generation:number; bestFitness:number; bestIndividual:number[]}[]; items:{weight:number;value:number}[]; duration:number}>();
const state= ref<'idle'| 'computing'>('idle');
const worker= new knapsackWorker();
const items= ref<{weight:number; value:number}[]>(generateItems({itemsCount:itemCount.value, weightRange:weightRange.value,valueRange: valueRange.value}).items);

const bestResult= computed(()=>{
  if (!knapsackResult.value || knapsackResult.value.stats.length === 0) return undefined;

  const bestIndividual= knapsackResult.value.stats.at(-1);
  if (!bestIndividual) return undefined;
  return {
    weight:bestIndividual.weight,
    value: bestIndividual.bestFitness,
    items:items.value.filter((_, i) => bestIndividual[i]),
    individual: bestIndividual,
  }
});

worker.onmessage=(event)=>{
  knapsackResult.value=event.data;

  state.value='idle';
};

function computeKnapsack(){
  state.value='computing';
  worker.postMessage(
      JSON.stringify({
        generationCount:generationCount.value,
        populationSize:populationSize.value,
        mutationRate:mutationRate.value,
        itemsCount:itemCount.value,
        backpackCapacity:backpackCapacity.value,
        initialGenes:initialGenes.value,
        weightRange:weightRange.value,
        valueRange:valueRange.value,
        tournamentSampleSize:tournamentSampleSize.value,
        items:items.value,
      }),
  );

}

function regenerateItems(){
  items.value= generateItems({itemsCount:itemCount.value, weightRange:itemsWeightRange.value, valueRange: itemsValueRange.value}).items;

}
</script>

<template>
  <div class="w-screen">
    <div class="p-6 py-5 border-gray-200">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="text-lg a-title">Genetic Knapsack problem</div>
        <div class="text-sm text-center">A genetic algorithm to solve the knapsack problem</div>
        <div class="text-sm">by <a href="https://github.com/marcapedoh/knapsack-problem" target="_blank" class="text-blue-500" rel="noopener noreferrer">Marc</a> &nbsp; inspired by<a href="https://github.com/CorentinTh" target="_blank" class="text-blue-500" rel="noopener noreferrer">CorentinTh</a></div>
      </div>
    </div>

    <div class="flex flex-col py-6 gap-4 max-w-7xl mx-auto pa-6">
      <ACard class="pa-6 flex-1" title="" subtitle="" text="" color="primary">
        <div class="a-title">What?</div>
        <div class="my-4">
          The knapsack problem is a problem in combinatorial optimization:Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that
          the total weight is less than or equal to a given limit and the total value is a  large possible.
        </div>
        <div>
          Genetic algorithms are a class of search, adaptation, and optimization algorithms based on the principles of natural evolution. They are frequently used to find optimal or near-optimal
          solutions to difficult problems which otherwise would take a lifetime to solve.
        </div>
      </ACard>
      <div class="flex gap-4 w-full md:flex-row flex-col">
        <ACard class="pa-6 flex-1" title="" subtitle="" text="" color="primary">
          <div class="a-title">Items</div>
          <div class="flex-1 flex gap-3 flex-col my-3">
            <div class="flex gap-3 w-full flex-1">
              <div class="flex flex-col">
                <label for="itemCountInput" class="text-sm text-gray-700">Min weight</label>
                <input id="itemCountInput" type="number" v-model="itemCount" class="w-22 text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
              </div>
              <div class="flex flex-col">
                <label for="backpackInput" class="text-sm text-gray-700">Backpack capacity</label>
                <input id="backpackInput" type="number" v-model="backpackCapacity" class="w-22 text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
              </div>
            </div>
            <div class="flex gap-3 w-full flex-1">
              <div class="flex gap-3 w-full flex-1">
                <div class="flex flex-col">
                  <label for="weightInput" class="text-sm text-gray-700">Min weight</label>
                  <input id="weightInput" type="number" v-model="itemsWeightRange.min" class="w-22 text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
                </div>
                <div class="flex flex-col">
                  <label for="weightInput" class="text-sm text-gray-700">Max weight</label>
                  <input id="weightInput" type="number" v-model="itemsWeightRange.max" class="w-22 text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
                </div>
              </div>

              <div class="flex gap-3 w-full flex-1">
                <div class="flex flex-col">
                  <label for="valueInput" class="text-sm text-gray-700">Min value</label>
                  <input id="valueInput" type="number" v-model="itemsValueRange.min" class="w-22 text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
                </div>
                <div class="flex flex-col">
                  <label for="valueInput" class="text-sm text-gray-700">Max value</label>
                  <input id="valueInput" type="number" v-model="itemsValueRange.max" class="w-22 text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
                </div>
              </div>
            </div>
          </div>

          <ABtn icon="bx bx-right-arrow-circle" appendIcon="bx bx-right-arrow-circle" @click="regenerateItems" class="w-full">Generate random items</ABtn>
        </ACard>
        <ACard class="pa-6 flex-1" title="" subtitle="" text="" color="primary">
          <div class="a-title">Parameters</div>

          <div class="flex-1 flex gap-3 flex-col my-3">
            <div class="flex gap-3 w-full flex-1">
              <div class="flex flex-col">
                <label for="generationCountInput" class="text-sm text-gray-700">Generation count</label>
                <input id="generationCountInput" type="number" v-model="generationCount" class="text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
              </div>
              <div class="flex flex-col">
                <label for="populationSizeInput" class="text-sm text-gray-700">Population size</label>
                <input id="populationSizeInput" type="number" v-model="populationSize" class="text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
              </div>
            </div>
            <div class="flex gap-3 w-full flex-1">
              <div class="flex flex-col">
                <label for="mutationRateInput" class="text-sm text-gray-700">Mutation rate</label>
                <input id="tournamentSampleSizeInput" type="number" v-model="mutationRate" class="text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
              </div>
              <div class="flex flex-col">
                <label for="populationSizeInput" class="text-sm text-gray-700">Tournament sample size</label>
                <input id="populationSizeInput" type="number" v-model="tournamentSampleSize" class="text-sm border-2 border-gray-200 outline-none p-2 rounded-lg">
              </div>
            </div>
          </div>

          <ABtn icon="bx bx-right-arrow-circle" appendIcon="bx bx-right-arrow-circle"  @click="computeKnapsack" class="w-full" :disabled="state === 'computing'" :loading="state === 'computing'">Compute</ABtn>
        </ACard>
      </div>
      <div v-if="items" class="flex flex-col gap-4">
        <div class="flex gap-4 items-start">
          <div class="flex-1">
            <ACard class="pa-6" title="" subtitle="" text="" color="primary">
              <div class="a-title">All available items</div>
              <div class="flex gap-2 flex-wrap justify-start mt-4">
                <div v-for="(item,i) of items" :key="i" class="flex flex-col items-center bg-purple rounded pa-2 min-w-52px text-white">
                  <div class="font-bold">{{item.value}}</div>
                  <div>{{item.weight}} kg</div>
                </div>
              </div>

              <div class="my-4 border-b border-gray-400"></div>
              <div class="a-title">
                Backpack capacity: <span class="font-bold">{{backpackCapacity}}kg</span>
              </div>
            </ACard>
          </div>

          <DotGraph class="flex-1" :data="items.map((s)=>({x:s.weight,y:s.value}))" title="Items weight/value repartition" x-label="Weight" y-label="Value"  />
        </div>
      </div>
      <div v-if="state==='idle' && knapsackResult">
        <div class="font-bold text-3xl text-center mt-6 mb-3">Results</div>
        <div class="flex flex-col gap-4">
          <div class="flex gap-4 flex-col md:flex-row">
            <ACard class="pa-6 md:max-w-400px" v-if="bestResult" title="" subtitle="" text="" color="primary">
              <div class="a-title">Best item combination</div>
              <div class="flex gap-2 flex-wrap justify-start mt-4">
                <div v-for="(item,i) of bestResult.items" :key="i" class="flex flex-col items-center bg-purple rounded pa-2 min-w-52px text-white">
                  <div class="font-bold">{{item.value}}</div>
                  <div>{{item.weight}}kg</div>
                </div>
              </div>
              <div class="my-4 border-b border-gray-400"></div>
              <div><span class="inline-block w-160px font-bold text-right mr-4">Total value:</span>{{bestResult.value}}</div>
              <div><span class="inline-block w-160px font-bold text-right mr-4">Total weight:</span>{{bestResult.weight}}</div>
              <div><span class="inline-block w-160px font-bold text-right mr-4">Backpack capacity:</span>{{backpackCapacity}}kg</div>
            </ACard>
            <LineGraph class="flex-1" :data="knapsackResult.stats.map((s)=>({x:s.generation,y:s.bestFitness}))"  title="Best fitness per generation" x-label="Generation" y-label="Fitness"/>
          </div>
          <div class="flex gap-4 items-start">
            <ACard class="pa-6 flex-1" title="" subtitle="" text="" color="primary">
              <div class="a-title">Generation breakdown</div>
              <ATable :rows="knapsackResult.stats"></ATable>
            </ACard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style>
</style>
