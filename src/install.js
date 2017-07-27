import Comment from './components/comment.vue';
import Comments from './components/comments.vue';
import EmotionPanel from './components/emotionPanel.vue';
import Framework from './components/framework.vue';
import CommentEditor from './components/commentEditor.vue';
import css1 from './lib/style/framework.css';
import css2 from './lib/style/emotionPanel.css';

export let _Vue;

export function install(Vue) {
    if (install.installed) {
        return;
    }
    install.installed = true;
    _Vue = Vue;

    Vue.component('Comment', Comment);
    Vue.component('Comments', Comments);
    Vue.component('EmotionPanel', EmotionPanel);
    Vue.component('Framework', Framework);
    Vue.component('CommentEditor', CommentEditor);
}