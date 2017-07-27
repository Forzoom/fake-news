<template>
    <div>
        <!-- 发表留言 -->
        <div id="js_cmt_mine" class="discuss_container editing access" style="display: block;">
            <div class="discuss_container_inner">
                <h2 class="rich_media_title">{{title}}</h2>
                <span id="log"></span>
                <div class="frm_textarea_box_wrp">
                    <span class="frm_textarea_box">
                        <textarea 
                            v-model="content"
                            id="js_cmt_input" class="frm_textarea" placeholder="留言将由公众号筛选后显示，对所有人可见。" style="transform: translate3d(0px, 0px, 0px);"></textarea>
                        <div class="emotion_tool">
                        <span class="emotion_switch" style="display:none;"></span>
                        <span id="js_emotion_switch" class="pic_emotion_switch_wrp" @touchstart="onToggleEmotionPanel">
                            <img class="pic_default" src="//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/appmsg/emotion/icon_emotion_switch.2x2f1273.png" alt="" />
                            <img class="pic_active" src="//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/appmsg/emotion/icon_emotion_switch_active.2x2f1273.png" alt="" />
                        </span>
                        <EmotionPanel :visible="visible" @emotion="onEmotion"></EmotionPanel>
                    </div>
                    </span>
                </div>
                <div class="discuss_btn_wrp"><a id="js_cmt_submit" class="btn btn_primary btn_discuss" :class="{btn_disabled: !isComplete && !isRequesting}" href="javascript:;" @click="onSubmit">提交</a></div>
                <div class="discuss_list_wrp" style="display:none">
                    <div class="rich_tips with_line title_tips discuss_title_line"> <span class="tips">我的留言</span> </div>
                    <ul class="discuss_list" id="js_cmt_mylist"></ul>
                </div>
                <div class="rich_tips tips_global loading_tips" id="js_mycmt_loading" style="display: none;"> <img src="//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/icon_loading_white2805ea.gif" class="rich_icon icon_loading_white" alt=""> <span class="tips">加载中</span> </div>
                <div class="wx_poptips" id="js_cmt_toast" v-if="toastVisible"> <img alt="" class="icon_toast" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAABqCAYAAABUIcSXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMTUxMzkxZS1jYWVhLTRmZTMtYTY2NS0xNTRkNDJiOGQyMWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTA3QzM2RTg3N0UwMTFFNEIzQURGMTQzNzQzMDAxQTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTA3QzM2RTc3N0UwMTFFNEIzQURGMTQzNzQzMDAxQTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NWMyOGVjZTMtNzllZS00ODlhLWIxZTYtYzNmM2RjNzg2YjI2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIxNTEzOTFlLWNhZWEtNGZlMy1hNjY1LTE1NGQ0MmI4ZDIxYiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmvxj1gAAAVrSURBVHja7J15rF1TFMbXk74q1ZKHGlMkJVIhIgg1FH+YEpEQJCKmGBpThRoSs5jVVNrSQUvEEENIhGiiNf9BiERICCFIRbUiDa2qvudbOetF3Tzv7XWGffa55/uS7593977n3vO7e5+199p7v56BgQGh0tcmvAUERREUQVEERREUQVEERREUQVEERREUQVEERREUQVEERREUQVEERVAUQVEERVAUQbVYk+HdvZVG8b5F0xj4RvhouB+eCy8KrdzDJc1RtAX8ILxvx98V1GyCSkN98Cx4z/95/Wn4fj6j6tUEeN4wkFSnw1MJqj5NhBfAuwaUHREUg4lqNMmePVsHll/HFhVfe1t3FwpJI8DXCCquDrCWNN4B6Tb4M3Z98aTPmTvh0YHl18PXw29yZiKejoPvcUD6E74yFBJbVDk6Bb7K8aP/Hb4c/tRzEYIqprPhSxzlf4Uvhb/0Xoig8qnHAJ3lqPMzfDH8XZ4LEpRf2sVdA5/sqPO9Qfop70UJyn+/boaPddT5yrq7VUUvTIVJI7q74MMddXR8NB1eXcYvhBpZm0s2w72/o86HFoKvLau/pYaXzjLMdUJ6y0LwtWV9CIIaXtvA8+G9HHV03u5q+K+yH47U0NoRngPv7KjzHDwTLj0bS1BDazfJJlcnOOostC6ysnCT+q80G/sIvFVgeW09D8FPVT0uoP7VfvAD8NjA8pqmuAN+OcYAjso0RbIZ8DGB5TVNcRO8JMaHY9SXSdfa3eeANJimWBLrA7JFiZwIXye+NMUV8CcxP2SRFjXefok7NRjSGZJlWUPvw2/wtNiQirSoXWyMsR28wR7AzzYM0oXw+Y7yK+CLJGeaoqjyrJSdZJD6Ov4+z5y6NJc0Az7NUecHydIUy+v60KNyQHoM3nKI1y7YCFiq0i7uBvgER52vDdKqWn9djhY1Dn4G3n6Ecqm2rF74dvgoR53S0hQxW9RJAZAGW5bSn58QJA27dQ7uIEedjywEX5NKVxCqsY6y+qA+LxFI4+yZ6oH0trWkNan80jygtIUsc5SflgAsDXgehfdx1KkkTRE76tN+Xue2jnTU0Ru1oIbvpt30bBtKhOp5yaaRkts0lic8V1i6dPcIRx2d/l8Y8XtNNEg7OOo8bl1kmmOKnDsO88CaYzejau0hWZqiL7C83oCH4SeTHvwV2BqqsHRVztSEYOmWF80NeXZT6Hd4KflResE9vCnBOlCyGfDNAstHTVPUDWoQ1t3iW+9WNizvlhfd4aerXd+ThqiMfNR6+9LvOOro5OY5JX2H4+F7HZD+kGzlamMgldWiirQsjcwWFbjmqZJteekJLK9pisvgL6RhKvuciZiwzrWWGapfrPy30kBVcSBIrw0aD3PU0XB6cehntq7rTMf7/2iQlktDVdXJLXlg6VjmiYBn6rWSTRCH6hvJ0hQrpcGq8oidsmHpTP8t8DGO9/vcWt9qabiqPgup1yKyQwvC2tSefZ73SSpNkUJ4PlLorlHZ+446nc8f3fIyywlJhwrTuwVSjBa1ccvSxN0hjjoK5xVrYZMd9V6XbFfgBukixTwGLg8sDam3dZR/wZ6L/dJlin1en8LS+bgpFbz3Ygvzu1J1HKxYNqxGpCmaCEo12rrBorD6LRp8UbpcdR5VWhTW35KlKd6QFqjuM2XzwlpnMxTvSkuUwuG/Xlg6NtPjbT6WFimF/VG6LEvXgn8QGDjMbBukVECFwhpoS+CQatfX2Q1q6H7wENHdrfCr0lKleEB9JyxNneus+VJpsVL9TwI6W65LovWIGl3KtVJaLv7LBwYTFEERFEVQFEERFEVQFEERFEVQFEERFEVQFEERFEVQFEERFFWq/hFgADUMN4RzT6/OAAAAAElFTkSuQmCC">
                    <p class="toast_content">已留言</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        _Vue,
    } from '../install.js';
    export default {
        name: 'CommentEditor',
        data: function() {
            return {
                toastVisible: false,
                visible: false,
                content: '',
                emotionContent: [
                    {
                        id: 0,
                        cn: '[微笑]',
                    },
                    {
                        id: 1,
                        cn: '[撇嘴]',
                    },
                    {
                        id: 2,
                        cn: '[色]',
                    },
                    {
                        id: 3,
                        cn: '[发呆]',
                    },
                    {
                        id: 4,
                        cn: '[得意]',
                    },
                    {
                        id: 5,
                        cn: '[流泪]',
                    },
                    {
                        id: 6,
                        cn: '[害羞]',
                    },
                    {
                        id: 7,
                        cn: '[闭嘴]',
                    },
                    {
                        id: 8,
                        cn: '[睡]',
                    },
                    {
                        id: 9,
                        cn: '[大哭]',
                    },
                    {
                        id: 10,
                        cn: '[尴尬]',
                    },
                    {
                        id: 11,
                        cn: '[发怒]',
                    },
                    {
                        id: 12,
                        cn: '[调皮]',
                    },
                    {
                        id: 13,
                        cn: '[呲牙]',
                    },
                    {
                        id: 14,
                        cn: '[惊讶]',
                    },
                    {
                        id: 15,
                        cn: '[难过]',
                    },
                    {
                        id: 16,
                        cn: '[冷汗]',
                    },
                    {
                        id: 17,
                        cn: '[抓狂]',
                    },
                    {
                        id: 18,
                        cn: '[吐]',
                    },
                    {
                        id: 19,
                        cn: '[偷笑]',
                    },
                    {
                        id: 20,
                        cn: '[愉快]',
                    },
                    {
                        id: 21,
                        cn: '[白眼]',
                    },
                    {
                        id: 22,
                        cn: '[傲慢]',
                    },
                    {
                        id: 23,
                        cn: '[困]',
                    },
                    {
                        id: 24,
                        cn: '[惊恐]',
                    },
                    {
                        id: 25,
                        cn: '[流汗]',
                    },
                    {
                        id: 26,
                        cn: '[憨笑]',
                    },
                    {
                        id: 27,
                        cn: '[酷]',
                    },
                    {
                        id: 28,
                        cn: '[奋斗]',
                    },
                    {
                        id: 29,
                        cn: '[咒骂]',
                    },
                    {
                        id: 30,
                        cn: '[疑问]',
                    },
                    {
                        id: 31,
                        cn: '[嘘]',
                    },
                    {
                        id: 32,
                        cn: '[晕]',
                    },
                    {
                        id: 33,
                        cn: '[衰]',
                    },
                    {
                        id: 34,
                        cn: '[骷髅]',
                    },
                    {
                        id: 35,
                        cn: '[敲打]',
                    },
                    {
                        id: 36,
                        cn: '[再见]',
                    },
                    {
                        id: 37,
                        cn: '[擦汗]',
                    },
                    {
                        id: 38,
                        cn: '[抠鼻]',
                    },
                    {
                        id: 39,
                        cn: '[鼓掌]',
                    },
                    {
                        id: 40,
                        cn: '[坏笑]',
                    },
                    {
                        id: 41,
                        cn: '[左哼哼]',
                    },
                    {
                        id: 42,
                        cn: '[右哼哼]',
                    },
                    {
                        id: 43,
                        cn: '[哈欠]',
                    },
                    {
                        id: 44,
                        cn: '[鄙视]',
                    },
                    {
                        id: 45,
                        cn: '[委屈]',
                    },
                    {
                        id: 46,
                        cn: '[快哭了]',
                    },
                    {
                        id: 47,
                        cn: '[阴险]',
                    },
                    {
                        id: 48,
                        cn: '[亲亲]',
                    },
                    {
                        id: 49,
                        cn: '[可怜]',
                    },
                    {
                        id: 50,
                        cn: '[菜刀]',
                    },
                    {
                        id: 51,
                        cn: '[西瓜]',
                    },
                    {
                        id: 52,
                        cn: '[啤酒]',
                    },
                    {
                        id: 53,
                        cn: '[咖啡]',
                    },
                    {
                        id: 54,
                        cn: '[猪头]',
                    },
                    {
                        id: 55,
                        cn: '[玫瑰]',
                    },
                    {
                        id: 56,
                        cn: '[凋谢]',
                    },
                    {
                        id: 57,
                        cn: '[嘴唇]',
                    },
                    {
                        id: 58,
                        cn: '[爱心]',
                    },
                    {
                        id: 59,
                        cn: '[心碎]',
                    },
                    {
                        id: 60,
                        cn: '[蛋糕]',
                    },
                    {
                        id: 61,
                        cn: '[炸弹]',
                    },
                    {
                        id: 62,
                        cn: '[便便]',
                    },
                    {
                        id: 63,
                        cn: '[月亮]',
                    },
                    {
                        id: 64,
                        cn: '[太阳]',
                    },
                    {
                        id: 65,
                        cn: '[拥抱]',
                    },
                    {
                        id: 66,
                        cn: '[强]',
                    },
                    {
                        id: 67,
                        cn: '[弱]',
                    },
                    {
                        id: 68,
                        cn: '[握手]',
                    },
                    {
                        id: 69,
                        cn: '[胜利]',
                    },
                    {
                        id: 70,
                        cn: '[抱拳]',
                    },
                    {
                        id: 71,
                        cn: '[勾引]',
                    },
                    {
                        id: 72,
                        cn: '[拳头]',
                    },
                    {
                        id: 73,
                        cn: '[OK]',
                    },
                    {
                        id: 74,
                        cn: '[跳跳]',
                    },
                    {
                        id: 75,
                        cn: '[发抖]',
                    },
                    {
                        id: 76,
                        cn: '[怄火]',
                    },
                    {
                        id: 77,
                        cn: '[转圈]',
                    },
                    {
                        id: 78,
                        cn: '[笑脸]',
                    },
                    {
                        id: 79,
                        cn: '[生病]',
                    },
                    {
                        id: 80,
                        cn: '[破涕为笑]',
                    },
                    {
                        id: 81,
                        cn: '[吐舌]',
                    },
                    {
                        id: 82,
                        cn: '[脸红]',
                    },
                    {
                        id: 83,
                        cn: '[恐惧]',
                    },
                    {
                        id: 84,
                        cn: '[失望]',
                    },
                    {
                        id: 85,
                        cn: '[无语]',
                    },
                    {
                        id: 86,
                        cn: '[嘿哈]',
                    },
                    {
                        id: 87,
                        cn: '[捂脸]',
                    },
                    {
                        id: 88,
                        cn: '[奸笑]',
                    },
                    {
                        id: 89,
                        cn: '[机智]',
                    },
                    {
                        id: 90,
                        cn: '[皱眉]',
                    },
                    {
                        id: 91,
                        cn: '[耶]',
                    },
                    {
                        id: 92,
                        cn: '[鬼魂]',
                    },
                    {
                        id: 93,
                        cn: '[合十]',
                    },
                    {
                        id: 94,
                        cn: '[强壮]',
                    },
                    {
                        id: 95,
                        cn: '[庆祝]',
                    },
                    {
                        id: 96,
                        cn: '[礼物]',
                    },
                    {
                        id: 97,
                        cn: '[红包]',
                    },
                    {
                        id: 98,
                        cn: '[鸡]',
                    },
                ],
                isRequesting: false,
            };
        },
        props: {
            // 标题内容
            title: {
                required: true,
                type: String,
            },
        },
        computed: {
            emotionMap() {
                const map = {};
                for (let i = 0, len = this.emotionContent.length; i < len; i++) {
                    const emotion = this.emotionContent[i];
                    map['_' + emotion.id] = emotion.cn;
                }
                return map;
            },
            isComplete() {
                return this.content.length !== 0;
            },
        },
        methods: {
            onToggleEmotionPanel() {
                this.visible = !this.visible;
            },
            onSubmit() {
                if (!this.isComplete || this.isRequesting) {
                    return;
                }
                const vm = this;
                vm.isRequesting = true;
                const id = vm.$route.params.id;
                // 告知提交
                vm.$emit('submit', vm.content);
            },
            onEmotion(index) {
                const el = document.getElementById('js_cmt_input');
                let nextStart = null;
                if (index === -1) {
                    const start = el.selectionStart;
                    const text = this.content.substr(0, start);
                    if (/\[[^\]]+\]$/.test(text)) { // 存在表情
                        nextStart = text.lastIndexOf('[');
                        this.content = this.content.substr(0, nextStart) + this.content.substr(start);
                    } else {
                        this.content = this.content.substr(0, start - 1) + this.content.substr(start);
                        nextStart = start - 1;
                    }
                    // el.focus();
                } else {
                    const emotionText = this.emotionMap['_' + index];
                    const selectionStart = el.selectionStart;
                    this.content = this.content.substr(0, selectionStart) + emotionText + this.content.substr(selectionStart);
                    // el.focus();
                    nextStart = selectionStart + emotionText.length;
                }
                _Vue.nextTick(function() {
                    el.setSelectionRange(nextStart, nextStart);
                });
            },
            finish() {
                this.isRequesting = false;
                this.toastVisible = true;
                setTimeout(function() {
                    this.toastVisible = false;
                }, 1000);
            },
        },
    };
</script>