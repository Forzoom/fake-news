<template>
    <div>
        <div v-for="(comment, index) in comments">
            <Comment
                :name="comment.name"
                :avatar="comment.avatar"
                :thumb-up-count="comment.thumbUpCount"
                :thumb-up="comment.thumbUp"
                :content="comment.content"
                :created-at="comment.createdAt"
                :response="comment.response"
                :send-time="sendTime"
                :lazy="lazy"
            ></Comment>
        </div>
    </div>
</template>

<script>
    import Comment from './comment.vue';
    /**
     * sendTime 图文消息发送时间的时间戳
     * comments 评论内容
     */
    export default {
        name: 'Comments',
        components: {
            Comment,
        },
        props: {
            /**
             * 所有的评论内容
             */
            comments: {
                type: Array,
                default: [],
            },
            /**
             * 发送时间
             */
            sendTime: {
                type: Number,
            },
            /**
             * 是否允许使用lazyload，为true的情况下，评论头像内容将使用vue-lazyload延迟加载
             */
            lazy: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>