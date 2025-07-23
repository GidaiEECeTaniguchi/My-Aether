const express = require('express');
const { AuthRequiredError, AtprotoOAuth } = require('@atproto/oauth-client-node');

const app = express();

// /api/callback というURLにアクセスがあった時の処理
app.get('/api/callback', async (req, res) => {
  // 1. URLから 'code' と 'state' を取得します
  const { code, state } = req.query;

  // ここに、前回解説したトークンを交換するロジックを記述します。
  // 公式ライブラリを使うと、この部分が非常に簡単になります。
  // (これはあくまでサンプルコードです)
  try {
    // 例：const client = new AtprotoOAuth(...);
    //     await client.getAccessToken({ code });
    
    console.log('認証コード:', code);
    console.log('アクセストークンの取得に成功！');

    // 4. トークンを保存し、ログイン処理を行う
    // (セッションの設定など)

    // 5. ログイン後のページへリダイレクト
    res.redirect('/success.html'); // 仮の成功ページへ

  } catch (error) {
    console.error(error);
    res.status(500).send('エラーが発生しました。');
  }
});

// Vercelがこのファイルを実行できるようにするためのおまじない
module.exports = app;