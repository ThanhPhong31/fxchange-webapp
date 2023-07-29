import CenterContainer from '../common/center-container'
import StuffOptionCard from '../stuff/stuff-option-card'
import { useApp } from '@/contexts/app-context'
import stuffQuery from '@/graphql/queries/stuff-query'
import { StuffListGraphQLResponse } from '@/types/common'
import { Stuff } from '@/types/model'
import { ModalPropsGeneric } from '@/types/props'
import { useLazyQuery } from '@apollo/client'
import { Button, CircularProgress } from '@mui/joy'
import { Affix, Drawer } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AddingModal from '../modal/adding-modal'

interface SelectStuffDrawer extends ModalPropsGeneric<Stuff> {}

const SelectStuffDrawer = ({ open, onClose, title, onConfirm }: SelectStuffDrawer) => {
  const [openAddModal, setOpenAddModal] = useState(false)
  const [selectedStuff, setSelectedStuff] = useState<Stuff | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const { onOpen } = useApp()
  const [getMyStuff, { data: ownStuffResponse, error: loadStuffError, loading: loadingStuff }] =
    useLazyQuery<StuffListGraphQLResponse>(stuffQuery.getMyAvailableStuff(), {
      variables: {
        excludeSuggested: true,
      },
      fetchPolicy: 'cache-and-network',
    })
  const extraTitle = useMemo(
    () => (selectedStuff ? 'Đã chọn một' : 'Chọn một món để trao đổi'),
    [selectedStuff]
  )

  useEffect(() => {
    if (open) getMyStuff()

    return () => {
      setContainer(null)
      setSelectedStuff(null)
    }
  }, [getMyStuff, open])

  const handleSelectStuff = (stuff: Stuff) => {
    if (selectedStuff && selectedStuff.id === stuff.id) return setSelectedStuff(null)
    setSelectedStuff(stuff)
  }

  const isSelected = useCallback(
    (stuffId: string) => {
      if (!selectedStuff) return false
      return selectedStuff.id === stuffId
    },
    [selectedStuff]
  )

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        width={500}
        bodyStyle={{
          padding: 0,
        }}
        extra={<p>{extraTitle}</p>}
        title={title}
      >
        {!loadingStuff && loadStuffError && !ownStuffResponse?.stuffList && (
          <CenterContainer>
            <h3 className="whitespace-normal">Không tìm thấy tủ đồ của bạn.</h3>
          </CenterContainer>
        )}
        {loadingStuff && (
          <CenterContainer>
            <CircularProgress color="info" />
          </CenterContainer>
        )}
        {!loadingStuff && ownStuffResponse?.stuffList && ownStuffResponse?.stuffList.length > 0 ? (
          <div
            ref={setContainer}
            className="h-full px-4 py-6 overflow-y-auto"
          >
            <div className="grid grid-cols-2 gap-4">
              {ownStuffResponse?.stuffList.map((st) => (
                <StuffOptionCard
                  onEdit={() => {}}
                  selected={isSelected(st.id)}
                  onSelect={handleSelectStuff}
                  key={st.id}
                  data={st}
                />
              ))}
            </div>
            <Affix
              target={() => container}
              offsetBottom={12}
            >
              <Button
                className="mt-5"
                fullWidth
                color="primary"
                disabled={Boolean(!selectedStuff)}
                onClick={() => onConfirm(selectedStuff)}
              >
                Xác nhận
              </Button>
            </Affix>
          </div>
        ) : (
          <CenterContainer>
            <div className="flex flex-col">
              <h3>Bạn chưa thêm món đồ nào.</h3>
              <Button
                className="mt-3"
                color="info"
                onClick={() => {
                  onClose()
                  // onOpen()
                  setOpenAddModal(true)
                }}
              >
                Thêm ngay
              </Button>
            </div>
          </CenterContainer>
        )}
      </Drawer>
      <AddingModal
      isStored = {true}
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false)
        }}
      />
    </>
  )
}

export default SelectStuffDrawer
