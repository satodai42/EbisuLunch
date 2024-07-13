// スプレッドシートのID
const SPREADSHEET_ID = '1gstyGhdoKqtIWGqrJS25yteCRU57T10IPcmr9nTDwSQ'; // スプレッドシートのIDをここに設定

// Google Maps APIの初期化
function initMap() {
  // 地図の初期位置を設定
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 35.6473329668326, lng: 139.7147134783572 }, // 中心緯度経度を変更
    zoom: 17 // ズームレベル
  });

  // スプレッドシートからデータを取得する関数
  function getSpreadsheetData() {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=tsv&gid=0`; // シート名は適宜変更

    fetch(url)
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const header = lines[0].split('\t');

        // データ取得処理を修正
        const restaurants = lines.slice(1).map((line, index) => {
          const values = line.split('\t');
          const coords = values[3].split(','); // 4列目をカンマで分割
          return {
            id: index + 1, // 番号を付与
            店名: values[0].trim(),
            URL: values[2].trim(),
            メモ: values[1].trim(),
            緯度: parseFloat(coords[0]), // 緯度を取得
            経度: parseFloat(coords[1]), // 経度を取得
          };
        });

        displayRestaurants(restaurants, map);
      })
      .catch(error => {
        console.error('データ取得エラー:', error);
      });
  }

  // 取得したデータをリスト表示する関数
  function displayRestaurants(restaurants, map) {
    const listElement = document.getElementById('restaurant-list');
    restaurants.forEach(restaurant => {
      const listItem = document.createElement('div');
      listItem.classList.add('col-md-4'); // Bootstrapのグリッド列クラスを追加
      listItem.classList.add('mb-3'); // マージンを追加

      listItem.innerHTML = `
        <div class="card rounded">  
          <div class="card-header bg-light text-center">
            <h5 class="card-title"><span class="badge badge-secondary">${restaurant.id}.</span> <a href="${restaurant.URL}" class="card-link text-dark" style="text-decoration: underline;">${restaurant.店名}</a></h5> 
          </div>
          <div class="card-body">
            <p class="card-text">${restaurant.メモ}</p>
          </div>
        </div>
      `;
      listElement.appendChild(listItem);

      // 地図上にピンを立てる
      const marker = new google.maps.Marker({
        position: { lat: restaurant.緯度, lng: restaurant.経度 },
        map: map,
        label: {
          text: restaurant.id.toString(), // ラベルに番号を表示
          color: 'black' // ラベルの色を指定
        }
      });

      // ピンをクリックしたときのイベントハンドラ
      marker.addListener('click', () => {
        // ピンをクリックしたときの処理
        // 例えば、お店の詳細情報を表示するなど
        // ...
      });
    });
  }

  getSpreadsheetData();
}