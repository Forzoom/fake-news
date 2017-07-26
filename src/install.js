import Comment from './components/comment.vue';
import Comments from './components/comments.vue';
import EmotionPanel from './components/emotionPanel.vue';
import Framework from './components/framework.vue';

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
}