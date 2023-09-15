<script>
    import { _ } from 'svelte-i18n';
    import PolarBear from '../../../../../assets/png/polarbear.png'
</script>

<div class="h-[screen - 100px] w-screen flex items-center justify-center">
    <div class="h-full w-full flex flex-row items-center justify-center p-6">
        <div class="w-[50%] h-full  flex items-center justify-center">
            <div class="w-[575px] flex flex-col items-center justify-center">
                <div class="text-heroNew text-center pb-6">Wait, where did this image come from?</div>
                <div class="text-xl text-center">Deepfakes. Voice Cloning. It's hard to tell what's accurate and authentic online these days.</div>
            </div>
        </div>
        <div class="w-[50%] h-full  flex flex-col items-start justify-center">
            <img src={PolarBear} alt="hi" class="rounded-xl w-[full - 20px] h-[full - 20px]"/>
            <div class="text-small-description">Click on the pin to see the Content Credentials.</div>
        </div>
    </div>
</div>
