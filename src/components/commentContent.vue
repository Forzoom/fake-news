<script>
    import emotions from '../lib/emotions.js';
    const emotionMap = {};
    emotions.forEach(emotion => {
        emotionMap[emotion.cn] = emotion;
    });

    export default {
        name: 'CommentContent',
        props: {
            content: {
                type: String,
            },
        },
        data() {
            return {
                emotionSize: 22,
            };
        },
        render(h) {
            const chunk = [];
            let i = 0;
            const len = this.content.length;
            while (i < len) {
                const leftBracket = this.content.indexOf('[', i);

                // 没有更多的内容，可以退出
                if (leftBracket === -1) {
                    chunk.push({
                        type: 'text',
                        value: this.content.slice(i),
                    });
                    break;
                }

                // 检查右边的括号
                const rightBracket = this.content.indexOf(']', leftBracket);

                // 如果右边括号不存在的情况下，可以退出
                if (rightBracket === -1) {
                    chunk.push({
                        type: 'text',
                        value: this.content.slice(i), // 从i开始到结束，包括了leftBracket左边的内容和右边的内容
                    });
                    break;
                } else {
                    // 处理括号左边的内容
                    chunk.push({
                        type: 'text',
                        value: this.content.slice(i, leftBracket), // 先处理leftBracket左边的内容
                    });
                }

                const test = this.content.slice(leftBracket, rightBracket + 1);
                if (emotionMap[test]) {
                    chunk.push({
                        type: 'emotion',
                        value: test,
                    });
                    i = rightBracket + 1;
                } else {
                    const lastChunk = chunk.length > 0 ? chunk[chunk.length - 1] : null;
                    // 最后一个chunk存在，并且类型是text的情况下合并到最后一个chunk
                    if (lastChunk && lastChunk.type === 'text') {
                        lastChunk.value = lastChunk.value + this.content.slice(test);
                    } else {
                        chunk.push({
                            type: 'text',
                            value: test,
                        });
                    }
                    i = rightBracket + 1;
                }
            }

            // 所有的元素
            const el = [];
            for (let i = 0, len = chunk.length; i < len; i++) {
                const c = chunk[i];
                if (c.type === 'text') {
                    el.push(h('span', {}, c.value));
                } else {
                    const emotionId = emotionMap[c.value].id;
                    el.push(h('i', {
                        class: ['icon_emotion', 'icon' + emotionId],
                        style: {'background-position': '0px ' + (emotionId * -22) + 'px'}
                    }));
                }
            }
            return h('div', {}, el);
        },
    };
</script>