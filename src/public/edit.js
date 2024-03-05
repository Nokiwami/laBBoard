async function editResource(id) {
    const apiUrl = "/articles/" + id;

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        // PUTリクエストを実行
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                // 他に必要なヘッダーがあれば追加
            },
            body: JSON.stringify({title:title, content:content}),
        });

        if (response.ok) {
            // レスポンスが成功した場合の処理
            location.href = "/"
            console.log('PUTリクエスト成功:', response);
        } else {
            // エラーレスポンスの処理
            console.error('PUTリクエストエラー:', response.statusText);
        }

        // 必要に応じてリダイレクトなどの処理を行う
    } catch (error) {
        // エラーが発生した場合の処理
        console.error('PUTリクエストエラー:', error);
    }
}
