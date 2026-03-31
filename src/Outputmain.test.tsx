import { render, screen,within ,act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Outputmain from './Outputmain'

// --- 子コンポーネントのモック化 ---
jest.mock('./outputdisplay', () => {
  return function MockOutputdisplay(props: any) {
    return (
      <div data-testid="mock-outputdisplay" className="output-display-area">
        {/*現在の disch 状態を出すだけ */}
        <span data-testid="current-disch">{props.disch ? 'FILTER_ON' : 'FILTER_OFF'}</span>
        {/*setD を呼ぶためのボタン */}
        <button onClick={() => props.setD(!props.disch)}>MockFilter</button>
        {/* 本物と同じ ul > li の構造を模倣します */}
        <ul className="output-list">
          {props.list.map((item: any) => (
            <li key={item.id} className="output-list-item">
               <span>{props.formatTime(item.time)} ({item.userName})</span>
                <span data-testid="item-check-status">{item.check ? 'CHECKED' : 'UNCHECKED'}</span>
               <span data-testid="status">{item.delete ? 'DELETED' : 'ALIVE'}</span>
               <button onClick={() => props.onCheck(item.id)}>MockCheck</button>
               <button onClick={() => props.deletedata(item.id)}>MockDelete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
});

jest.mock('./outputdeletedisplay', () => {
  return function MockOutputdeletedisplay(props: any) {
    return <div data-testid="mock-outputdeletedisplay">{props.deletelist.length}</div>;
  };
});

describe('Outputmain', () => {

    beforeEach(() => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2026-3-13 10:00:00'))
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('#1:タイトルが表示されている',()=>{
        render(<Outputmain/>)
        expect(screen.getByTestId('title')).toHaveTextContent('出退勤アプリ（テスト）')
    })

    it('#2:初期状態で出勤ボタンが表示、時刻が空であるか',() =>{
        render(<Outputmain />)
        const startbutton = screen.getByRole('button',{name: '出勤'})
        const timediplay = startbutton.nextElementSibling
        expect(timediplay).toHaveTextContent('')
    })

    it('#3:初期状態で退勤ボタンが表示、時刻が空であるか',()=>{
        render(<Outputmain />)
        const finishbutton = screen.getByRole('button',{name: '退勤'})
        const timedisplay = finishbutton.nextElementSibling
        expect(timedisplay).toHaveTextContent('')
    })

    it('#4:出勤ボタンを押下時に時刻が表示される',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        const select = screen.getByLabelText('ユーザー選択')
        await user.click(select)

        //展開されたリストボックスから「ユーザー1」を選択
        const listbox = screen.getByRole('listbox')
        const option = within(listbox).getByText('ユーザー1')
        await user.click(option)

        const startbutton = screen.getByRole('button',{name: '出勤'})
        await user.click(startbutton)

        const timedisplay = startbutton.nextElementSibling
        expect(timedisplay).toHaveTextContent('10:00:00')
    })

    it('#5:退勤ボタンを押下時に時刻が表示される',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        const select = screen.getByLabelText('ユーザー選択')
        await user.click(select)

        //展開されたリストボックスから「ユーザー1」を選択
        const listbox = screen.getByRole('listbox')
        const option = within(listbox).getByText('ユーザー1')
        await user.click(option)

        const startbutton = screen.getByRole('button',{name: '出勤'})
        await user.click(startbutton)

        //時計の針を5秒進める
        act(()=>{
            jest.advanceTimersByTime(5000)
        })

        const finishbutton = screen.getByRole('button',{name: '退勤'})
        await user.click(finishbutton)

        const timedisplay = finishbutton.nextElementSibling
        expect(timedisplay).toHaveTextContent('10:00:05')
    })

    it('#6:出退勤記録が表示される',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        const select = screen.getByLabelText('ユーザー選択')
        await user.click(select)

        //展開されたリストボックスから「ユーザー1」を選択
        const listbox = screen.getByRole('listbox')
        const option = within(listbox).getByText('ユーザー1')
        await user.click(option)

        const startbutton = screen.getByRole('button',{name: '出勤'})
        await user.click(startbutton)

        //時計の針を5秒進める
        act(()=>{
            jest.advanceTimersByTime(3665000)
        })

        const finishbutton = screen.getByRole('button',{name: '退勤'})
        await user.click(finishbutton)

        //出退勤リストのエリアを特定する
        const List = screen.getByRole('tabpanel', { name: /出退勤リスト表示/i })

        //エリアの中に出退勤記録が適切なフォーマットで記述されているか
        expect(within(List).getByText('1時間1分5秒 (ユーザー1)')).toBeInTheDocument()
    })

    it('#7:「出退勤リスト表示」ボタンと「出退勤削除リスト表示」ボタンが表示されており切り替えることができる',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        //出退勤リストのエリアを特定する
        const Listtab = screen.getByRole('tab', { name: /出退勤リスト表示/i })
        const deletetab = screen.getByRole('tab', { name: /出退勤削除リスト表示/i })

        //初期状態の確認。aria-selected属性で選択状態を確認
        expect(Listtab).toHaveAttribute('aria-selected', 'true')

        //出退勤リスト表示に該当するパネル（リスト）が表示されているか確認。hiddenがfalseだと非表示なのでその反対を取っている
        const listpanel = screen.getByRole('tabpanel', { name: /出退勤リスト表示/i })
        expect(listpanel).not.toHaveAttribute('hidden')

        //タブ切り替え
        await user.click(deletetab)
        expect(deletetab).toHaveAttribute('aria-selected', 'true')

        //タブが押されてからではないと表示されていないのでエラーになる
        const deletepanel = screen.getByRole('tabpanel', { name: /出退勤削除リスト表示/i })
        expect(listpanel).toHaveAttribute('hidden')
        expect(deletepanel).not.toHaveAttribute('hidden')
    })

    it('#8:プルダウンでユーザーを選択できる',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        const select = screen.getByLabelText('ユーザー選択')
        await user.click(select)

        //展開されたリストボックスから「ユーザー1」を選択
        const listbox = screen.getByRole('listbox')
        const option = within(listbox).getByText('ユーザー1')
        await user.click(option)

        expect(select).toHaveTextContent('ユーザー1')
    })

    it('#9:ユーザーを選択していない状態で出勤ボタンを押したときの表示が正常である',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        const startbutton = screen.getByRole('button',{name: '出勤'})
        await user.click(startbutton)

        const timedisplay = startbutton.nextElementSibling
        expect(timedisplay).toHaveTextContent('ユーザーを選択してください')
    })

    it('#10:出勤ボタンを押す前に退勤ボタンを押せない',async ()=>{
        render(<Outputmain />)

        const finishbutton = screen.getByRole('button',{name: '退勤'})
        expect(finishbutton).toBeDisabled
    })

    it('#11:削除ボタンを押すと、削除状態になる',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        const select = screen.getByLabelText('ユーザー選択')
        await user.click(select)
        const listbox = screen.getByRole('listbox')
        const option = within(listbox).getByText('ユーザー1')
        await user.click(option)
        const startbutton = screen.getByRole('button',{name: '出勤'})
        await user.click(startbutton)
        act(()=>{
            jest.advanceTimersByTime(5000)
        })
        const finishbutton = screen.getByRole('button',{name: '退勤'})
        await user.click(finishbutton)

        //削除用出退勤記録
        act(()=>{
            jest.advanceTimersByTime(5000)
        })
        await user.click(startbutton)
        act(()=>{
            jest.advanceTimersByTime(10000)
        })
        await user.click(finishbutton)

        //削除前ステータスチェック
        const items = screen.getAllByTestId('status')
        items.forEach((item) => {
            expect(item).toHaveTextContent('ALIVE')
        })

        //モック内の削除ボタンをクリック
        const deleteBtns = screen.getAllByRole('button', { name: 'MockDelete' })
        await user.click(deleteBtns[1])
        //状態がDELETEに変化したか
        expect(items[0]).toHaveTextContent('ALIVE')
        expect(items[1]).toHaveTextContent('DELETED')
    })

    it('#12:チェックボックスクリックで重要状態に変化',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        //データ準備
        const select = screen.getByLabelText('ユーザー選択')
        await user.click(select)
        const listbox = screen.getByRole('listbox')
        const option = within(listbox).getByText('ユーザー1')
        await user.click(option)
        const startbutton = screen.getByRole('button',{name: '出勤'})
        await user.click(startbutton)
        act(()=>{
            jest.advanceTimersByTime(5000)
        })
        const finishbutton = screen.getByRole('button',{name: '退勤'})
        await user.click(finishbutton)

        //重要出退勤用記録
        act(()=>{
            jest.advanceTimersByTime(5000)
        })
        await user.click(startbutton)
        act(()=>{
            jest.advanceTimersByTime(10000)
        })
        await user.click(finishbutton)

        //チェック前ステータス確認
        const items = screen.getAllByTestId('item-check-status')
        items.forEach((item) => {
            expect(item).toHaveTextContent('UNCHECKED')
        })

        //モック内のチェックボタンをクリック
        const checkBtns = screen.getAllByRole('button', { name: 'MockCheck' })
        await user.click(checkBtns[1])

        //チェック後ステータス確認
        expect(items[0]).toHaveTextContent('UNCHECKED')
        expect(items[1]).toHaveTextContent('CHECKED')

        //もう一度クリックして解除されるか確認
        await user.click(checkBtns[1])
        items.forEach((item) => {
            expect(item).toHaveTextContent('UNCHECKED')
        })
    })

    it('#13:「重要出退勤リストを表示」チェックボックスをチェックした時のフィルター設定テスト',async ()=>{
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(<Outputmain />)

        const select = screen.getByLabelText('ユーザー選択')
        await user.click(select)
        const listbox = screen.getByRole('listbox')
        const option = within(listbox).getByText('ユーザー1')
        await user.click(option)
        const startbutton = screen.getByRole('button',{name: '出勤'})
        await user.click(startbutton)
        act(()=>{
            jest.advanceTimersByTime(5000)
        })
        const finishbutton = screen.getByRole('button',{name: '退勤'})
        await user.click(finishbutton)

        //初期状態確認
        expect(screen.getByTestId('current-disch')).toHaveTextContent('FILTER_OFF')

        const toggleBtn = screen.getByRole('button', { name: 'MockFilter' })
        await user.click(toggleBtn)

        //ステータス変化
        expect(screen.getByTestId('current-disch')).toHaveTextContent('FILTER_ON')
    })

    it('#14:スナップショットテスト（初期状態）', () => {
        const { asFragment } = render(<Outputmain />);
        // renderの結果を「写真（スナップショット）」として保存・比較
        expect(asFragment()).toMatchSnapshot();
    })
})
