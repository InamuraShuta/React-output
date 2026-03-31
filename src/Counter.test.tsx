import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {

  // ルール：itで記載
  it('初期状態でカウントが0であること', () => {
    render(<Counter />);

    // 画面の中から「カウント: 0」というテキストを探す
    const heading = screen.getByText(/カウント: 0/i);
    expect(heading).toBeInTheDocument();
  });

  it('ボタンをクリックするとカウントが1増えること', () => {
    render(<Counter />);

    // ボタンを探してクリックする
    const button = screen.getByRole('button', { name: /増やす/i });
    fireEvent.click(button);

    // 表示が切り替わったか確認する
    const heading = screen.getByText(/カウント: 1/i);
    expect(heading).toBeInTheDocument();
  });

  it('ボタンを10回クリックするまでのテスト', () => {
    render(<Counter />);
    const button = screen.getByTestId('Cbutton');

    // for文を使って10回連続でクリックをシミュレート
    for (let i = 1; i <= 10; i++) {
      fireEvent.click(button);
      expect(screen.getByText(new RegExp(`カウント: ${i}`, 'i'))).toBeInTheDocument();
    }
  });

  //スナップショットテスト
  it('スナップショットが前回と一致すること', () => {
    //render関数の戻り値からasFragmentを取得
    const { asFragment } = render(<Counter />);

    //asFragment()は現在のコンポーネントのHTML構造を「断片」として返す
    //それが保存されているスナップショットと一致するか確認
    expect(asFragment()).toMatchSnapshot();
  });
});