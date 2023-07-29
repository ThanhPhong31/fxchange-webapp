import FavoriteIcon from '@mui/icons-material/Favorite'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import RestoreIcon from '@mui/icons-material/Restore'
import { BottomNavigation as Navigation, BottomNavigationAction } from '@mui/material'
import * as React from 'react'

export default function BottomNavigation() {
  const [value, setValue] = React.useState(0)

  return (
    <Navigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
    >
      a
      {/* <BottomNavigationAction
        label="Recents"
        icon={<RestoreIcon />}
      />
      <BottomNavigationAction
        label="Favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Nearby"
        icon={<LocationOnIcon />}
      /> */}
    </Navigation>
  )
}
