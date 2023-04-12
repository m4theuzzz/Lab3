import { Fragment } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { Divider } from '@mui/material'

const Modal = ({ open, title, close, children, minWidth }: any) => {
  return (
    <Fragment>
      <Dialog
        sx={
          minWidth
            ? {
                '& .MuiDialog-container': {
                  '& .MuiPaper-root': {
                    width: '100%',
                    minWidth: minWidth // Set your width here
                  }
                }
              }
            : {}
        }
        open={open}
        onClose={close}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* <Divider sx={{m:0, mb: 3}} /> */}
          {children}
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default Modal
