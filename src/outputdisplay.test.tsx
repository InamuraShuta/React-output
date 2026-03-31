import { render, screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Outputdisplay from './outputdisplay'
import type { TimeEntry } from './Outputmain'

describe('outputdisplay', () => {

    //テスト用のダミーデータを作成
    const mockList: TimeEntry[] = [
        {
            id: '1',
            time: 5,
            userName: 'ユーザー1',
            check: false,
            delete: false
        },
        {
            id: '2',
            time: 6,
            userName: 'ユーザー2',
            check: true,
            delete: false
        }
    ]

    //ダミーのformatTime関数
    const mockFormatTime = (time: number) => `${time}秒`

    //その他の必須Propsのダミー
    const mockDeletedata = jest.fn()
    const mockOnCheck = jest.fn()
    const mockSetD = jest.fn()

    it('#15:出退勤記録が表示されているか',async()=>{
        render(
            <Outputdisplay
                list={mockList}
                formatTime={mockFormatTime}
                deletedata={mockDeletedata}
                onCheck={mockOnCheck}
                UserName="ユーザー1"
                disch={false}
                setD={mockSetD}
            />
        )

        //mockFormatTimeが返した文字列が画面に存在するか
        expect(screen.getByText('5秒 (ユーザー1)')).toBeInTheDocument()
    })

    it('#16:勤務時間が5秒以下の時は警告が表示される',async()=>{
        render(
            <Outputdisplay
                list={mockList}
                formatTime={mockFormatTime}
                deletedata={mockDeletedata}
                onCheck={mockOnCheck}
                UserName="ユーザー1"
                disch={false}
                setD={mockSetD}
            />
        )

        //全てのリストアイテム（行）を取得
        const items = screen.getAllByRole('listitem');

        //items[0]の中に絞り、警告アイコンがあることをテスト
        expect(within(items[0]).getByTestId('warningicon')).toBeInTheDocument();

        //items[1]の中に絞り、警告アイコンがないことをテスト
        expect(within(items[1]).queryByTestId('warningicon')).not.toBeInTheDocument();
    })

    it('#17:勤務時間の右側に削除アイコンが表示される',async()=>{
        render(
            <Outputdisplay
                list={mockList}
                formatTime={mockFormatTime}
                deletedata={mockDeletedata}
                onCheck={mockOnCheck}
                UserName="ユーザー1"
                disch={false}
                setD={mockSetD}
            />
        )

        const items = screen.getAllByRole('listitem');
        //items（配列）の中身を1つずつ取り出して「item」としてテストする
        items.forEach((item) => {
            expect(within(item).getByRole('button', { name: 'deletedata' })).toBeInTheDocument()
        });
    })

    it('#18:「重要出退勤記録のみ表示」チェックボックスが表示される',async()=>{
        const user = userEvent.setup()
        // コンポーネントをレンダリング
        const {rerender} = render(
            <Outputdisplay
                list={mockList}
                formatTime={mockFormatTime}
                deletedata={mockDeletedata}
                onCheck={mockOnCheck}
                UserName="ユーザー1"
                disch={false}
                setD={mockSetD}
            />
        )

        const filterCheckbox = screen.getByLabelText('重要出退勤記録のみ表示')
        expect(filterCheckbox).toBeInTheDocument()
        expect(filterCheckbox).not.toBeChecked()

        //同じコンポーネントを再レンダリング
        rerender(
            <Outputdisplay
                list={mockList}
                formatTime={mockFormatTime}
                deletedata={mockDeletedata}
                onCheck={mockOnCheck}
                UserName="ユーザー1"
                disch={true}
                setD={mockSetD}
            />
        )

        expect(filterCheckbox).toBeChecked()
        await user.click(filterCheckbox)
        //mockSetDが呼ばれたかを確認
        expect(mockSetD).toHaveBeenCalled()
    })

    it('#19:出退勤記録の左側にチェックボックスが表示される',async()=>{
        const user = userEvent.setup()
        render(
            <Outputdisplay
                list={mockList}
                formatTime={mockFormatTime}
                deletedata={mockDeletedata}
                onCheck={mockOnCheck}
                UserName="ユーザー1"
                disch={false}
                setD={mockSetD}
            />
        )

        const items = screen.getAllByRole('listitem')
        items.forEach((item) => {
            expect(within(item).getByRole('checkbox')).toBeInTheDocument()
        })
        await user.click(within(items[0]).getByRole('checkbox'))
        //mockOnCheckが呼ばれたかを確認
        expect(mockOnCheck).toHaveBeenCalled()
    })

    it('#20:選択したユーザー以外の出退勤記録を削除できない',async()=>{
        render(
            <Outputdisplay
                list={mockList}
                formatTime={mockFormatTime}
                deletedata={mockDeletedata}
                onCheck={mockOnCheck}
                UserName="ユーザー1"
                disch={false}
                setD={mockSetD}
            />
        )

        const items = screen.getAllByRole('listitem')

        //自分の記録は消せる状態
        const mybutton = within(items[0]).getByRole('button', { name: 'deletedata' })
        expect(mybutton).not.toBeDisabled()

        //他人の記録は非活性化
        const otherbutton = within(items[1]).getByRole('button', { name: 'deletedata'})
        expect(otherbutton).toBeDisabled()
    })

    it('#21:削除ボタンをクリックしたときの処理', async () => {
        const user = userEvent.setup()
        render(
            <Outputdisplay
                list={mockList}
                formatTime={mockFormatTime}
                deletedata={mockDeletedata}
                onCheck={mockOnCheck}
                UserName="ユーザー1"
                disch={false}
                setD={mockSetD}
            />
        )

        const deleteButtons = screen.getAllByRole('button', { name: 'deletedata' })
        //1つ目のボタンをクリック
        await user.click(deleteButtons[0])
        //mockDeletedataが、1個目のデータのID1を引数にして呼ばれたかを確認
        expect(mockDeletedata).toHaveBeenCalledWith('1')
    })

})