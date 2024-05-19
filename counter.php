<?php
$filename = 'counter.txt';

// ファイルが存在しない場合、初期値を設定する
if (!file_exists($filename)) {
    file_put_contents($filename, '0');
}

// ファイルの内容を読み込む
$count = (int)file_get_contents($filename);

// カウンターを1増やす
$count++;

// 新しいカウンターの値をファイルに書き込む
file_put_contents($filename, (string)$count);

// 新しいカウンターの値を返す
echo $count;
?>