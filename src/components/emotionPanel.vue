<template>
    <div class="emotion_panel" id="js_emotion_panel" v-if="visible">
        <span class="emotion_panel_arrow_wrp" id="js_emotion_panel_arrow_wrp">
            <i class="emotion_panel_arrow arrow_out"></i>
            <i class="emotion_panel_arrow arrow_in"></i>
        </span>
        <Touch
            @touch-down="onTouchDown"
            @touch-move="onTouchMove"
            @touch-up="onTouchUp"
        >
            <div class="emotion_list_wrp" :class="{active: transition}" id="js_slide_wrapper" :style="{width: panelCount + '00%', transform: 'translate3d(' + (translateX != 0 ? translateX + 'px' : 0) + ', 0px, 0px)', 'padding-left': padding + 'px'}">
                <!--<ul class="emotion_list"></ul>-->
                <!--<li class="emotion_item"><i class="icon_emotion"></i></li>-->
                <ul v-for="emotion in emotions" class="emotion_list" style="float: left;" :style="{width: (1 / panelCount) * 100 + '%'}">
                    <li v-for="e in emotion" 
                        :class="['emotion_item', 'js_emotion_item', {del: e === -1}]" 
                        :style="{width: emotionSize, height: emotionSize}"
                        @click="onClickEmotion(e)">
                        <i v-if="e !== -1"
                            :class="['icon_emotion', 'icon' + e]" 
                            :style="{'background-position': '0px ' + (e * -22) + 'px'}">
                        </i>
                        <i v-else
                            class="icon_emotion del"
                        ></i>
                    </li>
                </ul>
            </div>
        </Touch>
        <ul class="emotion_navs" id="js_navbar">
            <li v-for="i in panelCount" :class="['emotion_nav', {current: i === currentPanel}]"></li>
        </ul>
    </div>
</template>

<script>
    import {
        _Vue,
    } from '../install.js'
    import Touch from '@forzoom/touch';

    export default {
        name: 'EmotionPanel',
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
        },
        components: {
            Touch,
        },
        data() {
            return {
                rims: [],
                emotions: [],
                currentPanel: 1,
                emotionSize: 36,
                emotionCount: 99, // 总的表情的数量
                translateX: 0,
                transition: false,
            };
        },
        computed: {
            panelCount() {
                return this.emotions.length;
            },
            padding() {
                const width = window.innerWidth;
                return (width - (parseInt(width / this.emotionSize) * this.emotionSize)) / 2;
            },
        },
        watch: {
            rims(val) {
                this.generateEmotions();
            },
        },
        methods: {
            generateEmotions() {
                const emotions = [];
                for (let panel = 0, count = this.rims.length; panel < count; panel++) {
                    if (!emotions[panel]) {
                        emotions[panel] = [];
                    }
                    for (let j = this.rims[panel][0], len = this.rims[panel][1]; j < len; j++) {
                        emotions[panel].push(j);
                    }
                    emotions[panel].push(-1);
                }
                console.log(emotions);
                this.emotions = emotions;
            },
            floor: function(value, min, max) {
                return Math.min(Math.max(value, min), max);
            },
            round: function(value, min, step) {
                return min + Math.round((value - min) / step) * step;
            },
            onTouchDown() {
                this.transition = false;
            },
            onTouchUp({ startPos, currentPos, }) {
                const width = window.innerWidth;
                const distance = currentPos.x - startPos.x;
                this.transition = true;
                _Vue.nextTick(() => {
                    // console.log('target', Math.abs(distance), width);
                    if (Math.abs(distance) / width > 0.2) {
                        const prevPanel = this.currentPanel;
                        const currentPanel = this.floor(prevPanel + (distance > 0 ? -1 : 1), 1, this.panelCount);
                        this.currentPanel = currentPanel;
                        this.translateX = (currentPanel - 1) * (-width);
                    } else {
                        this.translateX = this.round(this.translateX, 0, window.innerWidth);
                    }
                });
            },
            onTouchMove(offset) {
                const width = window.innerWidth;
                let result = this.translateX + offset.x;
                result = Math.min(0, Math.max(result, -this.panelCount * width));
                _Vue.nextTick(() => {
                    this.translateX = result;
                });
            },
            onClickEmotion(index) {
                //
                this.$emit('emotion', index);
            },
        },
        mounted() {
            // 尝试处理大部分的逻辑，大致上保证5个页面的内容，如果是pad的话，是什么样的情况呢?
            const width = window.innerWidth;
            const count = parseInt(width / this.emotionSize); // 默认的大小为36
            const emotionPanelCount = count * 3 - 1;
            const panelCount = this.emotionCount % emotionPanelCount === 0 ? this.emotionCount / emotionPanelCount : parseInt(this.emotionCount / emotionPanelCount) + 1;

            const rims = [];
            for (let i = 0, len = panelCount; i < len; i++) {
                rims[i] = [
                    i * emotionPanelCount,
                    Math.min((i + 1) * emotionPanelCount, this.emotionCount),
                ];
            }
            this.rims = rims;
        },
    };
</script>