<template>
    <div id="js_article" class="rich_media">
        <div id="js_top_ad_area" class="top_banner">
        </div>
        <div class="rich_media_inner">
            <div id="page-content">
                <div id="img-content" class="rich_media_area_primary">
                    <h2 class="rich_media_title" id="activity-name">{{title}}</h2>
                    <div class="rich_media_meta_list">
                        <span id="copyright_logo" class="rich_media_meta meta_original_tag">原创</span>
                        <em id="post-date" class="rich_media_meta rich_media_meta_text">{{createdAt}}</em>
                        <em class="rich_media_meta rich_media_meta_text">{{author}}</em>
                        <router-link
                            :to="ghLink || ''"
                            class="rich_media_meta rich_media_meta_link rich_media_meta_nickname"
                            id="post-user">
                            {{gh}}
                        </router-link>
                        <span class="rich_media_meta rich_media_meta_text rich_media_meta_nickname">{{gh}}</span>
                        <div id="js_profile_qrcode" class="profile_container" style="display:none;">
                            <div class="profile_inner">
                                <strong class="profile_nickname">{{gh}}</strong>
                                <img class="profile_avatar" id="js_profile_qrcode_img" src="" alt="">
                                <p class="profile_meta">
                                    <label class="profile_meta_label">微信号</label>
                                    <span class="profile_meta_value">bushoujiuchuju</span>
                                </p>
                                <p class="profile_meta">
                                    <label class="profile_meta_label">功能介绍</label>
                                    <span class="profile_meta_value">最潮流的互联网减脂私教服务：CHHL瘦身方法，4周人均减重10斤。 本号专注提供瘦身需要的坚持与方法全套方案。</span>
                                </p>
                            </div>
                            <span class="profile_arrow_wrp" id="js_profile_arrow_wrp">
                                <i class="profile_arrow arrow_out"></i>
                                <i class="profile_arrow arrow_in"></i>
                            </span>
                        </div>
                    </div>
                    <div id="slot-wrap">
                        <slot name="content"></slot>
                    </div>
                    <div class="rich_media_tool" id="js_toobar3">
                        <div id="js_read_area3" class="media_tool_meta tips_global meta_primary" style="display: block;">阅读 <span id="readNum3">{{readCount | increasing(sendTime, 3600) | betterReadCount}}</span>
                        </div>
                        <span style="display: inline;" :class="['media_tool_meta', 'meta_primary', 'tips_global', 'meta_praise', {praised: thumbUp}]" id="like3" like="0" @click="onClickThumbUp">
                            <i class="icon_praise_gray"></i>
                            <span class="praise_num" id="likeNum3">{{increasingThumbUpCount | betterThumbUpCount}}</span>
                        </span>
                        <a id="js_report_article3" class="media_tool_meta tips_global meta_extra" href="javascript:;">投诉</a>
                    </div>
                </div>
                <!-- <div class="rich_media_area_primary sougou" id="sg_tj" style="display:none"> -->
                </div>
                <div class="rich_media_area_extra">
                    <div class="mpda_bottom_container" id="js_bottom_ad_area">
                    </div>
                    <!-- <div id="js_iframetest" style="display:none;"></div> -->
                    <div class="rich_media_extra" id="js_cmt_area" style="display: block;">
                        <div class="discuss_container" id="js_cmt_main" style="display: block;">
                            <div class="rich_tips with_line title_tips discuss_title_line"> <span class="tips">精选留言</span> </div>
                            <p class="tips_global tc title_bottom_tips" id="js_cmt_nofans1" style="display:none;">该文章作者已设置需关注才可以留言</p>
                            <p class="discuss_icon_tips title_bottom_tips tr" id="js_cmt_addbtn1" style="display: block;">
                                <!-- 没有付费才给写留言入口 -->
                                <router-link id="js_cmt_write1" :to="to">
                                    写留言
                                    <img class="icon_edit" src="//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/appmsg/icon_edit25ded2.png" alt="">
                                </router-link>
                            </p>
                            <ul class="discuss_list" id="js_cmt_list">
                                <slot name="comments"></slot>
                            </ul>
                        </div>
                        <div class="tips_global rich_split_tips tc" id="js_cmt_nofans2" style="display:none;"> 该文章作者已设置需关注才可以留言</div>
                        <p class="discuss_icon_tips rich_split_tips tr" id="js_cmt_addbtn2" style="display:none">
                            <!-- 没有付费才给写留言入口 -->
                            <a href="javascript:;" id="js_cmt_write2">写留言<img class="icon_edit" src="//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/appmsg/icon_edit25ded2.png" alt=""></a> </p>
                        <p class="rich_split_tips tc tips_global" id="js_cmt_tips" style="display:none;"></p>
                        <div class="rich_tips tips_global loading_tips" id="js_cmt_loading" style="display: none;"> <img src="//res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/icon_loading_white2805ea.gif" class="rich_icon icon_loading_white" alt=""> <span class="tips">加载中</span> </div>
                        <div class="rich_tips with_line tips_global" id="js_cmt_statement" style="display: block;"> <span class="tips">以上留言由公众号筛选后显示</span> </div>
                        <p class="rich_split_tips tc" id="js_cmt_qa" style="display: block;"> <a href="http://kf.qq.com/touch/sappfaq/150211YfyMVj150313qmMbyi.html?scene_id=kf264">         了解留言功能详情    </a> </p>
                    </div>
                </div>
            </div>
            <!-- <div id="js_pc_qr_code" class="qr_code_pc_outer" style="display:none;">
                <div class="qr_code_pc_inner">
                    <div class="qr_code_pc">
                        <img id="js_pc_qr_code_img" class="qr_code_pc_img">
                        <p>微信扫一扫
                            <br>关注该公众号</p>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import {
    increasing,
} from '../utils/filter';
export default {
    name: 'Framework',
    props: {
        author: {
            required: true,
            type: String,
        },
        gh: {
            required: true,
            type: String,
        },
        title: {
            required: true,
            type: String,
        },
        createdAt: {
            required: true,
            type: String,
        },
        // 统计数据
        readCount: {
            required: true,
            type: Number,
        },
        thumbUpCount: {
            required: true,
            type: Number,
        },
        thumbUp: {
            required: true,
            type: Boolean,
        },
        sendTime: {
            required: true,
            type: Number,
        },
        // 公众号引导关注页面
        ghLink: {
            type: String,
        },
        // editor的链接
        to: {
            required: true,
            type: String,
        },
    },
    data() {
        return {
            thumbUpCountIncrement: 0,
        };
    },
    computed: {
        increasingThumbUpCount() {
            return increasing(this.thumbUpCount, this.sendTime) + this.thumbUpCountIncrement;
        },
    },
    methods: {
        onClickThumbUp() {
            this.thumbUp = !this.thumbUp;
            this.thumbUpCountIncrement += this.thumbUp ? 1 : -1;
        },
    },
};
</script>

<style>
    #slot-wrap {
        width: 100%;
    }
</style>