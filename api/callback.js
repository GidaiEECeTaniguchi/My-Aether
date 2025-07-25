
import axios from 'axios';

// Vercelのサーバーレス関数として定義
export default async function handler(req, res) {
    // クエリパラメータから 'code' と 'state' を取得
    const { code, state } = req.query;

    // --- 重要：これらの値はVercelの環境変数に設定すること ---
    // ここでは仮で直接記述するけど、本番環境では絶対にやめてね
    const CLIENT_ID = process.env.BLUESKY_CLIENT_ID || 'YOUR_CLIENT_ID'; // Vercelの環境変数から取得するか、仮の値を設定
    const CLIENT_SECRET = process.env.BLUESKY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET'; // Vercelの環境変数から取得するか、仮の値を設定
    const REDIRECT_URI = process.env.BLUESKY_REDIRECT_URI || 'https://my-aether-six.vercel.app/api/callback'; // このAPI自体のURL
    const PDS_URL = 'https://bsky.social'; // BlueskyのPDS
    // ---------------------------------------------------------

    if (!code) {
        return res.status(400).send('エラー：認可コード(code)が見つかりません。');
    }

    try {
        // BlueskyのトークンエンドポイントにPOSTリクエストを送信
        const tokenResponse = await axios.post(`${PDS_URL}/oauth/token`, {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // 取得したトークン
        const { access_token, refresh_token, sub } = tokenResponse.data;

        // アプリのカスタムURLスキームを使ってリダイレクト
        const redirectUrl = `myaether://callback?access_token=${access_token}&refresh_token=${refresh_token}&user_did=${sub}&state=${state || ''}`;

        // 302リダイレクトでユーザーのブラウザをアプリに誘導する
        res.redirect(302, redirectUrl);

    } catch (error) {
        console.error('トークン交換中にエラーが発生しました:', error.response ? error.response.data : error.message);
        
        // エラー情報を表示するHTMLを返す
        res.status(500).send(`
            <html>
                <body>
                    <h1>トークンの取得に失敗しました</h1>
                    <p>エラー内容:</p>
                    <pre>${JSON.stringify(error.response ? error.response.data : { message: error.message }, null, 2)}</pre>
                    <p>アプリに戻ってやり直してください。</p>
                </body>
            </html>
        `);
    }
}
