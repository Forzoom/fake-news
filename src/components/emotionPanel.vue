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
                        @click="onClickEmotion(e)"
                    >
                        <i v-if="e !== -1"
                            :class="['icon_emotion', 'icon' + e]" 
                            :style="{'background-position': '0px ' + (e * -22) + 'px'}"
                        ></i>
                        <i v-else
                            class="icon_emotion del"
                        ></i>
                    </li>
                </ul>
            </div>
        </Touch>
        <ul class="emotion_navs" id="js_navbar">
            <!--<li class="emotion_nav"></li>-->
            <li v-for="i in panelCount" :class="['emotion_nav', {current: i === currentPanel}]"></li>
        </ul>
    </div>
</template>

<script>
    import Vue from 'vue';
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
                Vue.nextTick(() => {
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
                Vue.nextTick(() => {
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

<style>
    .emotion_panel {
        background-color: #f6f6f8;
        position: relative
    }
    
    .emotion_panel:before {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #e3e3e5;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5)
    }
    
    .emotion_panel:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e3e3e5;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5)
    }

    .icon_smiley_0 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_03518c6.png)
    }
    
    .icon_smiley_1 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_13518c6.png)
    }
    
    .icon_smiley_2 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_23518c6.png)
    }
    
    .icon_smiley_3 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_33518c6.png)
    }
    
    .icon_smiley_4 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_43518c6.png)
    }
    
    .icon_smiley_5 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_53518c6.png)
    }
    
    .icon_smiley_6 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_63518c6.png)
    }
    
    .icon_smiley_7 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_73518c6.png)
    }
    
    .icon_smiley_8 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_83518c6.png)
    }
    
    .icon_smiley_9 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_93518c6.png)
    }
    
    .icon_smiley_10 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_103518c6.png)
    }
    
    .icon_smiley_11 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_113518c6.png)
    }
    
    .icon_smiley_12 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_123518c6.png)
    }
    
    .icon_smiley_13 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_133518c6.png)
    }
    
    .icon_smiley_14 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_143518c6.png)
    }
    
    .icon_smiley_15 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_153518c6.png)
    }
    
    .icon_smiley_17 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_173518c6.png)
    }
    
    .icon_smiley_18 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_183518c6.png)
    }
    
    .icon_smiley_19 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_193518c6.png)
    }
    
    .icon_smiley_20 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_203518c6.png)
    }
    
    .icon_smiley_21 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_213518c6.png)
    }
    
    .icon_smiley_22 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_223518c6.png)
    }
    
    .icon_smiley_23 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_233518c6.png)
    }
    
    .icon_smiley_25 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_253518c6.png)
    }
    
    .icon_smiley_26 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_263518c6.png)
    }
    
    .icon_smiley_27 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_273518c6.png)
    }
    
    .icon_smiley_28 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_283518c6.png)
    }
    
    .icon_smiley_29 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_293518c6.png)
    }
    
    .icon_smiley_30 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_303518c6.png)
    }
    
    .icon_smiley_31 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_313518c6.png)
    }
    
    .icon_smiley_32 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_323518c6.png)
    }
    
    .icon_smiley_33 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_333518c6.png)
    }
    
    .icon_smiley_34 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_343518c6.png)
    }
    
    .icon_smiley_36 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_363518c6.png)
    }
    
    .icon_smiley_37 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_373518c6.png)
    }
    
    .icon_smiley_38 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_383518c6.png)
    }
    
    .icon_smiley_39 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_393518c6.png)
    }
    
    .icon_smiley_40 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_403518c6.png)
    }
    
    .icon_smiley_41 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_413518c6.png)
    }
    
    .icon_smiley_42 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_423518c6.png)
    }
    
    .icon_smiley_44 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_443518c6.png)
    }
    
    .icon_smiley_45 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_453518c6.png)
    }
    
    .icon_smiley_46 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_463518c6.png)
    }
    
    .icon_smiley_47 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_473518c6.png)
    }
    
    .icon_smiley_48 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_483518c6.png)
    }
    
    .icon_smiley_49 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_493518c6.png)
    }
    
    .icon_smiley_50 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_503518c6.png)
    }
    
    .icon_smiley_51 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_513518c6.png)
    }
    
    .icon_smiley_52 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_523518c6.png)
    }
    
    .icon_smiley_54 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_543518c6.png)
    }
    
    .icon_smiley_55 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_553518c6.png)
    }
    
    .icon_smiley_56 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_563518c6.png)
    }
    
    .icon_smiley_57 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_573518c6.png)
    }
    
    .icon_smiley_60 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_603518c6.png)
    }
    
    .icon_smiley_62 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_623518c6.png)
    }
    
    .icon_smiley_63 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_633518c6.png)
    }
    
    .icon_smiley_64 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_643518c6.png)
    }
    
    .icon_smiley_65 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_653518c6.png)
    }
    
    .icon_smiley_66 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_663518c6.png)
    }
    
    .icon_smiley_67 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_673518c6.png)
    }
    
    .icon_smiley_68 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_683518c6.png)
    }
    
    .icon_smiley_70 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_703518c6.png)
    }
    
    .icon_smiley_74 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_743518c6.png)
    }
    
    .icon_smiley_75 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_753518c6.png)
    }
    
    .icon_smiley_76 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_763518c6.png)
    }
    
    .icon_smiley_78 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_783518c6.png)
    }
    
    .icon_smiley_79 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_793518c6.png)
    }
    
    .icon_smiley_80 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_803518c6.png)
    }
    
    .icon_smiley_81 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_813518c6.png)
    }
    
    .icon_smiley_82 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_823518c6.png)
    }
    
    .icon_smiley_83 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_833518c6.png)
    }
    
    .icon_smiley_84 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_843518c6.png)
    }
    
    .icon_smiley_85 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_853518c6.png)
    }
    
    .icon_smiley_89 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_893518c6.png)
    }
    
    .icon_smiley_92 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_923518c6.png)
    }
    
    .icon_smiley_93 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_933518c6.png)
    }
    
    .icon_smiley_94 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_943518c6.png)
    }
    
    .icon_smiley_95 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/smiley/smiley_953518c6.png)
    }
    
    .icon_emoji_ios_0 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F6043518c6.png)
    }
    
    .icon_emoji_ios_1 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F6373518c6.png)
    }
    
    .icon_emoji_ios_2 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F6023518c6.png)
    }
    
    .icon_emoji_ios_3 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F61D3518c6.png)
    }
    
    .icon_emoji_ios_4 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F6333518c6.png)
    }
    
    .icon_emoji_ios_5 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F6313518c6.png)
    }
    
    .icon_emoji_ios_6 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F6143518c6.png)
    }
    
    .icon_emoji_ios_7 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F6123518c6.png)
    }
    
    .icon_emoji_wx_4 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_wx/2_043518c6.png)
    }
    
    .icon_emoji_wx_5 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_wx/2_053518c6.png)
    }
    
    .icon_emoji_wx_2 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_wx/2_023518c6.png)
    }
    
    .icon_emoji_wx_6 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_wx/2_063518c6.png)
    }
    
    .icon_emoji_wx_12 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_wx/2_123518c6.png)
    }
    
    .icon_emoji_wx_11 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_wx/2_113518c6.png)
    }
    
    .icon_emoji_ios_8 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F47B3518c6.png)
    }
    
    .icon_emoji_ios_9 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F64F.03518c6.png)
    }
    
    .icon_emoji_ios_10 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F4AA.03518c6.png)
    }
    
    .icon_emoji_ios_11 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F3893518c6.png)
    }
    
    .icon_emoji_ios_12 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_ios/u1F3813518c6.png)
    }
    
    .icon_emoji_wx_9 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_wx/2_093518c6.png)
    }
    
    .icon_emoji_wx_14 {
        background-image: url(//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/emotion_panel/emoji_wx/2_143518c6.png)
    }


    .emotion_list_wrp {
        overflow: hidden;
        position: relative;
        font-size: 0;
        white-space: nowrap;
    }
    .emotion_list_wrp.active {
        transition: transform 0.3s;
    }
    
    .emotion_list {
        display: inline-block;
        padding: 10px 0 0;
        width: 100%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        white-space: normal;
        vertical-align: top
    }
    
    .emotion_list:last-child .emotion_item.del {
        position: absolute;
        bottom: 0;
        right: 18px
    }

    .emotion_item {
        display: inline-block;
        width: 36px;
        height: 36px;
        margin-bottom: 5px;
        text-align: center;
        line-height: 36px
    }
</style>