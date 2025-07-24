/**
 * Blueskyの認証後、コールバックURLで実行されるスクリプト
 * （ブラウザ側で動作します）
 */
window.onload = function() {
    // 現在のページのURLから、クエリパラメータ（?以降の部分）を取得する
    const urlParams = new URLSearchParams(window.location.search);
    
    // 'code' と 'state' という名前のパラメータの値を取得する
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    // もし 'code' がちゃんと取得できていたら
    if (code) {
        // アプリを呼び出すための特別なURL（カスタムURLスキーム）を組み立てる
        // AndroidManifest.xmlで設定した 'myaether://callback' を使うよ
        const redirectUrl = `myaether://callback?code=${code}&state=${state}`;
        
        // 組み立てたURLに、ページを移動させる
        // これで、ブラウザからアプリに操作が戻るんだ
        window.location.href = redirectUrl;

    } else {
        // もし 'code' が取得できなかったら、エラーメッセージをコンソールに出力する
        console.error("認可コードが見つかりませんでした。");
        // 必要なら、ユーザー向けのメッセージを画面に表示してもいいね
        // document.body.innerText = "エラー：アプリに戻れませんでした。";
    }
};