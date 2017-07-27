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
        props: {
            comments: {
                type: Array,
            },
            sendTime: {
                type: Number,
            },
        },
        components: {
            Comment,
        },
    };
</script>