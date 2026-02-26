window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const startButton = document.getElementById("startButton");
    const backButton = document.getElementById("backButton");
    const shopButton = document.getElementById("shopButton");
    const uiContainer = document.getElementById("ui-container");
    const overlay = document.getElementById("overlay");
    
    const v1 = document.getElementById("v1");
    const v2 = document.getElementById("v2");
    const v3 = document.getElementById("v3");
    
    const targets = [
        { el: document.getElementById("target-0"), video: v1 },
        { el: document.getElementById("target-1"), video: v2 },
        { el: document.getElementById("target-2"), video: v3 }
    ];

    // AR開始
    startButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        // JSから強制的にflex表示を上書き設定
        uiContainer.setAttribute('style', 'display: flex !important'); 
        
        document.body.classList.add('ar-active');

        // 動画のロック解除
        [v1, v2, v3].forEach(v => {
            v.play().then(() => {
                v.pause();
                v.currentTime = 0;
            }).catch(e => console.log(e));
        });

        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) arSystem.start();

        window.dispatchEvent(new Event('resize'));
    });

    // ショップボタン（外部リンク）
    shopButton.addEventListener('click', () => {
        window.open('https://versailles.theshop.jp/search?q=%E3%83%AF%E3%83%B3%E3%83%80%E3%83%BC%E3%82%A2%E3%82%AD%E3%83%A5%E3%83%BC%E3%83%88', '_blank');
    });

    // タイトルに戻る
    backButton.addEventListener('click', () => {
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) arSystem.stop();

        [v1, v2, v3].forEach(v => {
            v.pause();
            v.currentTime = 0;
        });

        overlay.style.display = 'flex'; 
        uiContainer.setAttribute('style', 'display: none !important');
        document.body.classList.remove('ar-active', 'target-found');
    });

    // 各ターゲットの検知
    targets.forEach(target => {
        target.el.addEventListener("targetFound", () => {
            document.body.classList.add('target-found');
            target.video.play();
        });
        target.el.addEventListener("targetLost", () => {
            document.body.classList.remove('target-found');
            target.video.pause();
        });
    });
});