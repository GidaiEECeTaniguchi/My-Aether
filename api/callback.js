/**
 * Blueskyの認証後、コールバックURLで実行されるスクリプト
 * （ブラウザ側で動作します）
 */
window.onload = function() {
    console.log("callback.js loaded");
    console.log("Current URL:", window.location.href);
    
    // 現在のページのURLから、クエリパラメータ（?以降の部分）を取得する
    const urlParams = new URLSearchParams(window.location.search);
    console.log("URL params:", window.location.search);
    
    // 'code' と 'state' という名前のパラメータの値を取得する
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    console.log("Extracted code:", code);
    console.log("Extracted state:", state);

    // もし 'code' がちゃんと取得できていたら
    if (code) {
        // アプリを呼び出すための特別なURL（カスタムURLスキーム）を組み立てる
        // AndroidManifest.xmlで設定した 'myaether://callback' を使うよ
        const redirectUrl = `myaether://callback?code=${code}&state=${state || ''}`;
        console.log("Redirect URL:", redirectUrl);
        
        // ページに状況を表示
        document.body.innerHTML = `<p>アプリに戻っています...</p><p>リダイレクトURL: ${redirectUrl}</p>`;
        
        // 少し待ってからリダイレクト
        setTimeout(() => {
            console.log("Attempting redirect to:", redirectUrl);
            try {
                window.location.href = redirectUrl;
            } catch (error) {
                console.error("Redirect failed:", error);
                document.body.innerHTML += `<p>エラー: ${error.message}</p>`;
            }
        }, 1000);
        
        // フォールバック：5秒後にエラーメッセージを表示
        setTimeout(() => {
            document.body.innerHTML += '<p>アプリが見つかりません。手動でアプリを開いてください。</p>';
        }, 6000);

    } else {
        console.error("認可コードが見つかりませんでした。");
        console.log("Available parameters:", Array.from(urlParams.entries()));
        document.body.innerHTML = '<p>エラー：認証に失敗しました。認可コードが見つかりません。</p>';
    }
};