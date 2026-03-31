import { useState, useEffect } from 'react';

// TSXポイント1: コンポーネントの戻り値を「JSX.Element」と明示することができます（省略も可能）
function Clock(){

  // TSXポイント2: useStateに型を指定します。<string> と書くことで、timeが文字列であることを保証します
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    // 1. 1秒ごとに時間を更新するタイマーをセット
    // TSXポイント3: timerId の型を指定します。ブラウザ環境では数値（number）です
    const timerId: number = window.setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // 2. クリーンアップ関数
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <>
      <div style={{ fontSize: '1.5rem', margin: '10px 0' }}>
        現在時刻: {time}
      </div>
    </>
  );
}

export default Clock;