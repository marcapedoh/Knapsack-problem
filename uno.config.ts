import { presetThemeDefault } from '@anu-vue/preset-theme-default';
import { presetAnu, presetIconExtraProperties } from 'anu-vue';
import { defineConfig, presetIcons, presetUno } from 'unocss';

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({
            scale: 1.2,
            extraProperties: presetIconExtraProperties,
        }),

        // anu-vue preset
        presetAnu(),

        // default theme preset
        presetThemeDefault(),
    ],

    content: {
        pipeline: {
            include: [/.*\/anu-vue\.js(.*)?$/, './**/*.vue', './**/*.md'],
        }
    }
});