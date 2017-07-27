<template>
    <li  class="discuss_item" id="cid12434425192346812904" v-if="willShow(this.createdAt)">
        <div class="discuss_opr" v-if="willShow(this.createdAt)">
            <span :class="['media_tool_meta', 'tips_global', 'meta_praise', 'js_comment_praise', {praised: thumbUp}]" data-status="0" data-content-id="12434425192346812904" @click="onClickCommentThumbUp">
                <i class="icon_praise_gray"></i>
                <span class="praise_num">{{increasingCommentThumbUpCount | betterThumbUpCount}}</span>
            </span>
        </div>
        <div class="user_info" v-if="willShow(this.createdAt)">
            <strong class="nickname">{{name}}</strong>
            <img class="avatar" :src="avatar">
        </div>
        <div class="discuss_message" v-if="willShow(this.createdAt)"> <span class="discuss_status"></span>
            <div class="discuss_message_content">{{content}}</div>
        </div>
        <p class="discuss_extra_info" v-if="willShow(this.createdAt)">{{createdAt * 1000 + sendTime | betterCreatedAt}}</p>
        <div class="reply_result" v-if="response !== null && willShow(this.createdAt) && willShow(this.response.createdAt)">
            <div class="discuss_opr">
                <span :class="['media_tool_meta', 'tips_global', 'meta_praise', 'js_reply_praise', {praised: response.thumbUp}]" data-status="0" data-content-id="12434425192346812904" data-reply-id="1" @click="onClickResponseThumbUp">
                    <i class="icon_praise_gray"></i>
                    <span class="praise_num">{{increasingResponseThumbUpCount | betterThumbUpCount}}</span>
                </span>
            </div>
            <div class="nickname">作者回复</div>
            <div class="discuss_message">
                <div class="discuss_message_content">{{response.content}}</div>
            </div>
            <p class="discuss_extra_info">{{response.createdAt * 1000 + sendTime | betterCreatedAt}}</p>
        </div>
    </li>
</template>

<script>
    import {
        now,
        toTimestamp,
    } from '../utils/date.js';
    import {
        increasing,
    } from '../utils/filter';
    export default {
        props: {
            name: String,
            avatar: String,
            thumbUpCount: Number,
            thumbUp: Boolean,
            content: String,
            createdAt: Number,
            response: Object,
            sendTime: Number,
        },
        data() {
            return {
                commentThumbUpCountIncrement: 0,
                responseThumbUpCountIncrement: 0,
            };
        },
        computed: {
            now() {
                return now();
            },
            increasingCommentThumbUpCount() {
                return increasing(this.thumbUpCount, this.createdAt * 1000 + this.sendTime) + this.commentThumbUpCountIncrement;
            },
            increasingResponseThumbUpCount() {
                return increasing(this.response.thumbUpCount, this.response.createdAt * 1000 + this.sendTime) + this.responseThumbUpCountIncrement;
            },
        },
        methods: {
            willShow(timestamp) {
                timestamp = toTimestamp(this.sendTime + timestamp * 1000);
                return timestamp < this.now;
            },
            onClickCommentThumbUp(index) {
                this.thumbUp = !this.thumbUp;
                this.commentThumbUpCountIncrement += this.thumbUp ? 1 : -1;
            },
            onClickResponseThumbUp(index) {
                this.response.thumbUp = !this.response.thumbUp;
                this.responseThumbUpCountIncrement += this.response.thumbUp ? 1 : -1;
            },
        },
    };
</script>