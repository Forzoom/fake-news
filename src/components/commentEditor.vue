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
    import emotions from '../lib/emotions.js';
    export default {
        name: 'CommentEditor',
        data: function() {
            return {
                toastVisible: false,
                visible: false,
                content: '',
                emotionContent: emotions,
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
                const vm = this;
                vm.isRequesting = false;
                vm.toastVisible = true;
                setTimeout(function() {
                    vm.toastVisible = false;
                }, 1000);
            },
        },
    };
</script>