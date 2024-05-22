import _ from 'lodash';

type Item={weight:number; value:number};
type Individual= number[];
type ValueRange={min:number; max:number};

export { generateItems, solveKnapsack};


function initializePopulation({populationSize,initialGenes,items}: {populationSize:number; initialGenes?:'random'| 'zeros' |'ones'; items:Item[]}){
    const initialGenesFn={
        random: ()=> _.round(Math.random()),
        zeros: ()=> 0,
        ones: ()=>1,
    }[initialGenes ?? 'random'];

    return _.times(populationSize,()=> _.times(items.length, initialGenesFn));
}

function computeFitness({individual,items, backpackCapacity}: {individual: Individual; items:Item[]; backpackCapacity:number}){
    const selectedItems= getPresentItems({individual, items});

    const totalWeight= selectedItems.reduce((acc,{weight })=> acc+weight,0);
    const totalValue= selectedItems.reduce((acc, {value})=>acc + value,0);

    return totalWeight <= backpackCapacity ? totalValue:0;
}

function getPresentItems({individual,items}:{individual: Individual;items:Item[]}):Item[]{
    return individual.reduce((acc,gene,index)=> (gene===1 ? [...acc,items[index]]:acc), [] as Item[]);
}

function selectParents({population, items, backpackCapacity, tournamentSampleSize}: {population:Individual[];items:Item[]; backpackCapacity:number; tournamentSampleSize:number}){
    const tournamentSelect=()=>{
        const tournament= _.sampleSize(population, tournamentSampleSize);
        const{individual}= getBestIndividual({population:tournament, items, backpackCapacity});
        return individual;
    };
    return [tournamentSelect(), tournamentSelect()];
}

function crossover({parent1, parent2}: {parent1:Individual; parent2:Individual}){
    const crossoverPoint=Math.floor(Math.random()* parent1.length);
    return [...parent1.slice(0,crossoverPoint), ...parent2.slice(crossoverPoint)];
}

function mutate({individual,mutationRate}:{individual:Individual;mutationRate:number}){
    return individual.map((gene)=> (Math.random()<mutationRate ? 1- gene: gene));
}

function getWeight({individual,items}:{individual:Individual; items:Item[]}){
    return getPresentItems({individual,items}).reduce((acc,{weight})=> acc+ weight,0);
}

function getBestIndividual({population,items,backpackCapacity}:{population:Individual[],items:Item[],backpackCapacity:number}):{
    individual:Individual;
    fitness:number;
    weight:number;
}{
    return _.chain(population)
        .map((individual:Individual)=>({individual, fitness:computeFitness({individual,items,backpackCapacity}), weight:getWeight({individual,items})}))
        .maxBy('fitness')
        .value();
}

function generateItems({itemsCount, weightRange,valueRange}: {itemsCount:number;weightRange:ValueRange; valueRange:ValueRange}){
    const items:Item[]= _.times(itemsCount, ()=>({
        weight: _.random(weightRange.min, weightRange.max),
        value:_.random(valueRange.min,valueRange.max),
    }));

    return {
        items,
    };
}

function solveKnapsack({
                           generationCount,
                           populationSize,
                           mutationRate,
                           itemsCount,
                           backpackCapacity,
                           initialGenes,
                           weightRange,
                           valueRange,
                           tournamentSampleSize,
                           items,
                       }:{
    generationCount:number;
    populationSize:number;
    mutationRate:number;
    itemsCount:number;
    backpackCapacity:number;
    initialGenes?:'random' | 'zeros' | 'ones';
    weightRange:ValueRange;
    valueRange:ValueRange;
    tournamentSampleSize:number;
    items:Item[];
}){
    let population= initializePopulation({populationSize,initialGenes,items});
    const stats:any[]=[];

    const startedAt= performance.now();
    _.times(generationCount, (generation:number)=>{
        population= population.map(()=>{
            const [parent1, parent2]= selectParents({population,items,backpackCapacity,tournamentSampleSize});
            const child= crossover({parent1,parent2});
            const mutatedChild=mutate({individual:child,mutationRate});
            return mutatedChild;
        });
        const {individual:bestInvidual,fitness: bestFitness, weight}= getBestIndividual({population,items, backpackCapacity});
        stats.push({generation,bestFitness,bestInvidual,weight});
    });

    const finishedAt=performance.now();
    const duration=Math.round(finishedAt-startedAt);

    return {stats,items,duration};
}