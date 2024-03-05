async function deleteResource(id) {
    const apiUrl = "/articles/" + id;

    try {
        // DELETEリクエストを実行
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                // 他に必要なヘッダーがあれば追加
            },
        });

        if (response.ok) {
            location.href = "/"
            // レスポンスが成功した場合の処理
            console.log('DELETEリクエスト成功:', response);
        } else {
            // エラーレスポンスの処理
            console.error('DELETEリクエストエラー:', response.statusText);
        }

        // 必要に応じてリダイレクトなどの処理を行う
    } catch (error) {
        // エラーが発生した場合の処理
        console.error('DELETEリクエストエラー:', error);
    }
}
