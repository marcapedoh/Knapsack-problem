/// <reference types="vite/client" />


declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '*?worker' {
    const workerConstructor: new () => Worker;
    export default workerConstructor;
}
