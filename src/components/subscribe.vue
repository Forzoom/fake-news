<template>
    <div id="subscribe">
        <div class="subscribe-container">
            <img class="gh-avatar" :src="ghAvatar" />
            <div class="gh-name">{{gh}}</div>
            <div class="gh-hint">长按下图识别二维码关注</div>
            <div class="gh-qrcode-container">
                <img class="gh-qrcode" :src="ghQrcode" />
                <img class="gh-qrcode-avatar" :src="ghAvatar">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Subscribe',
        props: {
            ghAvatar: {
                required: true,
                type: String,
            },
            gh: {
                required: true,
                type: String,
            },
            ghQrcode: {
                required: true,
                type: String,
            },
        },
    };
</script>

<style>
    #subscribe {
        height: 100%;
        background-color: #fff;
        text-align: center;
    }
    #subscribe:before {
        content: '';
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
    .subscribe-container {
        display: inline-block;
        text-align: center;
        vertical-align: middle;
    }
    .gh-avatar {
        width: 75px;
        height: 75px;
        border-radius: 50%;
    }
    .gh-name {
        margin-bottom: 20px;
        font-size: 20px;
        color: #333333;
    }
    .gh-hint {
        font-size: 15px;
        color: #333333;
    }
    .gh-qrcode-container {
        position: relative;
        display: inline-block;
        width: 200px;
        height: 200%;
    }
    .gh-qrcode-container:after {
        content: '';
        position: absolute;
        display: inline-block;
        width: 46px;
        height: 46px;
        left: 50%;
        top: 50%;
        border-radius: 5px;
        box-shadow: 0 2px 2px rgba(0,0,0,0.5);
        transform: translate(-50%, -50%);
        background-color: #ffffff;
    }
    .gh-qrcode-avatar {
        position: absolute;
        width: 40px;
        height: 40px;
        left: 50%;
        top: 50%;
        border-radius: 5px;
        box-shadow: 0 0 1px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        z-index: 2;
    }
    .gh-qrcode {
        width: 200px;
    }
</style>